import DataCharts from "@/app/components/AdminDashboard/DataCharts";
import GeneralData from "@/app/components/AdminDashboard/GeneralData";
import getAppointmentsPerService from "@/app/lib/analytics/getAppointmentsPerService"
import getAppointmentsPerWeekday from "@/app/lib/analytics/getAppointmentsPerWeekday";
import { getClientCount, getEmployeeCount } from "@/app/lib/analytics/getClientEmployeeAmounts";

/*
General statistics:
Client count
Employee count
Total earnings
Services in certain caterogies?

Relevant statistics:
Number of Appointments per Service 
Appointments per Day/Week/Month
Most Active Employees
Client Appointments per Month
*/

export default async function Page() {
    const employees = await getEmployeeCount();
    const clients = await getClientCount();

    const apptsPerService = await getAppointmentsPerService();
    const apptsPerWeekday = await getAppointmentsPerWeekday();

    return (
        <div>
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Dashboard</h1>
                <h1 className="text-base opacity-60">Take a look at our analytics!</h1>
            </div>
            <GeneralData employees={employees} clients={clients} />
            <DataCharts apptsPerService={apptsPerService} apptsPerWeekday={apptsPerWeekday} />
        </div>
    );
}