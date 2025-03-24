import { HiOutlineTruck, HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import prisma from "@/app/lib/db";
import Link from "next/link";
import { deleteService } from "@/app/actions/serviceDbActions"
import ConfirmationButton from "@/app/components/ConfirmationButton"

export default async function Page() {
    const services = await prisma.service.findMany();

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Services </h1>

            <div className='w-full px-4'>
                <div className='flex justify-end mb-4'>
                    <Link href="/dashboard/services/add" className='flex items-center bg-[#325670] text-white px-4 py-2 rounded-full hover:bg-[#1f3d53]'>
                        <HiOutlineTruck className='mr-2 text-2xl' />
                        Add Service
                    </Link>
                </div>
                <ul className='w-full'>
                    {services.map((service: any) => (
                        <li key={service.id} className='flex items-center justify-between rounded-lg mb-2 w-full bg-[#94B6CE] hover:bg-[#7d94b6] hover:cursor-pointer'>
                            <Link href={`/dashboard/service/${service.id}`} className='w-full p-4'>
                                <div className='flex items-center space-x-[10%]'>
                                    <span className='flex items-center'> <HiOutlineTruck className='mr-2 text-2xl' /> {service?.title} </span>
                                    <span className='flex items-center'> <HiOutlineCash className='ml-2 text-2xl' /> {service?.price} EUR</span>
                                    <span className='flex items-center'> <HiOutlineClock className='ml-2 text-2xl' /> {service.duration}</span>
                                </div>
                            </Link>
                            <form action={deleteService.bind(null, service.id)}>
                                <ConfirmationButton message={`Are you sure you want to delete service ${service.title.toLowerCase()}?`} />
                            </form>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}