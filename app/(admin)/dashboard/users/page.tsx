import { HiUser, HiUserAdd, HiIdentification, HiKey, HiPencil, HiMail } from "react-icons/hi";
import Link from "next/link";
import { deleteUser, getUsers } from "@/app/actions/userDbActions"
import ConfirmationButton from "@/app/components/ConfirmationButton"
import { PaginationComponent } from "@/app/components/Pagination";
import { Button } from "@/components/ui/button";

interface SearchParamsProps {
    searchParams?: {
        page?: string;
        query?: string;
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    const params = await searchParams;
    const currPage = Number(params?.page) || 1;
    const [users, meta] = await getUsers(currPage);
    const pageAmount = meta?.pageCount;

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <HiKey className='text-2xl mr-2' />;
            case 'USER':
                return <HiUser className='text-2xl mr-2' />;
            case 'EMPLOYEE':
                return <HiIdentification className='text-2xl mr-2' />;
            default:
                return <HiUser className='text-2xl mr-2' />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Users </h1>

            <div className='w-full px-4'>
                <div className='flex justify-end mb-4'>
                    <Button className='bg-slate-700 hover:bg-slate-800'>
                        <Link href="/dashboard/users/add" className="flex flex-row items-center">
                            <HiUserAdd className='mr-2 text-2xl' />
                            Add User
                        </Link>
                    </Button>
                </div>
                <ul className='w-full'>
                    {users.map((user: any) => (
                        <li key={user.id} className='flex items-center p-2 justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500'>
                            <div className='flex lg:items-center w-full space-x-2 flex-col lg:flex-row text-base'>
                                <span className="flex flex-row items-center lg:w-1/2"> {getRoleIcon(user.role)} {user?.firstName} {user?.lastName} </span>
                                <span className="flex flex-row items-center lg:w-1/2"> <HiMail className="text-2xl mr-2" />  {user.email}</span>
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
            <PaginationComponent pageAmount={pageAmount} />
        </div>
    );
}