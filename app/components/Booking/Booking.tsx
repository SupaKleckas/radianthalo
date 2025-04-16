"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineClock, HiOutlineCash, HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookingCalendar } from "@/app/components/Booking/Calendar";
import { TimeSelection } from "@/app/components/Booking/TimeSelection";
import { EmployeeSelection } from "@/app/components/Booking/EmployeeSelectionAppointment";
import { Service, Employee, User } from "@prisma/client";
import { addAppointmentByBooking } from "@/app/actions/appointment/actions";
import { SubmitButton } from "@/app/components/Buttons";
import { getUnavailableWeekdays } from "@/app/lib/date/availability";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Booking({ service, employees }: { service: Service, employees: (Employee & { user: User })[] }) {
    const now = new Date();
    const [selectedEmployee, setSelectedEmployee] = useState(employees.length > 0 ? employees[0] : null);
    const [date, setDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const [time, setTime] = useState<string | null>(null);
    const [unavailable, setUnavailable] = useState<string[]>([]);
    const [next, setNext] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    useEffect(() => {
        if (selectedEmployee) {
            const fetchAvailability = async () => {
                const unavailableWeekdays = await getUnavailableWeekdays(selectedEmployee.userId);
                setUnavailable(unavailableWeekdays || []);
            };
            fetchAvailability();
        }
    }, [selectedEmployee]);

    const handlePaymentSelection = () => {
        if (paymentMethod === "cash") {
            if (selectedEmployee && time) {
                addAppointmentByBooking(selectedEmployee, date, time, service, Intl.DateTimeFormat().resolvedOptions().timeZone);
            }
        } else if (paymentMethod === "card") {
            console.log("Card selected");
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
                                <BookingCalendar selectedDate={date} setSelectedDate={setDate} unavailable={unavailable} />
                            </div>
                            <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                            <Separator orientation="horizontal" className="w-f-ull h-[4px] bg-slate-500 lg:hidden block" />
                            <div className="flex-1 mt-5 mb-5 lg:mt-0">
                                {selectedEmployee && (
                                    <TimeSelection employee={selectedEmployee} selectedDate={date} selectedTime={time} setSelectedTime={setTime} unavailable={unavailable.includes(format(date, "EEEE"))} />
                                )}
                            </div>
                            <div className="flex justify-end col-start-5">
                                <Button className="w-fit bg-slate-700 hover:cursor-pointer" onClick={() => setNext(true)}>Next <HiArrowSmRight /></Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                :
                <div className="w-full justify-center">
                    <Card className="max-w-[1100px] w-full mx-auto bg-slate-300 text-slate-800">
                        <button onClick={() => setNext(false)} className=" flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                            <HiArrowSmLeft className='text-4xl' />Go back
                        </button>
                        <CardContent className="">
                            <h1 className="text-4xl text-slate-800 mb-4">You will be paying by...</h1>
                            <RadioGroup className="flex flex-col " onValueChange={setPaymentMethod} defaultValue="cash">
                                <span className="flex flex-row gap-4 items-center">
                                    <RadioGroupItem id="cash" value="cash">Cash</RadioGroupItem>
                                    <Label htmlFor="cash" className="text-2xl">Cash</Label>
                                </span>
                                <span className="flex flex-row gap-4 items-center" >
                                    <RadioGroupItem id="card" value="card">Card</RadioGroupItem>
                                    <Label htmlFor="card" className="text-2xl">Online payment</Label>
                                </span>
                            </RadioGroup>
                            <div className="flex justify-end col-start-5">
                                <Button className="w-fit bg-slate-700 hover:cursor-pointer" onClick={handlePaymentSelection}>Book now!</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
        </>
    );
}