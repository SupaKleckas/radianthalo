import { getServiceById } from "@/app/actions/serviceDbActions";
import { redirect } from "next/navigation";
import { getEmployeesByService } from "@/app/actions/userDbActions";
import { Booking } from "@/app/components/Booking/Booking";

interface ServiceParams {
    params: {
        id: string;
    };
}

export default async function Page({ params }: ServiceParams) {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
        redirect("/home/services");
    }

    const employees = await getEmployeesByService(service.id);

    return (
        <Booking service={service} employees={employees} />
    )
}