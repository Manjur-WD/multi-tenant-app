import React, { useContext } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getDailyProductCounts } from "../../services/analytics"
import { AuthContext } from "../../context/AuthGlobalContext"

export const description = "An interactive bar chart"

const chartConfig = {
    products: {
        label: "Products Added",
    },
}

export function Analytics() {

    const { user } = useContext(AuthContext);
    // console.log(user.uid);

    const { data: chartData = [], isLoading } = useQuery({
        queryKey: ["product-daily-counts", user.uid],
        queryFn: async () => await getDailyProductCounts(user.uid),
        enabled: !!user?.uid,
    })

    console.log(chartData);
    

    return (
        <Card className="pt-3">
            <CardHeader className="flex flex-col items-stretch border-b sm:flex-row pt-3">
                <div className="flex flex-1 flex-col justify-center gap-1">
                    <CardTitle>Daily Product Adds</CardTitle>
                    <CardDescription>
                        Number of products added per day (last 30 days)
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2">
                {isLoading ? (
                    <p className="text-muted">Loading chart...</p>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            data={chartData}
                            margin={{ left: 12, right: 12 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="products"
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }
                                    />
                                }
                            />
                            <Bar dataKey="products" fill="var(--color-primary)" />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
