"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboardCharts() {
    const totalCharts = [1, 2, 3, 4];
    //getChartData = [title, data[]]


    return (
        <div>
            <h1 className="text-3xl mb-4">Salon Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {totalCharts.map(chart =>
                    <Card className="bg-slate-300">
                        <CardHeader>
                            <CardTitle>

                            </CardTitle>
                            <CardDescription>

                            </CardDescription>
                        </CardHeader>

                        <CardContent>

                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}