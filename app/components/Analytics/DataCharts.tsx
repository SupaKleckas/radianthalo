"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartProps {
    apptsPerService: {
        title: string
        count: number
    }[],
    apptsPerWeekday: {
        weekday: string
        count: number
    }[],
    apptsPerEmployee: {
        name: string
        count: number
    }[],
    apptsPerMonth: {
        month: string
        count: number
    }[],
}

const apptsPerServiceConfig = {
    title: {
        label: "Title",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig

const apptsPerWeekdayConfig = {
    title: {
        label: "Title",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig

const appointmentsPerEmployeeConfig = {
    name: {
        label: "Name",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig

const apptsPerMonthConfig = {
    month: {
        label: "Month",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig


export default function DataCharts({ apptsPerService, apptsPerWeekday, apptsPerEmployee, apptsPerMonth }: ChartProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* First Chart - apptsPerService*/}
            <Card className="bg-slate-300 max-h-[260px]">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Top 5 Appointments per Service
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={apptsPerServiceConfig} className="max-h-[160px] w-full">
                        <BarChart data={apptsPerService} layout="vertical" barSize={60} margin={{ right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="title" type="category" tickLine={false} axisLine={false} hide />
                            <XAxis dataKey="count" type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="count" layout="vertical" className="fill-slate-700" radius={10}>
                                <LabelList dataKey="title" position="insideLeft" offset={8} className="fill-slate-100 text-xs" fontSize={14} />
                                <LabelList dataKey="count" position="right" offset={8} className="fill-slate-700" fontSize={14} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            {/* Second Chart - apptsPerWeekday */}
            <Card className="bg-slate-300 max-h-[260px]">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Appointments per Weekday
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={apptsPerWeekdayConfig} className="min-h-[160px] max-h-[160px] w-full">
                        <BarChart accessibilityLayer data={apptsPerWeekday} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="weekday" tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="count" radius={10} className="fill-slate-700" >
                                <LabelList position="top" offset={8} dataKey="count" className="fill-slate-800" fontSize={12} />
                            </ Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            {/* Third Chart - apptsPerMonth */}
            <Card className="bg-slate-300 max-h-[260px]">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Appointments per Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={apptsPerMonthConfig} className="min-h-[160px] max-h-[160px] w-full">
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
            <Card className="bg-slate-300 max-h-[260px]">
                <CardHeader>
                    <CardTitle className="text-slate-800">
                        Top 5 Most Active Employees
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={appointmentsPerEmployeeConfig} className="max-h-[160px] w-full">
                        <BarChart data={apptsPerEmployee} layout="vertical" barSize={60} margin={{ right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} hide />
                            <XAxis dataKey="count" type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="count" layout="vertical" className="fill-slate-700" radius={10}>
                                <LabelList dataKey="name" position="insideLeft" offset={8} className="fill-slate-100 text-xs" fontSize={14} />
                                <LabelList dataKey="count" position="right" offset={8} className="fill-slate-700" fontSize={14} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}