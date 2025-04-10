import DataCharts from "@/app/components/AdminDashboard/DataCharts";
import GeneralData from "@/app/components/AdminDashboard/GeneralData";
import getAppointmentsPerService from "@/app/lib/analytics/getAppointmentsPerService"
import getAppointmentsPerWeekday from "@/app/lib/analytics/getAppointmentsPerWeekday";
import getMostActiveEmployees from "@/app/lib/analytics/getMostActiveEmployees";
import getAppointmentsPerMonth from "@/app/lib/analytics/getAppointmentsPerMonth";
import { getClientCount, getEmployeeCount } from "@/app/lib/analytics/getClientEmployeeAmounts";
import getAllEarnings from "@/app/lib/analytics/getAllEarnings";

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
    const earnings = await getAllEarnings();

    const apptsPerService = await getAppointmentsPerService();
    const apptsPerWeekday = await getAppointmentsPerWeekday();
    const apptsPerEmployee = await getMostActiveEmployees();
    const apptsPerMonth = await getAppointmentsPerMonth();

    return (
        <div>
            <div className="flex flex-col text-slate-800 gap-y-2 mb-4">
                <h1 className="text-5xl">Dashboard</h1>
                <h1 className="text-base opacity-60">Take a look at our analytics!</h1>
            </div>
            <GeneralData employees={employees} clients={clients} earnings={earnings} />
            <DataCharts apptsPerService={apptsPerService} apptsPerWeekday={apptsPerWeekday} apptsPerEmployee={apptsPerEmployee} apptsPerMonth={apptsPerMonth} />
        </div>
    );
}