import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import EmployeeSchedule from "@/app/components/Schedule/EmployeeSchedule"
import { getEvents } from "@/app/lib/schedule/getEvents";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/user/login/actions";

export default async function Page() {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "EMPLOYEE") {
        logout();
        redirect("/");
    }

    const events = await getEvents(userInfo.userId);

    return (
        <div>
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Your Schedule</h1>
                <h1 className="text-base opacity-60">Review your schedule here.</h1>
            </div>
            <div className="h-full">
                <EmployeeSchedule appointments={events} />
            </div>
        </div>
    );
}