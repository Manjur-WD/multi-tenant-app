import { useContext, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LogoutDrop from "@/components/LogoutDrop";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { AuthContext } from "@/context/AuthGlobalContext";

import { SquarePen } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { deleteProductById } from "../../services/productService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import EditProduct from "./EditProduct";

export default function ProductList() {
  const [refetch, setRefetch] = useState(true);
  const [open, setOpen] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});
  const { user } = useContext(AuthContext);
  const tenantId = user?.uid;

  // Pagination & Search states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async (data) => {
      return await deleteProductById(data.id);
    },
    onMutate: () => {
      toast.loading("Deleting...");
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      toast.dismiss();
      setRefetch((prev) => !prev);
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", tenantId, refetch],
    queryFn: () => getAllProducts(tenantId),
    enabled: !!tenantId,
    refetchOnWindowFocus: false,
  });

  // Filter products by search term (name)
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // Pagination slicing
  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  // Reset page when filteredProducts or rowsPerPage change
  useEffect(() => {
    setPage(0);
  }, [filteredProducts, rowsPerPage]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
          const timestamp = row.original?.createdAt?.seconds;
          return timestamp
            ? new Date(timestamp * 1000).toLocaleString()
            : "N/A";
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;

          const handleEdit = () => {
            setOpen(true);
            setSingleProduct(product);
          };

          const handleDelete = () => {
            deleteMutation.mutate({ id: product.id });
          };

          return (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-1 cursor-pointer text-sm text-white rounded shadow"
              >
                <SquarePen className="w-4 text-blue-500" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 cursor-pointer text-sm text-white rounded shadow"
              >
                <Trash2 className="w-4 text-red-500" />
              </button>
            </div>
          );
        },
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: paginatedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-2 border-b">
        <div className="h-4 bg-gray-300 rounded w-32" />
      </td>
      <td className="px-4 py-2 border-b">
        <div className="h-4 bg-gray-300 rounded w-20" />
      </td>
      <td className="px-4 py-2 border-b">
        <div className="h-4 bg-gray-300 rounded w-40" />
      </td>
      <td className="px-4 py-2 border-b flex gap-2">
        <div className="h-4 bg-gray-300 rounded w-5" />
        <div className="h-4 bg-gray-300 rounded w-5" />
      </td>
    </tr>
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 justify-between items-center gap-2 bg-accent border rounded-2xl px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-xl">
                  <BreadcrumbLink href="#">Product List</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <LogoutDrop />
        </header>

        <section className="flex flex-col gap-4 p-4 max-h-[90vh] overflow-auto font-dmsans">
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1 max-w-sm"
            />

            <select
              className="border rounded px-3 py-1"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {[5, 10, 25].map((num) => (
                <option key={num} value={num}>
                  {num} rows per page
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-auto border rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-muted text-left">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2 text-sm font-semibold border-b"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((_, idx) => (
                      <SkeletonRow key={idx} />
                    ))
                  : table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-2 text-sm border-b"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-4">
                          No products found.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-3">
            <button
              className="btn btn-outline"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>

          <EditProduct
            open={open}
            setOpen={setOpen}
            refetch={refetch}
            setRefetch={setRefetch}
            singleProduct={singleProduct}
          />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
