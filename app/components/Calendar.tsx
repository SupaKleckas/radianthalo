"use client";

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";

interface CalendarParams {
    selectedDate: Date | undefined;
    setSelectedDate: (value: Date | undefined) => void;
}

export function BookingCalendar({ selectedDate, setSelectedDate }: CalendarParams) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const now = new Date();
    const maxSelectable = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

    return (
        <div className="flex items-center justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                    const isPast = date.getTime() < now.getTime();
                    const isTooFar = date > maxSelectable;
                    return isPast || isTooFar;
                }}
            />
        </div>
    );
}