import Services from "@/app/components/Service/Services";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
    return (
        <ScrollArea className="h-[70vh] md:h-[80vh] w-full rounded-md pr-4">
            <Services isGuest={false} />
        </ScrollArea>
    )
}