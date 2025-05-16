import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import Link from "next/link";
import { format } from "date-fns-tz"
import { getAppointments } from "@/app/actions/appointment/db";
import { deleteExpiredTemporaryAppointmentsAction } from "@/app/actions/appointment/actions";
import { PaginationComponent } from "@/app/components/Page/Pagination";
import { Appointment } from "@prisma/client";
import { groupByDate } from "@/app/lib/grouping/groupByDate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/app/components/Page/Search";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
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

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const { page, query } = await props.searchParams;

    const currPage = Number(page) || 1;
    const [appointments, meta] = await getAppointments(currPage, query);
    const pageAmount = meta?.pageCount;
    const dateGroups = groupByDate(appointments);

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="flex flex-col">
                <div className="flex flex-col text-slate-800 gap-y-2 mb-4">
                    <h1 className="text-5xl">Appointments</h1>
                    <h1 className="text-base opacity-60">Have a look at all appointments.</h1>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="flex flex-col md:flex-row gap-y-4 justify-between">
                        <Search />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"outline"} className="hover:cursor-pointer hover:bg-slate-300 text-slate-800">
                                    Clear expired records
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{`Are you sure you want to clear all expired records?`}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will delete all expired temporary appointment records from the database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="hover:cursor-pointer hover:bg-slate-300">Cancel</AlertDialogCancel>
                                    <form action={deleteExpiredTemporaryAppointmentsAction}>
                                        <AlertDialogAction asChild >
                                            <Button type="submit" className="bg-slate-700 hover:cursor-pointer">Continue</Button>
                                        </AlertDialogAction>
                                    </form>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <PaginationComponent pageAmount={pageAmount} />
                </Suspense>
                <Suspense fallback={<div className="text-center py-4">Loading appointments...</div>}>
                    {appointments.length === 0 && (
                        <div className="text-center mt-8 text-slate-600">
                            {query
                                ? `No appointments found matching "${query}"`
                                : "No apointments found"}
                        </div>
                    )}
                    {dateGroups.map(([date, appts]: [string, Appointment[]]) =>
                        <div key={date} className="w-full px-4 mb-6 items-center justify-center">
                            <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700 border-">{format(new Date(date), "MMMM do, yyyy")}</h1>
                            <ul>
                                {appts.map(appointment =>
                                    <li key={appointment.id} className="flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500">
                                        <Link href={`/dashboard/appointments/${appointment.id}`} className="w-full p-4">
                                            <div className="flex lg:items-center flex-col lg:flex-row space-x-6 text-base">
                                                <span className="flex items-center lg:w-1/2"> <HiOutlineCalendar /> {appointment.title}</span>
                                                <span className="flex items-center lg:w-1/2"> <HiOutlineClock /> {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </Suspense>
            </div>
        </ScrollArea>
    );

}