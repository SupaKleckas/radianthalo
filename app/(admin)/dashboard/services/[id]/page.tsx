import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { getServiceById } from "@/app/actions/service/db";
import { getEmployees } from "@/app/actions/user/db";
import EditServiceForm from "@/app/components/Service/EditServiceForm";
import { redirect } from "next/navigation";

export type paramsType = Promise<{ id: string }>;

export default async function Page(props: { params: paramsType }) {
    const { id } = await props.params;

    if (!id) {
        redirect("/dashboard/services");
    }

    const service = await getServiceById(id);
    const employees = await getEmployees();

    return (
        <div className="">
            <div className='mb-6'>
                <Link href="/dashboard/services">
                    <div className="flex flex-row items-center hover:cursor-pointer size-fit hover:text-slate-400 text-slate-800 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to services</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-slate-800"> Edit Service </h1>
                <div className='w-full'>
                    {service && <EditServiceForm service={service} employees={employees} />}
                </div>
            </div>
        </div>
    );
}