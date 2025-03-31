import { getServiceById } from "@/app/actions/serviceDbActions";
import Link from "next/link";
import { HiOutlineClock, HiOutlineCash, HiArrowSmLeft } from "react-icons/hi";
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookingCalendar } from "@/app/components/Calendar";
import { TimeSelection } from "@/app/components/TimeSelection";

interface ServiceParams {
    params: {
        id: string;
    };
}

export default async function Page({ params }: ServiceParams) {
    const { id } = await params;
    const service = await getServiceById(id);
    // Get user id from session

    return (
        <div className="w-full justify-center">
            <Card className="max-w-[1000px] w-full mx-auto">
                <Link href="/home/services">
                    <div className="flex flex-row ml-4 items-center hover:cursor-pointer size-fit hover:text-slate-600 transition-all">
                        <HiArrowSmLeft className='text-4xl' />
                        <p>Back to services</p>
                    </div>
                </Link>
                <CardContent className="grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
                    <div className="flex-1">
                        {/* Service details */}
                        <h1 className="text-5xl py-2 mb-4 font-semibold">Book {service?.title}</h1>
                        {/* Choose employee selection */}
                        <span className="flex items-center font-medium text-2xl mb-5">
                            <HiOutlineClock /> {service?.duration} min
                        </span>
                        <span className="flex items-center font-medium text-2xl">
                            <HiOutlineCash /> {service?.price} €
                        </span>
                    </div>
                    <Separator orientation="vertical" className="self-stretch w-[4px] bg-gray-300" />
                    <div className="flex-1">
                        <BookingCalendar />
                    </div>
                    <Separator orientation="vertical" className="self-stretch w-[4px] bg-gray-300" />
                    <div className="flex-1">
                        <TimeSelection />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}