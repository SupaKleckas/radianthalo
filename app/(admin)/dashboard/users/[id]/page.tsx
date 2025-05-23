import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { getUserById } from "@/app/actions/user/db";
import UserEditForm from "@/app/components/User/EditUserForm";
import { redirect } from "next/navigation";

export type paramsType = Promise<{ id: string }>;

export default async function Page(props: { params: paramsType }) {
    const { id } = await props.params;

    if (!id) {
        redirect("/dashboard/users");
    }

    const user = await getUserById(id);

    return (
        <div>
            <div className='mb-6'>
                <Link href="/dashboard/users">
                    <div className="flex flex-row items-center hover:cursor-pointer size-fit hover:text-slate-400 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to users</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6"> Edit User </h1>
                <div className='w-full'>
                    {user && <UserEditForm user={user} />}
                </div>
            </div>
        </div>
    );
}