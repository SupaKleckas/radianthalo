import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import { getServiceById } from "@/app/actions/service/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { getUserById } from "@/app/actions/user/db";
import RescheduleSelection from "@/app/components/Rescheduling/RescheduleSelection";
import { getEmployeesByService } from "@/app/actions/user/db";

export type paramsType = Promise<{
    id?: string
}>;

export default async function Page(props: { params: paramsType }) {
    const { id } = await props.params;

    if (!id) {
        redirect("/home/appointments")
    }
    const appt = await getAppointmentById(id);
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