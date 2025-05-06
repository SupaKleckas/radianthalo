import { getUserIdFromSession } from "@/app/lib/auth/session";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmployeeSchedule from "@/app/components/Schedule/EmployeeSchedule"
import { getEvents } from "@/app/lib/schedule/getEvents";

export default async function Page() {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return;
    }

    const events = await getEvents(userId);

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Your Schedule</h1>
                <h1 className="text-base opacity-60">Review your schedule here.</h1>
            </div>
            <div className="h-full">
                <EmployeeSchedule appointments={events} />
            </div>
        </ScrollArea>
    );
}