"use client";
import React, { useState, useEffect } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { HiOutlineCalendar } from "react-icons/hi";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SubmitButton } from "../UI/Buttons";
import { addTemporaryLeave } from "@/app/actions/availibility/actions";


export default function TemporaryLeaveForm() {
    const now = new Date();
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();

    useEffect(() => {
        if (fromDate && toDate && fromDate > toDate) {
            setToDate(addDays(fromDate, 1));
        }
    }, [fromDate, toDate]);

    return (
        <Card className="bg-slate-300">
            <CardHeader>
                <h1 className="text-slate-800 text-3xl">Temporary leave</h1>
            </CardHeader>
            <form action={fromDate && toDate && addTemporaryLeave.bind(null, fromDate, toDate, Intl.DateTimeFormat().resolvedOptions().timeZone)}>
                <CardContent className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={`w-[300px] justify-start text-left text-slate-600 hover:cursor-pointer`}>
                                <HiOutlineCalendar />
                                {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={fromDate}
                                onSelect={setFromDate}
                                initialFocus
                                disabled={(date) => {
                                    const isPast = date.getTime() <= now.getTime();
                                    return isPast;
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={`w-[300px] justify-start text-left text-slate-600 hover:cursor-pointer`}>
                                <HiOutlineCalendar />
                                {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={toDate}
                                onSelect={setToDate}
                                initialFocus
                                disabled={(date) => {
                                    const isPast = date.getTime() <= now.getTime();
                                    let earlierThanStart = false;
                                    if (fromDate) {
                                        earlierThanStart = date < fromDate;
                                    }
                                    return isPast || earlierThanStart;
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </CardContent>
                <CardFooter className="flex justify-end mt-4">
                    <SubmitButton text="Submit" />
                </CardFooter>
            </form>
        </Card>
    )
}