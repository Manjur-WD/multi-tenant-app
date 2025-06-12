import React, { useContext } from "react"
import { useQuery } from "@tanstack/react-query"


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getLastFiveProducts } from "../../services/productService"
import { AuthContext } from "../../context/AuthGlobalContext"

export function RecentData() {

    const { user } = useContext(AuthContext);
    // console.log(user.uid);

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ["last-5-products", user?.uid],
        queryFn: async() => await getLastFiveProducts(user.uid),
        enabled: !!user?.uid,
    });

    const total = products.reduce((sum, item) => sum + (item.price || 0), 0)

    return (
        <div className="bg-white rounded-2xl shadow-lg border py-5 px-2">
            <Table>
                <TableCaption>A list of your 5 most recent added products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={3}>Loading...</TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-red-500">
                                Error loading products.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    {product.createdAt?.toDate
                                        ? product.createdAt.toDate().toLocaleDateString()
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    ${product.price?.toLocaleString() || "0"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">
                            ${total.toLocaleString()}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
