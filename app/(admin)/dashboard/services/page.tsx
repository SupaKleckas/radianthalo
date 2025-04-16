import { HiOutlineTruck, HiOutlineClock, HiOutlineCash, HiPencil, HiTrash } from "react-icons/hi";
import Link from "next/link";
import { deleteService, getServices } from "@/app/actions/service/db"
import { PaginationComponent } from "@/app/components/Pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface SearchParamsProps {
    searchParams?: {
        page?: string;
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    const params = await searchParams;
    const currPage = Number(params?.page) || 1;
    const [services, meta] = await getServices(currPage);
    const pageAmount = meta?.pageCount;

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="flex flex-col min-h-[80%]">
                <div className="flex flex-col text-slate-800 gap-y-2">
                    <h1 className="text-5xl">Services</h1>
                    <h1 className="text-base opacity-60">Handle all services here.</h1>
                </div>
                <div className='w-full'>
                    <div className='flex justify-end mb-4'>
                        <Button className="bg-slate-700 hover:bg-slate-800">
                            <Link href="/dashboard/services/add" className='flex items-center'>
                                <HiOutlineTruck className='mr-2 text-2xl' />
                                Add Service
                            </Link>
                        </Button>
                    </div>
                    <PaginationComponent pageAmount={pageAmount} />
                    <ul className='flex w-full flex-col items-center justify-center mt-4'>
                        {services.map((service: any) => (
                            <li key={service.id} className='flex items-center p-2 justify-between rounded-lg mb-2 w-full bg-slate-400 hover:bg-slate-500'>
                                <div className='flex lg:items-center flex-col lg:flex-row w-full text-base'>
                                    <span className='flex items-center lg:w-1/3'> <HiOutlineTruck className='text-2xl' /> {service?.title} </span>
                                    <span className='flex items-center lg:w-1/3'> <HiOutlineCash className='text-2xl' /> {service?.price} €</span>
                                    <span className='flex items-center lg:w-1/3'> <HiOutlineClock className='text-2xl' /> {service.duration} min</span>
                                </div>
                                <div className="flex flex-row">
                                    <Link href={`/dashboard/services/${service.id}`}>
                                        <HiPencil className="text-2xl hover:cursor-pointer hover:text-green-300 mr-2" />
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <HiTrash className='text-2xl hover:cursor-pointer hover:text-red-500' />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{`Are you sure you want to delete service ${service.title}?`}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the service from the database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="hover:cursor-pointer hover:bg-slate-300">Cancel</AlertDialogCancel>
                                                <form action={deleteService.bind(null, service.id)}>
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
                </div>
            </div>
        </ScrollArea>
    );
}