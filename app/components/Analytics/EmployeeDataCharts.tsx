"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartProps {
    apptsPerMonth: {
        month: string
        count: number
    }[],
    mostBookedService: {
        title: string
        count: number
    }[],
}

const apptsPerMonthConfig = {
    month: {
        label: "Month",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig

const mostBookedServiceConfig = {
    month: {
        label: "Title",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig


export default function DataCharts({ apptsPerMonth, mostBookedService }: ChartProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-300">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Appointments per Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={apptsPerMonthConfig} className="min-h-[200px] max-h-[200px] w-full">
                        <BarChart accessibilityLayer data={apptsPerMonth} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="count" radius={10} className="fill-slate-700" >
                                <LabelList position="top" offset={8} dataKey="count" className="fill-slate-800" fontSize={12} />
                            </ Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="bg-slate-300">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Most Booked Services
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={mostBookedServiceConfig} className="max-h-[200px] w-full">
                        <BarChart data={mostBookedService} layout="vertical" barSize={60} margin={{ right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="title" type="category" tickLine={false} axisLine={false} hide />
                            <XAxis dataKey="count" type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="count" layout="vertical" className="fill-slate-700" radius={10}>
                                <LabelList dataKey="title" position="insideLeft" offset={8} className="fill-slate-100" fontSize={14} />
                                <LabelList dataKey="count" position="right" offset={8} className="fill-slate-700" fontSize={14} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}