import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import { format } from "date-fns"
import { getUserById } from "@/app/actions/user/db";
import { Separator } from "@/components/ui/separator"
import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { canLeaveReview } from "@/app/lib/reviews/canLeaveReview";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { Button } from "@/components/ui/button";
import Message from "@/app/components/Notifications/Message";

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: { params: Params, searchParams: SearchParams }) {
    const { id } = await props.params;
    const { status } = await props.searchParams;

    const client = await getUserIdAndRoleFromSession();

    if (!id || !client?.userId || client.role != "USER") {
        redirect("/home/appointments");
    }

    const appt = await getAppointmentById(id);

    if (!appt || !appt.employeeId) {
        redirect("/home/appointments");
    }

    const employee = await getUserById(appt.employeeId);

    const canReview = await canLeaveReview(client.userId, employee?.id, appt.serviceId)
    const canReschedule = appt.endTime >= new Date() && new Date(appt.startTime).getTime() - new Date().getTime() > 24 * 60 * 60 * 1000;

    return (
        <div className="flex flex-col justify-center items-center">
            {status == "reschedule-success" ? <Message type="success" message="Appointment rescheduled succesfully!" /> : null}
            {status == "reschedule-success-noemail" ? <Message type="success" message="Appointment rescheduled succesfully, but
             the confirmation email could not be sent. Please verify your email address later." /> : null}
            <div className="flex flex-col justify-center w-full lg:w-[70%]">
                <Link className="mb-6" href="/home/appointments">
                    <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to appointments</p>
                    </div>
                </Link>

                <h1 className="flex justify-center text-2xl md:text-4xl text-slate-800 font-semibold mb-8">Thank you for booking with Radiant Halo Lounge!</h1>

                <div className="flex flex-col justify-between lg:grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr' }}>
                    <div className="flex flex-col gap-y-4 items-center min-h-[160px]">
                        <p className="text-slate-500">Service</p>
                        <p className="">{appt.title}</p>
                    </div>

                    <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                    <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 lg:hidden block" />

                    <div className="flex flex-col gap-y-4 items-center min-h-[150px] mt-6 md:mt-0">
                        <p className="text-slate-500">Time</p>
                        <p>{format(appt.startTime, "MMMM do, yyyy")} {format(appt.startTime, "HH:mm")} - {format(appt.endTime, "HH:mm")}</p>
                    </div>

                    <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                    <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 lg:hidden block" />

                    <div className="flex flex-col gap-y-4 items-center min-h-[150px] mt-6 md:mt-0">
                        <p className="text-slate-500">Service provider</p>
                        <p>{employee?.firstName + " " + employee?.lastName}</p>
                    </div>
                    <Separator orientation="vertical" className="self-stretch w-[4px] bg-slate-500 lg:block hidden" />
                    <Separator orientation="horizontal" className="w-full h-[4px] bg-slate-500 lg:hidden block" />

                    <div className="flex flex-col gap-y-4 items-center min-h-[150px] mt-6 md:mt-0">
                        <p className="text-slate-500">Payment method</p>
                        <p>{appt.paymentMethod}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-x-4">
                    {appt.endTime < new Date() && canReview ?
                        <Link href={`/home/appointments/review?id=${appt.id}`}>
                            <Button variant={"link"} className="text-1xl hover:cursor-pointer hover:text-slate-600"> Leave a review! </Button>
                        </Link>
                        :
                        null
                    }
                    {canReschedule ?
                        <Link href={`/home/appointments/reschedule?id=${appt.id}`}>
                            <Button className="bg-slate-700 hover:cursor-pointer">Reschedule Appointment</Button>
                        </Link>
                        :
                        null
                    }
                </div>
            </div>
        </div >
    )
}