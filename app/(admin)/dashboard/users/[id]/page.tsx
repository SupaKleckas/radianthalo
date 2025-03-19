import { HiOutlineChevronLeft, HiPencil } from "react-icons/hi";
import Link from "next/link";
import { getUserById } from "@/app/actions/userDbActions";

interface PageParams {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageParams) {
    const { id } = await params;
    const user = await getUserById(id);

    return (
        <>
            <div className='flex flex-row items-center justify-between w-full'>
                <Link href="/dashboard/users">
                    <HiOutlineChevronLeft className='mr-2 text-5xl' />
                </Link>
                <button>
                    <HiPencil className='mr-2 text-5xl' />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center py-3">
                <h1 className="text-4xl mb-4 mr-5"> User Card </h1>


                <div className='w-[80%]'>
                    <div className='flex justify-center mb-4'>
                        <p>{user?.firstName} {user?.lastName} {user?.email} {user?.role}</p>
                    </div>
                </div>
            </div>
        </>
    );
}