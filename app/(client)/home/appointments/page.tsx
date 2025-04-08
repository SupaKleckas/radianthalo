import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import Link from "next/link";
import { format } from "date-fns-tz"
import { getClientAppointmetns } from "@/app/actions/appointment/db";
import { PaginationComponent } from "@/app/components/Pagination";
import { Appointment } from "@prisma/client";
import { getUserIdFromSession } from "@/app/lib/auth/session";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import { groupByDate } from "@/app/lib/date/dateFunctions";

interface SearchParamsProps {
    searchParams?: {
        page?: string;
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return;
    }

    const params = await searchParams;
    const currPage = Number(params?.page) || 1;
    const [appointments, meta] = await getClientAppointmetns(currPage, userId);
    const pageAmount = meta?.pageCount;
    const dateGroups = groupByDate(appointments);

    /* left for testing purposes later
    const before = new Date();
    before.setDate(before.getDate() + 1)
    before.setHours(before.getHours() - 10)
    */

    return (
        <div className="flex flex-col items-center justify-center py-3">
            {appointments.length == 0 ?
                <div className="flex items-center justify-center flex-col xl:flex-row text-2xl xl:text-4xl xl:gap-6 mt-[10%]">
                    <h1> No recent or upcoming appointments?</h1>
                    <Link href="/home/services" className="text-1xl hover:cursor-pointer hover:text-slate-600"> Book an appointment now! </Link>
                </div>
                :
                <>
                    <h1 className="text-4xl mb-4"> My Appointments </h1>
                    <ScrollArea className="w-full">
                        {dateGroups.map(([date, appts]: [string, Appointment[]]) =>
                            <div key={date} className="w-full px-4 mb-6">
                                <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700 border-">{format(new Date(date), "MMMM do, yyyy")}</h1>
                                <ul>
                                    {appts.map(appointment =>
                                        <li key={appointment.id} className="flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-[#7d94b6]">
                                            <Link href={`/dashboard/service/${appointment.id}`} className="w-full p-4">
                                                <div className="flex items-center flex-col lg:flex-row space-x-6 text-base">
                                                    <span className="flex items-center lg:w-1/2"> <HiOutlineCalendar /> {appointment.title}</span>
                                                    <span className="flex items-center lg:w-1/2"> <HiOutlineClock /> {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}</span>
                                                    {appointment.endTime < new Date() ?
                                                        <Button variant={"link"} className="text-1xl hover:cursor-pointer hover:text-slate-600"> Leave a review! </Button>
                                                        :
                                                        null}
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                        )}
                    </ScrollArea>
                    <PaginationComponent pageAmount={pageAmount} />
                </>
            }
        </div>
    );
}