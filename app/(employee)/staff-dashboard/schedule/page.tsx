import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { format } from "date-fns-tz"
import { getEmployeeAppointmetns } from "@/app/actions/appointment/db";
import { PaginationComponent } from "@/app/components/Page/Pagination";
import { Appointment } from "@prisma/client";
import { getUserIdFromSession } from "@/app/lib/auth/session";
import { groupByDate } from "@/app/lib/grouping/groupByDate";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    const [appointments, meta] = await getEmployeeAppointmetns(currPage, userId);
    const pageAmount = meta?.pageCount;
    const dateGroups = groupByDate(appointments);

    /* left for testing purposes later
    const before = new Date();
    before.setDate(before.getDate() + 1)
    before.setHours(before.getHours() - 10)
    */

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div>
                <div className="text-slate-800 mb-6">
                    <h1 className="text-5xl">Your Schedule</h1>
                    <h1 className="text-base opacity-60">Take a look at your schedule!</h1>
                </div>
                <PaginationComponent pageAmount={pageAmount} />
                <div>
                    {dateGroups.map(([date, appts]: [string, Appointment[]]) =>
                        <div key={date} className="w-full px-4 mb-6">
                            <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700 border-">{format(new Date(date), "MMMM do, yyyy")}</h1>
                            <ul>
                                {appts.map(appointment =>
                                    <li key={appointment.id} className="flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-[#7d94b6]">
                                        {/* <Link href={`/dashboard/service/${appointment.id}`} className="w-full p-4"> */}
                                        <div className="w-full p-4">
                                            <div className="flex items-center flex-col lg:flex-row space-x-6 text-base">
                                                <span className="flex items-center lg:w-1/2"> <HiOutlineCalendar /> {appointment.title}</span>
                                                <span className="flex items-center lg:w-1/2"> <HiOutlineClock /> {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}</span>
                                            </div>
                                        </div>
                                        {/* </Link> */}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
}