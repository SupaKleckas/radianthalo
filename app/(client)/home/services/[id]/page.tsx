import { getServiceById } from "@/app/actions/service/db";
import { redirect } from "next/navigation";
import { getEmployeesByService } from "@/app/actions/user/db";
import { Booking } from "@/app/components/Booking/Booking";

type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
    const { id } = await props.params;

    if (!id) {
        redirect("/dashboard/services");
    }

    const service = await getServiceById(id);

    if (!service) {
        redirect("/home/services");
    }

    const employees = await getEmployeesByService(service.id);

    return (
        <Booking service={service} employees={employees} />
    )
}