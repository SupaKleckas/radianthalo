"use client";
import { useState, useEffect, Suspense } from "react";
import { Employee, User } from "@prisma/client";
import { format } from "date-fns"
import { getAvailableTimeSlots } from "@/app/actions/appointment/actions";
import { Button } from "@/components/ui/button";

interface TimeParams {
    employee: Employee & { user: User };
    selectedDate: Date;
    selectedTime: string | null;
    setSelectedTime: (value: string | null) => void;
    unavailable: boolean
}

export function TimeSelection({ employee, selectedDate, selectedTime, setSelectedTime, unavailable }: TimeParams) {
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!employee || !selectedDate) return;

        setLoading(true);
        getAvailableTimeSlots({ userId: employee.userId }, selectedDate, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .then((times) => {
                if (unavailable) {
                    setAvailableTimes([]);
                } else if (times.length > 0) {
                    setAvailableTimes(times);
                    setSelectedTime(times[0])
                } else {
                    setAvailableTimes([]);
                }
            })
            .finally(() => setLoading(false));
    }, [employee, selectedDate, unavailable]);

    return (
        <div className="flex flex-col items-center gap-2 mt-4 mb-4">
            <div className="flex items-start w-[80%] ml-4">
                <p className="text-base font-semibold">{format(selectedDate, "EEE")} {" "} <span>{format(selectedDate, "MMM. d")}</span>
                </p>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : availableTimes.length === 0 ? (
                <p>No available slots.</p>
            ) : (
                <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                        <Button
                            key={time}
                            type="button"
                            className={`p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:cursor-pointer ${selectedTime === time ? "bg-slate-500 text-white hover:bg-slate-600" : ""}`}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}