import { getAllServices } from "@/app/actions/service/db"
import { HiOutlineTruck, HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { groupByCategory } from "@/app/lib/grouping/groupByCategory";
import { Service } from "@prisma/client";

interface Params {
    isGuest: boolean
}

export default async function Services({ isGuest }: Params) {
    const categories = groupByCategory(await getAllServices());

    return (
        <div className={`${isGuest ? "m-10" : ""}`}>
            <h1 className="flex flex-col justify-center mb-6 text-4xl md:text-6xl font-bold text-slate-800">We offer treatments for...</h1>
            <div className="flex flex-col justify-center">
                {categories.map(([category, services]: [string, Service[]]) =>
                    <div key={category} className="w-full mb-6">
                        <h1 className="text-2xl w-full mb-4 border-b-2 border-slate-700">{category}</h1>
                        <ul className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 text-slate-800'>
                            {services.map((service: any) => (
                                <li key={service.id} className="flex flex-col rounded-lg mb-2 w-full outline-0 bg-slate-300">
                                    <div className="flex justify-between p-4">
                                        <span className="flex items-center text-2xl">
                                            <HiOutlineTruck className="mr-2 text-2xl" /> {service?.title}
                                        </span>
                                        {isGuest ?
                                            null
                                            :
                                            <div className="mt-auto flex justify-center">
                                                <Button className="hover:cursor-pointer bg-slate-500 hover:bg-slate-600">
                                                    <Link href={`/home/services/${service.id}`}>Book now</Link>
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                    <div className="flex flex-row justify-start px-4 pb-4">
                                        <span className="flex items-center text-sm md:text-2xl">
                                            <HiOutlineCash className="mr-2" /> {service?.price} €
                                        </span>
                                        <span className="flex items-center ml-4 text-sm md:text-2xl">
                                            <HiOutlineClock className="mr-2 text-xl md:text-2xl" /> {service.duration} min
                                        </span>
                                        <span className="flex items-center ml-4">
                                            <Button variant={"link"} className="text-sm md:text-1xl hover:cursor-pointer hover:text-slate-600"> View reviews </Button>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}