import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { getServiceById } from "@/app/actions/serviceDbActions";
import { getEmployees } from "@/app/actions/userDbActions";
import EditServiceForm from "@/app/components/EditServiceForm";

interface ServiceParams {
    params: {
        id: string;
    };
}

export default async function Page({ params }: ServiceParams) {
    const { id } = await params;
    const service = await getServiceById(id);
    const employees = await getEmployees();

    return (
        <div className="">
            <div className='mb-6'>
                <Link href="/dashboard/services">
                    <div className="flex flex-row items-center hover:cursor-pointer size-fit hover:text-[#7d94b6] transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to services</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6"> Edit Service </h1>
                <div className='w-full'>
                    {service && <EditServiceForm service={service} employees={employees} />}
                </div>
            </div>
        </div>
    );
}