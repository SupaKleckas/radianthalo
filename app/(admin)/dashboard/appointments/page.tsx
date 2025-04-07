import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import Link from "next/link";
import { format } from "date-fns-tz"
import { getAppointments } from "@/app/actions/appointmentDbActions";
import { PaginationComponent } from "@/app/components/Pagination";
import { Appointment } from "@prisma/client";
import { groupByDate } from "@/app/lib/dateFunctions";

interface SearchParamsProps {
    searchParams?: {
        page?: string;
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    const params = await searchParams;
    const currPage = Number(params?.page) || 1;
    const [appointments, meta] = await getAppointments(currPage);
    const pageAmount = meta?.pageCount;
    const dateGroups = groupByDate(appointments);

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Appointments </h1>
            {dateGroups.map(([date, appts]: [string, Appointment[]]) =>
                <div key={date} className="w-full px-4 mb-6">
                    <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700 border-">{format(new Date(date), "MMMM do, yyyy")}</h1>
                    <ul>
                        {appts.map(appointment =>
                            <li key={appointment.id} className="flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500">
                                <Link href={`/dashboard/service/${appointment.id}`} className="w-full p-4">
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
            <PaginationComponent pageAmount={pageAmount} />
        </div>
    );
}