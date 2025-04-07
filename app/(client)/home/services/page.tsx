import { getAllServices } from "@/app/actions/serviceDbActions"
import { HiOutlineTruck, HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
    const services = await getAllServices();

    return (
        <>
            <h1 className="flex justify-center text-3xl text-slate-800">All available services</h1>
            <div className="flex justify-center">
                <ul className='grid grid-cols-1 md:grid-cols-2 w-[50%] text-slate-800'>
                    {services.map((service: any) => (
                        <li
                            key={service.id}
                            className="flex flex-col rounded-lg mb-2 w-full outline-0 bg-slate-300"
                        >
                            <div className="flex justify-between p-4">
                                <span className="flex items-center text-2xl">
                                    <HiOutlineTruck className="mr-2 text-2xl" /> {service?.title}
                                </span>
                                <div className="mt-auto flex justify-center">
                                    <Button className="hover:cursor-pointer bg-slate-500 hover:bg-slate-600">
                                        <Link href={`/home/services/${service.id}`}>Book now</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-row justify-start px-4 pb-4">
                                <span className="flex items-center">
                                    <HiOutlineCash className="mr-2 text-2xl" /> {service?.price} €
                                </span>
                                <span className="flex items-center ml-4">
                                    <HiOutlineClock className="mr-2 text-2xl" /> {service.duration} min
                                </span>
                                <span className="flex items-center ml-4">
                                    <Button variant={"link"} className="text-1xl hover:cursor-pointer hover:text-slate-600"> View reviews </Button>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div >
        </>
    )
}