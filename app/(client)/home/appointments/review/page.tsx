import { getAppointmentById } from "@/app/actions/appointment/db";
import { redirect } from "next/navigation";
import ReviewForm from "@/app/components/Review/ReviewForm";
import { getServiceById } from "@/app/actions/service/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { getUserById } from "@/app/actions/user/db";

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
    const userAppointment = await getAppointmentById(params.id);
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
        <ReviewForm apt={userAppointment} service={service} employee={employee} clientId={user.userId} />
    )
}