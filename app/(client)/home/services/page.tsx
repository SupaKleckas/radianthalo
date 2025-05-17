import { getAllServices } from "@/app/actions/service/db";
import Services from "@/app/components/Service/Services";
import { groupByCategory } from "@/app/lib/grouping/groupByCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceCategory } from "@prisma/client";
import Message from "@/app/components/Notifications/Message";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const { status } = await props.searchParams;

    const serviceCategories = Object.values(ServiceCategory) as ServiceCategory[];
    const groupedServices = groupByCategory(await getAllServices());

    return (
        <ScrollArea className="h-[76vh] md:h-[80vh] w-full rounded-md pr-4">
            <div className="m-8">
                {status == "failed" ? <Message type="warning" message="Oops! Someone booked that time before you... Try again!" /> : null}
                <Services isGuest={false} serviceCategories={serviceCategories} groupedServices={groupedServices} />
            </div>
        </ScrollArea>
    )
}