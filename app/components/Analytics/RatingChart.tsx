"use client";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { HiStar } from "react-icons/hi";

interface ChartProps {
    reviews: {
        rating: number,
        title: string
        count: number
    }[],
    average: number
}

const reviewsConfig = {
    title: {
        label: "Rating",
    },
    count: {
        label: "Count",
    },
} satisfies ChartConfig

export function RatingChart({ reviews, average }: ChartProps) {
    return (
        <Card className="bg-slate-300 min-w-full md:min-w-[60%]">
            <CardContent className="flex flex-row">
                <div className="flex flex-col gap-y-4 min-w-[25%]">
                    <p className="flex text-xl md:text-3xl">Overall rating</p>
                    <p className="flex flex-row text-3xl md:text-5xl font-light"> <HiStar className="fill-yellow-400" /> {average} </p>
                </div>
                <ChartContainer config={reviewsConfig} className="w-full max-h-[200px]">
                    <BarChart data={reviews} layout="vertical" barSize={20} margin={{ right: 20 }} >
                        <YAxis dataKey="title" type="category" tickLine={false} tickMargin={10} axisLine={false} domain={[1, 5]} />
                        <XAxis dataKey="count" type="number" hide />
                        <Bar dataKey="count" layout="vertical" className="fill-slate-500" >
                            <LabelList dataKey="count" position="insideLeft" offset={8} className="fill-slate-900" fontSize={14} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}