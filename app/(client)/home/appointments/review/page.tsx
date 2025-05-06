import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import ReviewForm from "@/app/components/Review/ReviewForm";
import { getServiceById } from "@/app/actions/service/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { getUserById } from "@/app/actions/user/db";

export type paramsType = Promise<{
    id?: string;
}>;

export default async function Page(props: { params: paramsType }) {
    const { id } = await props.params;
    if (!id) {
        redirect("/home/appointments")
    }
    const userAppointment = await getAppointmentById(id);
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.userId != userAppointment?.clientId || !userAppointment || !userAppointment.serviceId || !userAppointment.employeeId) {
        redirect("/home/appointments")
    }

    const service = await getServiceById(userAppointment.serviceId);
    const employee = await getUserById(userAppointment.employeeId);

    if (!service || !employee) {
        redirect("/home/appointments")
    }

    return (
        <ReviewForm service={service} employee={employee} clientId={user.userId} />
    )
}