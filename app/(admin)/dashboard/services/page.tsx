import { HiOutlineTruck, HiOutlineClock, HiOutlineCash, HiPencil } from "react-icons/hi";
import Link from "next/link";
import { deleteService, getServices } from "@/app/actions/serviceDbActions"
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
    const [services, meta] = await getServices(currPage);
    const pageAmount = meta?.pageCount;

    return (
        <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-4xl mb-4"> Services </h1>
            <div className='w-full px-4'>
                <div className='flex justify-end mb-4'>
                    <Button className="bg-slate-700 hover:bg-slate-800">
                        <Link href="/dashboard/services/add" className='flex items-center'>
                            <HiOutlineTruck className='mr-2 text-2xl' />
                            Add Service
                        </Link>
                    </Button>
                </div>
                <ul className='w-full'>
                    {services.map((service: any) => (
                        <li key={service.id} className='flex items-center justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500'>
                            <div className='flex items-center space-x-[10%] w-full p-4'>
                                <span className='flex items-center'> <HiOutlineTruck className='mr-2 text-2xl' /> {service?.title} </span>
                                <span className='flex items-center'> <HiOutlineCash className='ml-2 text-2xl' /> {service?.price} €</span>
                                <span className='flex items-center'> <HiOutlineClock className='ml-2 text-2xl' /> {service.duration} min</span>
                            </div>
                            <div className="flex flex-row">
                                <Link href={`/dashboard/services/${service.id}`}>
                                    <HiPencil className="text-2xl hover:cursor-pointer hover:text-green-300 mr-2" />
                                </Link>
                                <form action={deleteService.bind(null, service.id)}>
                                    <ConfirmationButton message={`Are you sure you want to delete service ${service.title.toLowerCase()}?`} />
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