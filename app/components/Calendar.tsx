"use client";

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";

export function BookingCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const fromDate = new Date();
    const toDate = new Date(fromDate.getFullYear(),
        fromDate.getMonth() + 2,
        fromDate.getDate())

    return (
        <div className="flex items-center justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                    (date.getTime() < Date.now()) || (date.getTime() > toDate.getTime())
                }
            />
        </div>
    )
}