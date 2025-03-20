import { HiOutlineChevronLeft } from "react-icons/hi";
import Link from "next/link";
import { getUserById } from "@/app/actions/userDbActions";
import UserEditForm from "@/app/components/EditUserForm";

interface UserParams {
    params: {
        id: string;
    };
}

export default async function Page({ params }: UserParams) {
    const { id } = await params;
    const user = await getUserById(id);

    return (
        <div className="flex flex-col items-center justify-center py-[5%]">
            <div className='w-[50%] flex justify-start mb-6'>
                <Link href="/dashboard/users">
                    <HiOutlineChevronLeft className='text-5xl hover:cursor-pointer hover:text-[#7d94b6]' />
                </Link>
            </div>
            <h1 className="text-4xl font-bold mb-6"> User Card </h1>
            <div className='w-full'>
                {user && <UserEditForm user={user} />}
            </div>
        </div>
    );
}