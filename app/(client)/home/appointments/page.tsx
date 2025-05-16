import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import Link from "next/link";
import { format } from "date-fns-tz"
import { getClientAppointments } from "@/app/actions/appointment/db";
import { PaginationComponent } from "@/app/components/Page/Pagination";
import { Appointment } from "@prisma/client";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import { groupByDate } from "@/app/lib/grouping/groupByDate";
import Message from "@/app/components/Notifications/Message";
import { canLeaveReview } from "@/app/lib/reviews/canLeaveReview";
import { logout } from "@/app/actions/user/login/actions";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const { page, status } = await props.searchParams;
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        logout();
        redirect("/");
    }

    const currPage = Number(page) || 1;
    const [appointments, meta] = await getClientAppointments(currPage, userInfo.userId);
    const pageAmount = meta?.pageCount;
    const dateGroups = groupByDate(appointments);

    return (
        <ScrollArea className="h-[70vh] md:h-[80vh] w-full rounded-md pr-4">
            {status == "success" ? <Message type="success" message="Appointment booked successfully!" /> : null}
            {status == "review-success" ? <Message type="success" message="Review submitted successfully!" /> : null}
            {status == "cancel-success" ? <Message type="success" message="You successfully cancelled the appointment." /> : null}
            {status == "cancel-success-noemail" ? <Message type="success" message="You successfully cancelled the appointment, but
             the confirmation email could not be sent. Please verify your email address later." /> : null}
            <div className="flex flex-col p-4">
                {appointments.length == 0 ?
                    <div className="flex items-center justify-center flex-col xl:flex-row text-2xl xl:text-4xl xl:gap-6 mt-[10%]">
                        <h1> No recent or upcoming appointments?</h1>
                        <Link href="/home/services" className="text-1xl hover:cursor-pointer hover:text-slate-600"> Book an appointment now! </Link>
                    </div>
                    :
                    <>
                        <div className="flex flex-col mb-4 gap-y-2">
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-800"> My Appointments </h1>
                            <h1 className="text-xl md:text-2xl text-slate-500"> Check out your recent and upcoming appointments here!</h1>
                        </div>
                        <PaginationComponent pageAmount={pageAmount} />
                        {dateGroups.map(([date, appts]: [string, Appointment[]]) =>
                            <div key={date} className="w-full mb-6">
                                <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700 border-">{format(new Date(date), "MMMM do, yyyy")}</h1>
                                <ul>
                                    {appts.map(async (appointment) => {
                                        const canReview = appointment.endTime < new Date() &&
                                            await canLeaveReview(
                                                userInfo.userId,
                                                appointment.employeeId,
                                                appointment.serviceId
                                            );

                                        return (
                                            <li key={appointment.id} className="flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-[#7d94b6]">
                                                <div className="w-full p-4">
                                                    <div className="flex items-center flex-col lg:flex-row space-x-6 text-base">
                                                        <span className="flex items-center lg:w-1/2"> <HiOutlineCalendar /> {appointment.title}</span>
                                                        <span className="flex items-center justify-between lg:w-1/2">
                                                            <div className="flex items-center">
                                                                <HiOutlineClock /> {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}
                                                            </div>
                                                            <div>
                                                                {canReview ?
                                                                    <Link href={`/home/appointments/review?id=${appointment.id}`}>
                                                                        <Button variant={"link"} className="text-1xl hover:cursor-pointer hover:text-slate-600"> Leave a review! </Button>
                                                                    </Link>
                                                                    :
                                                                    null}
                                                                <Link href={`/home/appointments/${appointment.id}`}>
                                                                    <Button variant={"ghost"} className="text-1xl hover:cursor-pointer "> View appointment </Button>
                                                                </Link>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </>
                }
            </div>
        </ScrollArea>
    );
}