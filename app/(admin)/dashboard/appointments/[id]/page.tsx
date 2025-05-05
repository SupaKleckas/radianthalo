import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import { format } from "date-fns"
import { getUserById } from "@/app/actions/user/db";
import { Separator } from "@/components/ui/separator"
import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchParamsProps {
    params: {
        id: string,
    };
}

export default async function Page({ params }: SearchParamsProps) {
    const { id } = await params;

    const appt = await getAppointmentById(id);

    if (!appt) {
        redirect("/home/appointments");
    }

    let employee, client;

    if (appt.employeeId) {
        employee = await getUserById(appt.employeeId);
    }

    if (appt.clientId) {
        client = await getUserById(appt.clientId);
    }

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="flex flex-col justify-center items-center py-8 px-4">
                <div className="flex justify-start w-full">
                    <Link className="mb-6" href="/dashboard/appointments">
                        <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                            <HiArrowSmLeft className='text-4xl' />
                            <p>Back to appointments</p>
                        </div>
                    </Link>
                </div>

                <h1 className="flex justify-center text-2xl md:text-4xl text-slate-800 font-semibold mb-8">Appointment Details</h1>

                <div className="w-full space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-slate-500">Service</p>
                        <p className="text-xl text-slate-700">{appt.title}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-slate-500">Time</p>
                        <p className="text-slate-700">{format(appt.startTime, "MMMM do, yyyy")} {format(appt.startTime, "HH:mm")} - {format(appt.endTime, "HH:mm")}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-slate-500">Payment method</p>
                        <p className="text-slate-700">{appt.paymentMethod}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-slate-500">Service Provider</p>
                        <p className="text-lg text-slate-700"> {employee?.firstName && employee?.lastName ? `${employee.firstName} ${employee.lastName}` : "Employee deleted"} </p>
                    </div>
                    <Separator />
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-slate-500">Client</p>
                        <p className="text-lg text-slate-700"> {client?.firstName && client?.lastName ? `${client.firstName} ${client.lastName}` : "Client deleted"} </p>
                    </div>

                </div>
            </div>
        </ScrollArea>
    )
}