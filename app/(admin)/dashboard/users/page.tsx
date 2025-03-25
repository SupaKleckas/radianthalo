import { HiUser, HiUserAdd, HiIdentification, HiKey, HiOutlineUser, HiPencil } from "react-icons/hi";
import prisma from "@/app/lib/db";
import Link from "next/link";
import { deleteUser } from "@/app/actions/userDbActions"
import ConfirmationButton from "@/app/components/ConfirmationButton"

export default async function Page() {
    const users = await prisma.user.findMany();

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <HiKey className='text-2xl mr-2' />;
            case 'USER':
                return <HiOutlineUser className='text-2xl mr-2' />;
            case 'EMPLOYEE':
                return <HiIdentification className='text-2xl mr-2' />;
            default:
                return <HiUser className='text-2xl mr-2' />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Users ({users.length}) </h1>

            <div className='w-full px-4'>
                <div className='flex justify-end mb-4'>
                    <Link href="/dashboard/users/add" className='flex items-center bg-[#325670] text-white px-4 py-2 rounded-full hover:bg-[#1f3d53]'>
                        <HiUserAdd className='mr-2 text-2xl' />
                        Add User
                    </Link>
                </div>
                <ul className='w-full'>
                    {users.map((user: any) => (
                        <li key={user.id} className='flex items-center justify-between rounded-lg mb-2 w-full bg-[#94B6CE] hover:bg-[#7d94b6]'>
                            <div className='flex items-center w-full p-4'>
                                <span> {getRoleIcon(user.role)} </span>
                                <span> {user?.firstName} {user?.lastName} {user.email}  </span>
                            </div>
                            <div className="flex flex-row">
                                <Link href={`/dashboard/users/${user.id}`}>
                                    <HiPencil className="text-2xl hover:cursor-pointer hover:text-green-300 mr-2" />
                                </Link>
                                <form action={deleteUser.bind(null, user.id)}>
                                    <ConfirmationButton message={`Are you sure you want to delete ${user.role.toLowerCase()} ${user.firstName} ${user.lastName}?`} />
                                </form>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}