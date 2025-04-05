"use client";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineClock, HiOutlineCash, HiArrowSmLeft } from "react-icons/hi";
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookingCalendar } from "@/app/components/Booking/Calendar";
import { TimeSelection } from "@/app/components/Booking/TimeSelection";
import { EmployeeSelection } from "@/app/components/Booking/EmployeeSelectionAppointment";
import { Service, Employee, User } from "@prisma/client";
import { addAppointmentByBooking } from "@/app/actions/appointmentActions";
import { SubmitButton } from "../Buttons";

export function Booking({ service, employees }: { service: Service, employees: (Employee & { user: User })[] }) {
    const now = new Date();
    const [selectedEmployee, setSelectedEmployee] = useState(employees.length > 0 ? employees[0] : null);
    const [date, setDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const [time, setTime] = useState<string | null>(null);

    return (
        <form action={(selectedEmployee && time) ? addAppointmentByBooking.bind(null, selectedEmployee, date, time, service, Intl.DateTimeFormat().resolvedOptions().timeZone) : undefined}>
            <div className="w-full justify-center">
                <Card className="max-w-[1000px] w-full mx-auto bg-slate-300 text-slate-800">
                    <Link href="/home/services">
                        <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                            <HiArrowSmLeft className='text-4xl' />
                            <p>Back to services</p>
                        </div>
                    </Link>
                    <CardContent className="flex flex-col justify-between md:grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
                        <div className="flex-1 mb-5">
                            <h1 className="text-5xl py-2 mb-4 font-semibold">Book {service.title}</h1>
                            <span className="flex items-center font-medium text-2xl mb-5">
                                <HiOutlineClock /> {service.duration} min
                            </span>
                            <span className="flex items-center font-medium text-2xl mb-5">
                                <HiOutlineCash /> {service.price} €
                            </span>
                            <EmployeeSelection selectionContent={employees} selectedValue={selectedEmployee} setSelectedValue={setSelectedEmployee} />
                        </div>
                        <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 md:block hidden" />
                        <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 md:hidden block" />
                        <div className="flex-1 mt-5 mb-5 md:mt-0">
                            <BookingCalendar selectedDate={date} setSelectedDate={setDate} />
                        </div>
                        <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 md:block hidden" />
                        <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 md:hidden block" />
                        <div className="flex-1 mt-5 mb-5 md:mt-0">
                            {selectedEmployee && (
                                <TimeSelection employee={selectedEmployee} selectedDate={date} selectedTime={time} setSelectedTime={setTime} />
                            )}
                        </div>
                        <div className="flex justify-end col-start-5">
                            <SubmitButton text="Book now!" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}