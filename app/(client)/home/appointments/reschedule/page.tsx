import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import { getServiceById } from "@/app/actions/service/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { getUserById } from "@/app/actions/user/db";
import RescheduleSelection from "@/app/components/Rescheduling/RescheduleSelection";
import { getEmployeesByService } from "@/app/actions/user/db";

interface SearchParamsProps {
    searchParams?: {
        id?: string;
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    const params = await searchParams;
    if (!params?.id) {
        redirect("/home/appointments")
    }
    const appt = await getAppointmentById(params.id);
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.userId != appt?.clientId || !appt || !appt.serviceId || !appt.employeeId) {
        redirect("/home/appointments")
    }

    const service = await getServiceById(appt.serviceId);
    const employee = await getUserById(appt.employeeId);

    if (!service || !employee) {
        redirect("/home/appointments")
    }

    const employees = await getEmployeesByService(service.id);

    return (
        <RescheduleSelection appt={appt} serviceEmployees={employees} currEmployee={employee} service={service} />
    )
}