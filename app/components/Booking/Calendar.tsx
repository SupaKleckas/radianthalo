"use client";

import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns";

interface CalendarParams {
    selectedDate: Date
    setSelectedDate: (value: Date) => void
    unavailable: string[]
}

export function BookingCalendar({ selectedDate, setSelectedDate, unavailable }: CalendarParams) {
    const now = new Date();
    const maxSelectable = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

    return (
        <div className="flex items-center justify-center">
            <Calendar
                className="border-0 text-slate-600"
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                    if (date) {
                        setSelectedDate(date);
                    }
                }}
                disabled={(date) => {
                    const isPast = date.getTime() <= now.getTime();
                    const isTooFar = date > maxSelectable;
                    const isUnavailable = unavailable.includes(format(date, "EEEE"))
                    return isPast || isTooFar || isUnavailable;
                }}
            />
        </div>
    );
}