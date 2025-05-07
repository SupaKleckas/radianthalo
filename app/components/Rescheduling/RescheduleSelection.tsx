"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link";
import { HiArrowSmLeft } from "react-icons/hi";
import { Appointment, User, Service } from "@prisma/client";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { TimeSelection } from "../Booking/TimeSelection";
import { BookingCalendar } from "../Booking/Calendar";
import { formatInTimeZone, format } from "date-fns-tz";
import { EmployeeSelection } from "../Booking/EmployeeSelectionAppointment";
import { getUnavailableWeekdays } from "@/app/lib/date/availability";
import { SubmitButton } from "../UI/Buttons";
import { Button } from "@/components/ui/button";
import { HiOutlineClock } from "react-icons/hi";
import { getEmployeeTimeOff } from "@/app/lib/date/availability";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAppointmentAction, updateAppointmentAction } from "@/app/actions/appointment/actions";

export default function RescheduleSelection({ appt, serviceEmployees, currEmployee, service }: { appt: Appointment, serviceEmployees: User[], currEmployee: User, service: Service }) {
    const [selectedEmployee, setSelectedEmployee] = useState(currEmployee);
    const [date, setDate] = useState<Date>(new Date(appt.startTime.getFullYear(), appt.startTime.getMonth(), appt.startTime.getDate() + 1));
    const [time, setTime] = useState<string | null>(null);
    const [unavailableWeekday, setUnavailableWeekday] = useState<string[]>([]);
    const [unavailableDay, setUnavailableDay] = useState<string[]>([]);

    useEffect(() => {
        if (selectedEmployee) {
            const fetchAvailability = async () => {
                const unavailableWeekdays = await getUnavailableWeekdays(selectedEmployee.id);
                const unavailableDays = await getEmployeeTimeOff(selectedEmployee.id);
                setUnavailableWeekday(unavailableWeekdays || []);
                setUnavailableDay(unavailableDays || []);
            };
            fetchAvailability();
        }
    }, [selectedEmployee]);

    return (
        <Card className="max-w-[1100px] w-full mx-auto bg-slate-300 text-slate-800">
            <Link href={`/home/appointments/${appt.id}`}>
                <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                    <HiArrowSmLeft className='text-4xl' />
                    <p>Back to appointment</p>
                </div>
            </Link>
            <CardHeader className="text-4xl font-bold">
                Reschedule appointment
            </CardHeader>
            <CardContent className="flex flex-col justify-between lg:grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
                <div className="flex-1 mb-5">
                    <h1 className="text-3xl py-2 mb-4 font-semibold">{appt.title}</h1>
                    <span className="flex items-center font-medium text-2xl mb-5">
                        <HiOutlineClock /> {formatInTimeZone(appt.startTime, 'UTC', "HH:mm")} - {formatInTimeZone(appt.endTime, 'UTC', "HH:mm")}
                    </span>
                    <EmployeeSelection selectionContent={serviceEmployees} selectedValue={selectedEmployee} setSelectedValue={setSelectedEmployee} />
                </div>
                <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                <Separator orientation="horizontal" className="w-f-ull h-[4px] bg-slate-500 lg:hidden block" />
                <div className="flex-1 mt-5 mb-5 lg:mt-0">
                    <BookingCalendar selectedDate={date} setSelectedDate={setDate} unavailableWeekday={unavailableWeekday} unavailableDay={unavailableDay} />
                </div>
                <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                <Separator orientation="horizontal" className="w-f-ull h-[4px] bg-slate-500 lg:hidden block" />
                <div className="flex-1 mt-5 mb-5 lg:mt-0">
                    {selectedEmployee && (
                        <TimeSelection employee={selectedEmployee} selectedDate={date} selectedTime={time} setSelectedTime={setTime}
                            unavailable={unavailableWeekday.includes(format(date, "EEEE")) || unavailableDay.includes(format(date, "yyyy-MM-dd"))} />
                    )}
                </div>
            </CardContent>
            <div className="flex flex-row justify-end gap-x-4 mr-4">
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"ghost"} className='hover:cursor-pointer'> Cancel Appointment </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="z-[800]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>{`Are you sure you want to cancel your appointment for ${appt.title} on ${format(appt.startTime, "MMMM do")}?`}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. The appointment will be cancelled.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="hover:cursor-pointer hover:bg-slate-300">Go Back</AlertDialogCancel>
                                <form action={deleteAppointmentAction.bind(null, appt.id)}>
                                    <AlertDialogAction asChild >
                                        <Button type="submit" className="bg-slate-700 w-full md:w-fit hover:cursor-pointer">Cancel appointment</Button>
                                    </AlertDialogAction>
                                </form>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                {selectedEmployee && time ?
                    <form action={updateAppointmentAction.bind(null, appt, selectedEmployee, date, time, service, Intl.DateTimeFormat().resolvedOptions().timeZone)}>
                        <SubmitButton text="Submit changes" />
                    </form>
                    :
                    null
                }
            </div>
        </Card>
    )
}