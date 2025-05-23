"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { getTimezoneOffset, format } from "date-fns-tz";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from "@/components/ui/button";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { HiOutlineClock, HiOutlineUser, HiOutlineCash } from "react-icons/hi";

interface AppointmentEvent {
    title: string;
    start: Date;
    end: Date;
    client: string,
    paymentMethod: string
}

interface Props {
    appointments: AppointmentEvent[];
}

export default function EmployeeSchedule({ appointments }: Props) {
    // calendar props
    const localizer = momentLocalizer(moment);
    const [timezone, setTimezone] = useState<string>('UTC');
    const [events, setEvents] = useState<AppointmentEvent[]>([]);
    const [view, setView] = useState<View>("week");
    const [date, setDate] = useState(moment(new Date()).toDate());
    //event props
    const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);
    const [openAlert, setOpenAlert] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setView("day");
            } else {
                setView("week");
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        if (timezone && appointments.length) {
            const offsetHours = getTimezoneOffset(timezone) / (3600 * 1000)
            const timeZonedEvents = appointments.map(appt => ({
                ...appt,
                start: new Date(appt.start.getFullYear(), appt.start.getMonth(), appt.start.getDate(), appt.start.getHours() - offsetHours, appt.start.getMinutes(), 0, 0),
                end: new Date(appt.end.getFullYear(), appt.end.getMonth(), appt.end.getDate(), appt.end.getHours() - offsetHours, appt.end.getMinutes(), 0, 0),
            }));
            setEvents(timeZonedEvents);
        }
    }, [appointments, timezone]);

    const nextDateClick = useCallback(() => {
        if (view === "day") {
            setDate(moment(date).add(1, 'd').toDate());
        } else if (view === "week") {
            setDate(moment(date).add(1, 'w').toDate());
        }
    }, [view, date]);

    const prevDateClick = useCallback(() => {
        if (view === "day") {
            setDate(moment(date).subtract(1, 'd').toDate());
        } else if (view === "week") {
            setDate(moment(date).subtract(1, 'w').toDate());
        }
    }, [view, date]);

    const dateTextView = useMemo(() => {
        if (view === "day") {
            return moment(date).format("dddd, MMMM DD")
        } else if (view === "week") {
            const start = moment(date).startOf("week");
            const end = moment(date).endOf("week");
            return `${start.format("MMMM Do")} to ${end.format("MMMM Do")}`;
        }
    }, [view, date])

    const formats = {
        timeGutterFormat: 'HH:mm'
    }

    const handleEventClick = (event: AppointmentEvent) => {
        setSelectedEvent(event);
        setOpenAlert(true);
    };

    return (
        <div className="p-4 h-[500px]">
            <div className="flex flex-col items-center md:flex-row md:justify-between md:m-4">
                <Button onClick={() => setDate(moment().toDate())} className={`bg-transparent rounded-none text-slate-800 hover:bg-slate-200 hover:cursor-pointer`}>
                    Go to today
                </Button>
                <div className="flex flex-row items-center gap-x-4">
                    <Button onClick={prevDateClick} className={`bg-transparent hover:bg-transparent text-slate-800 hover:cursor-pointer hover:text-slate-500`}>
                        <HiArrowSmLeft />
                    </Button>
                    <p className="text-slate-800 text-sm md:text-base">{dateTextView}</p>
                    <Button onClick={nextDateClick} className={`bg-transparent hover:bg-transparent text-slate-800 hover:cursor-pointer hover:text-slate-500`}>
                        <HiArrowSmRight />
                    </Button>
                </div>
                <div>
                    <Button onClick={() => setView("day")} className={`rounded-none text-slate-800 hover:bg-slate-300 hover:cursor-pointer ${view === "day" ? "bg-slate-300" : "bg-transparent"}`}>
                        Day
                    </Button>
                    <Button onClick={() => setView("week")} className={`rounded-none hidden md:inline-block md:text-slate-800 hover:bg-slate-300 hover:cursor-pointer ${view === "week" ? "bg-slate-300" : "bg-transparent"}`}>
                        Week
                    </Button>
                </div>
            </div>
            <Calendar
                localizer={localizer}
                formats={formats}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                defaultView="week"
                views={['day', 'week']}
                toolbar={false}
                view={view}
                date={date}
                onSelectEvent={handleEventClick}
                components={{
                    event: ({ event }) => (
                        <div className="flex flex-col mt-1 ml-1 text-[12px]">
                            <p>{event.title}</p>
                        </div>
                    )
                }}
            />
            {selectedEvent && (
                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl text-slate-800">{selectedEvent.title}</AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-y-2 text-base">
                                <span className="flex flex-row items-center justify-center sm:justify-start"> <HiOutlineClock /> {format(selectedEvent.start, "HH:mm")} - {format(selectedEvent.end, "HH:mm")}</span>
                                <span className="flex flex-row items-center justify-center sm:justify-start"> <HiOutlineUser /> {selectedEvent.client}</span>
                                <span className="flex flex-row items-center justify-center sm:justify-start"> <HiOutlineCash /> {selectedEvent.paymentMethod}</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="hover:cursor-pointer hover:bg-slate-300">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}