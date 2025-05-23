import { HiUser, HiUserAdd, HiIdentification, HiKey, HiPencil, HiMail, HiTrash } from "react-icons/hi";
import Link from "next/link";
import { deleteUser, getUsers } from "@/app/actions/user/db";
import { PaginationComponent } from "@/app/components/Page/Pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@prisma/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search } from "@/app/components/Page/Search";
import { RoleFilter } from "@/app/components/Page/RoleFilter";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const { page, query, role } = await props.searchParams;

    const queryParam = query || "";
    const roleParam = role || "";

    const currPage = Number(page) || 1;
    const [users, meta] = await getUsers(currPage, queryParam, roleParam);
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
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="flex flex-col">
                <div className="flex flex-col text-slate-800 gap-y-2">
                    <h1 className="text-5xl">Users</h1>
                    <h1 className="text-base opacity-60">Handle all users here.</h1>
                </div>
                <div className='w-full'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <div className='flex flex-col md:flex-row gap-6 mb-4 mt-4'>
                            <Search />
                            <RoleFilter />
                            <Button className='bg-slate-700 hover:bg-slate-800'>
                                <Link href="/dashboard/users/add" className="flex flex-row items-center">
                                    <HiUserAdd className='mr-2 text-2xl' />
                                    Add User
                                </Link>
                            </Button>
                        </div>

                        <PaginationComponent pageAmount={pageAmount} />
                    </Suspense>
                    <Suspense fallback={<div className="text-center py-4">Loading users...</div>}>
                        {users.length === 0 && (
                            <div className="text-center mt-8 text-slate-600">
                                {query
                                    ? `No users found matching "${query}"`
                                    : "No users found"}
                            </div>
                        )}
                        <ul className='flex w-full flex-col items-center justify-center mt-4'>
                            {users.map((user: User) => (
                                <li key={user.id} className='flex items-center p-2 justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500'>
                                    <div className='flex lg:items-center w-full space-x-2 flex-col lg:flex-row text-base'>
                                        <span className="flex flex-row items-center lg:w-1/2"> {getRoleIcon(user.role)} {user?.firstName} {user?.lastName} </span>
                                        <span className="flex flex-row items-center lg:w-1/2"> <HiMail className="text-2xl mr-2" />  {user.email}</span>
                                    </div>
                                    <div className="flex flex-row">
                                        <Link href={`/dashboard/users/${user.id}`}>
                                            <HiPencil className="text-2xl hover:cursor-pointer hover:text-green-300 mr-2" />
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <HiTrash className='text-2xl hover:cursor-pointer hover:text-red-500' />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{`Are you sure you want to delete ${user.role.toLowerCase()} ${user.firstName} ${user.lastName}?`}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the user from the database.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="hover:cursor-pointer hover:bg-slate-300">Cancel</AlertDialogCancel>
                                                    <form action={deleteUser.bind(null, user.id)}>
                                                        <AlertDialogAction asChild >
                                                            <Button type="submit" className="bg-slate-700 hover:cursor-pointer">Continue</Button>
                                                        </AlertDialogAction>
                                                    </form>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Suspense>
                </div>
            </div>
        </ScrollArea>
    );
}