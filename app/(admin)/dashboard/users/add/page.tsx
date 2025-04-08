import AddUserForm from "@/app/components/User/AddUserForm"
import Link from "next/link";
import { HiArrowSmLeft } from "react-icons/hi";

export default async function Page() {
    return (
        <div>
            <div className='mb-6'>
                <Link href="/dashboard/users">
                    <div className="flex flex-row items-center hover:cursor-pointer size-fit text-slate-800 hover:text-slate-400 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to users</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-slate-800"> Add User </h1>
                <div className='w-full'>
                    <AddUserForm />
                </div>
            </div>
        </div>
    );
}