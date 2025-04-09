import DataCharts from "@/app/components/AdminDashboard/DataCharts";
import GeneralData from "@/app/components/AdminDashboard/GeneralData";
import getAppointmentsPerService from "@/app/lib/analytics/getAppointmentsPerService"
import getAppointmentsPerWeekday from "@/app/lib/analytics/getAppointmentsPerWeekday";
import { getClientCount, getEmployeeCount } from "@/app/lib/analytics/getClientEmployeeAmounts";

export default async function Page() {
    const employees = await getEmployeeCount();
    const clients = await getClientCount();

    return (
        <div>
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Dashboard</h1>
                <h1 className="text-base opacity-60">Take a look at our analytics!</h1>
            </div>
            <GeneralData employees={employees} clients={clients} />
        </div>
    );
}