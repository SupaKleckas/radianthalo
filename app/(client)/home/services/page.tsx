import { getAllServices } from "@/app/actions/service/db";
import Services from "@/app/components/Service/Services";
import { groupByCategory } from "@/app/lib/grouping/groupByCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceCategory } from "@prisma/client";

export default async function Page() {
    const serviceCategories = Object.values(ServiceCategory) as ServiceCategory[];
    const groupedServices = groupByCategory(await getAllServices());

    return (
        <ScrollArea className="h-[76vh] md:h-[80vh] w-full rounded-md pr-4">
            <div className="m-8">
                <Services isGuest={false} serviceCategories={serviceCategories} groupedServices={groupedServices} />
            </div>
        </ScrollArea>
    )
}