"use client";
import { HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ServiceCategory } from "@prisma/client";
import { useSearchParams, usePathname } from "next/navigation";

interface Params {
    isGuest: boolean,
    serviceCategories: ServiceCategory[],
    groupedServices: Map<string, {
        id: string;
        title: string;
        price: number;
        duration: number;
        category: ServiceCategory;
    }[]>,
}

export default function Services({ isGuest, serviceCategories, groupedServices }: Params) {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const chosenCategory = categoryParam && Object.values(ServiceCategory).includes(categoryParam as ServiceCategory) ? categoryParam as ServiceCategory : null;

    const currentServices = chosenCategory ? groupedServices.get(chosenCategory) : null;

    console.log(pathname.split('/')[1])

    return (
        <div className={`${isGuest ? "m-10" : ""}`}>
            <h1 className="mb-6 text-5xl md:text-7xl font-bold text-slate-800">We offer treatments for...</h1>
            {chosenCategory ?
                <div>
                    <h1 className="flex justify-end mb-6 text-5xl md:text-7xl font-bold text-slate-800">...{chosenCategory}</h1>
                    <div className="flex justify-center w-full">
                        <ul className="flex flex-col justify-center items-center w-[90%] md:w-[80%]">
                            {currentServices?.map((service) =>
                                <li key={service.id} className="flex flex-col rounded-lg mb-2 w-full outline-0 bg-slate-300">
                                    <div className="flex justify-between p-4">
                                        <span className="flex items-center text-2xl md:text-4xl">
                                            {service?.title}
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
                                    <div className="flex flex-row justify-end px-4 pb-4">
                                        <span className="flex items-center text-base md:text-2xl">
                                            <HiOutlineCash className="mr-2" /> {service?.price} €
                                        </span>
                                        <span className="flex items-center ml-4 text-base md:text-2xl">
                                            <HiOutlineClock className="mr-2 text-xl md:text-2xl" /> {service.duration} min
                                        </span>
                                        <span className="flex items-center ml-4">
                                            <Link href={`${isGuest ? `/reviews?service=${service.title}` : `/${pathname.split('/')[1]}/reviews?service=${service.title}`}`}>
                                                <Button variant={"link"} className="text-base md:text-1xl hover:cursor-pointer hover:text-slate-600"> View reviews </Button>
                                            </Link>
                                        </span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                :
                <div className="flex justify-center items-center mt-8">
                    <ul className="flex flex-col w-[80%] gap-5">
                        {serviceCategories.map((category) =>
                            <Link key={category} href={`${isGuest ? `/services?category=${category}` : `/home/services?category=${category}`}`}>
                                <li className="flex justify-center w-full bg-slate-300 rounded font-medium p-6 text-3xl md:text-5xl lg:text-6xl text-slate-800 hover:cursor-pointer hover:bg-slate-400 transition">{category.toUpperCase()}</li>
                            </Link>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}