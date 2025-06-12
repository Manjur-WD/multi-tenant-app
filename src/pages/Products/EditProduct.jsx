import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { updateProduct } from "../../services/productService"
import { toast } from "sonner"


const EditProduct = ({ open, setOpen, refetch, setRefetch, singleProduct }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    // Reset form when singleProduct changes
    useEffect(() => {
        if (singleProduct) {
            reset({
                name: singleProduct.name,
                price: singleProduct.price,
                id: singleProduct.id,
            })
        }
    }, [singleProduct, reset])

    const editMutation = useMutation({
        mutationFn: async (data) => {
            return await updateProduct(data.id, data.updatedData);
        },
        onMutate: () => {
            toast.loading("Updating...")
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
            }
            else {
                toast.error(response.message);
            }
            setOpen(false);
            toast.dismiss();
            setRefetch((prev) => !prev);
        },
        onError: (err) => {
            console.error("Update failed:", err)
        },
    })

    const onSubmit = (data) => {

        const payload = { id: data.id, updatedData: { name: data.name, price: data.price } };
        // console.log(payload);
        editMutation.mutate(payload);

    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{/* Optional trigger */}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                    <SheetDescription>
                        Make changes to your product here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            {...register("price", { required: true, valueAsNumber: true })}
                        />
                    </div>

                    <SheetFooter>
                        <Button type="submit" disabled={editMutation.isPending}>
                            {editMutation.isPending ? "Saving..." : "Save changes"}
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Close
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default EditProduct