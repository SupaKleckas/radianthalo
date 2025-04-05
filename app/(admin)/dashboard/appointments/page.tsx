// UNFINISHED
import { } from "react-icons/hi";
import prisma from "@/app/lib/db";
import Link from "next/link";
import ConfirmationButton from "@/app/components/ConfirmationButton"

export default async function Page() {
    const appointments = await prisma.appointment.findMany();

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Appointments </h1>

            <div className='w-full px-4'>
                <ul className='w-full'>
                    {appointments.map((appointment: any) => (
                        <li key={appointment.id} className='flex items-center justify-between rounded-lg mb-2 w-full bg-[#94B6CE] hover:bg-[#7d94b6] hover:cursor-pointer'>
                            <Link href={`/dashboard/service/${appointment.id}`} className='w-full p-4'>
                                <div className='flex items-center space-x-[10%]'>
                                    <span className='flex items-center'> {appointment?.title} </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}