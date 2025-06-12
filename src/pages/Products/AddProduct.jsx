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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/services/productService";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const tenantId = auth.currentUser?.uid;
      if (!tenantId) throw new Error("User not authenticated");
      return await createProduct(data, tenantId);
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      reset();
      navigate("/product-list");
    },
    onError: (err) => {
      toast.error("Failed to create product: " + err.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 justify-between shrink-0 items-center gap-2 bg-accent border rounded-2xl relative">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-xl">
                  <BreadcrumbLink href="#">Add Product</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <LogoutDrop />
        </header>

        <section className="flex flex-1 flex-col justify-center gap-4 p-4 max-h-[90vh] overflow-auto font-dmsans">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:w-[500px] space-y-4 bg-white p-6 rounded-xl shadow-md mx-auto w-full"
          >
            <div>
              <Label htmlFor="name" className="mb-2">Product Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price" className="mb-2">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Add Product"}
            </Button>
          </form>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
