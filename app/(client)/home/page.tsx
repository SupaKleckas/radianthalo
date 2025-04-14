import { getAllServices, getPopularServices } from "@/app/actions/service/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HiOutlineTruck, HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


export default async function Home() {
    const services = await getAllServices();
    const getMostPopularServices = await getPopularServices();

    return (
        <div className="flex flex-col gap-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800">Welcome! Check out our most popular services!</h1>
            <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-8 gap-y-4">
                {getMostPopularServices.map((service) => (
                    <Link key={service.id} href={`/home/services/${service.id}`} className="w-full md:w-1/5">
                        <Card className="bg-gradient-to-r from-slate-100 to-slate-400 hover:scale-105 transition-transform duration-300 shadow-lg">
                            <CardHeader >
                                <span className="flex w-fit bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                    ⭐ Popular
                                </span>
                                <div className="flex flex-row items-center gap-x-2 text-2xl">
                                    <HiOutlineTruck></HiOutlineTruck>{service.title}
                                </div>
                            </CardHeader>
                            <CardDescription>
                                <div className="flex flex-row items-center ml-6 gap-x-6 text-xl">
                                    <p className="flex flex-row items-center"><HiOutlineClock></HiOutlineClock>{service.duration}</p>
                                    <p className="flex flex-row items-center"><HiOutlineCash></HiOutlineCash>{service.price} €</p>
                                </div>
                            </CardDescription>
                        </Card>
                    </Link>
                ))}
            </div>
            <h1 className="text-2xl md:text-3xl text-slate-500">Or book whichever one you like... There's many to choose from!</h1>
            <Carousel opts={{ loop: true }} >
                <CarouselContent>
                    {services.map((service) => (
                        <CarouselItem key={service.id} className="md:basis-1/4" >
                            <Card className="bg-slate-300">
                                <CardHeader>
                                    <div className="flex flex-row items-center gap-x-2 text-2xl">
                                        <HiOutlineTruck></HiOutlineTruck>{service.title}
                                    </div>
                                </CardHeader>
                                <CardDescription>
                                    <div className="flex flex-row items-center ml-6 gap-x-6 text-xl">
                                        <p className="flex flex-row items-center"><HiOutlineClock></HiOutlineClock>{service.duration}</p>
                                        <p className="flex flex-row items-center"><HiOutlineCash></HiOutlineCash>{service.price} €</p>
                                    </div>
                                </CardDescription>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <h1 className="text-2xl md:text-4xl text-slate-500 flex flex-row justify-end">
                Find them all&nbsp;
                <Link href="/home/services" className="hover:cursor-pointer hover:underline">
                    here!
                </Link>
            </h1>
        </div >
    );
}