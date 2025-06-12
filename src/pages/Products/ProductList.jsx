import { useContext, useEffect, useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { AuthContext } from "@/context/AuthGlobalContext";

export default function ProductList() {
  const { user } = useContext(AuthContext);
  const tenantId = user?.uid;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", tenantId],
    queryFn: () => getAllProducts(tenantId),
    enabled: !!tenantId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (tenantId && products?.length > 0) {
      console.log("Products:", products);
    }
    console.log("Table Data:", table.getRowModel().rows);
  }, [tenantId, products]);

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
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  
  console.log("Table Instance:", table);

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
    </tr>
  );

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

        <section className="flex flex-col gap-4 p-4 max-h-[90vh] overflow-auto">
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
                  ? [...Array(5)].map((_, idx) => <SkeletonRow key={idx} />)
                  : table.getRowModel().rows.map((row) => (
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
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
