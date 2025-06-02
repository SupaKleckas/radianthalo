"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineClock, HiOutlineCash, HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookingCalendar } from "@/app/components/Booking/Calendar";
import { TimeSelection } from "@/app/components/Booking/TimeSelection";
import { EmployeeSelection } from "@/app/components/Booking/EmployeeSelectionAppointment";
import { Service, User } from "@prisma/client";
import { SubmitButton } from "@/app/components/UI/Buttons";
import { getEmployeeTimeOff, getUnavailableWeekdays } from "@/app/lib/date/availability";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { handleBooking } from "@/app/actions/appointment/actions";

export function Booking({ service, employees }: { service: Service, employees: User[] }) {
    const now = new Date();
    const [selectedEmployee, setSelectedEmployee] = useState(employees.length > 0 ? employees[0] : null);
    const [date, setDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const [time, setTime] = useState<string | null>(null);
    const [unavailableWeekday, setUnavailableWeekday] = useState<string[]>([]);
    const [unavailableDay, setUnavailableDay] = useState<string[]>([]);
    const [next, setNext] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");

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

    const handlePaymentSelection = async () => {
        if (selectedEmployee && time) {
            const res = await handleBooking(paymentMethod, selectedEmployee, date, time, service, Intl.DateTimeFormat().resolvedOptions().timeZone);
            if (res?.redirectUrl) {
                window.location.href = res.redirectUrl;
            }
        }
    };

    return (
        <>
            {!next ?
                <div className="w-full justify-center">
                    <Card className="max-w-[1100px] w-full mx-auto bg-slate-300 text-slate-800">
                        <Link href="/home/services">
                            <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                                <HiArrowSmLeft className='text-4xl' />
                                <p>Back to services</p>
                            </div>
                        </Link>
                        <CardContent className="flex flex-col justify-between lg:grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
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
                            <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                            <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 lg:hidden block" />
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
                            <div className="flex justify-end col-start-5">
                                {unavailableDay.includes(format(date, "yyyy-MM-dd")) ? null : <Button className="w-fit bg-slate-700 hover:cursor-pointer" onClick={() => setNext(true)}>Next <HiArrowSmRight /></Button>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                :
                <div className="w-full flex justify-center px-4">
                    <Card className="max-w-[1100px] w-full mx-auto bg-slate-300 text-slate-800">
                        <CardHeader className="pb-4">
                            <button
                                onClick={() => setNext(false)}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:cursor-pointer transition-colors"
                            >
                                <HiArrowSmLeft className="text-2xl" />
                                <span className="text-lg font-medium">Go back</span>
                            </button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-slate-800">Select Payment Method</h1>
                                <p className="text-slate-600">Choose how you would like to pay for your appointment.</p>
                            </div>

                            <form action={handlePaymentSelection} className="space-y-6">
                                <RadioGroup
                                    className="space-y-4"
                                    onValueChange={setPaymentMethod}
                                    defaultValue="cash"
                                >
                                    <div className="flex items-center space-x-4 p-4 rounded-lg border border-slate-400 hover:border-slate-500 transition-colors">
                                        <RadioGroupItem
                                            id="cash"
                                            value="cash"
                                            className="h-6 w-6 text-slate-900"
                                        />
                                        <Label htmlFor="cash" className="text-xl font-medium cursor-pointer w-full">
                                            Pay with Cash
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 rounded-lg border border-slate-400 hover:border-slate-500 transition-colors">
                                        <RadioGroupItem
                                            id="card"
                                            value="card"
                                            className="h-6 w-6 text-slate-900"
                                        />
                                        <Label htmlFor="card" className="text-xl font-medium cursor-pointer w-full">
                                            Pay Online
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="flex justify-end">
                                    <SubmitButton
                                        text="Confirm Booking"
                                        className="w-fit bg-slate-700 hover:cursor-pointer transition-colors"
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            }
        </>
    );
}