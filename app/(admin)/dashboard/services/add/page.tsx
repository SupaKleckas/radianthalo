import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { AddServiceForm } from '@/app/components/AddServiceForm';
import { getEmployees } from '@/app/actions/userDbActions';

export default async function Page() {
    const employees = await getEmployees();

    return (
        <div>
            <div className='mb-6'>
                <Link href="/dashboard/services">
                    <div className="flex flex-row items-center hover:cursor-pointer size-fit text-slate-800 hover:text-slate-400 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to services</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-slate-700"> Enter new service details </h1>
                <div className='w-full'>
                    <AddServiceForm employees={employees} />
                </div>
            </div>
        </div>
    );
}