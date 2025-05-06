import GeneralData from "@/app/components/Analytics/GeneralData";
import { getClientCount, getEmployeeCount } from "@/app/lib/analytics/getClientEmployeeAmounts";
import getEarnings from "@/app/lib/analytics/getEarnings";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { logout } from "@/app/actions/user/login/actions";
import EmployeeDataCharts from "@/app/components/Analytics/EmployeeDataCharts";
import getAppointmentsPerMonth from "@/app/lib/analytics/getAppointmentsPerMonth";
import getEmployeePopularService from "@/app/lib/analytics/getEmployeePopularService";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
    const employees = await getEmployeeCount();
    const clients = await getClientCount();

    const user = await getUserIdAndRoleFromSession();

    if (user === null || user?.role != "EMPLOYEE") {
        logout();
        return;
    }

    const earnings = await getEarnings(user.userId);
    const apptsPerMonth = await getAppointmentsPerMonth(user.userId);
    const mostBookedServices = await getEmployeePopularService(user.userId);

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Dashboard</h1>
                <h1 className="text-base opacity-60">Take a look at our analytics!</h1>
            </div>
            <GeneralData employees={employees} clients={clients} employeeEarnings={earnings} />
            <EmployeeDataCharts apptsPerMonth={apptsPerMonth} mostBookedService={mostBookedServices} />
        </ScrollArea>
    );
}