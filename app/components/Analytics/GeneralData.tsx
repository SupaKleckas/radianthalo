"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HiUser, HiIdentification, HiCash } from "react-icons/hi";

interface DataProps {
    employees: number,
    clients: number,
    earnings?: number,
    employeeEarnings?: number
}

export default function GeneralData({ employees, clients, earnings, employeeEarnings }: DataProps) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-4">
            {/* First Chart - Total Employees*/}
            <Card className="bg-slate-300 text-slate-800 p-3 max-h-[100px]">
                <CardHeader className="p-0">
                    <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                        <HiIdentification />
                        <h1>{employees}</h1>
                    </CardTitle>
                    <p className="opacity-[60%] text-sm p-0"> Total Employees </p>
                </CardHeader>
            </Card>
            {/* Second Chart - Total Clients*/}
            <Card className="bg-slate-300 p-3 max-h-[100px]">
                <CardHeader className="p-0">
                    <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                        <HiUser />
                        <h1>{clients}</h1>
                    </CardTitle>
                    <p className="opacity-[60%] text-sm p-0"> Total Clients </p>
                </CardHeader>
            </Card>
            {/* Third Chart - Total Earnings*/}
            {
                earnings ?
                    <Card className="bg-slate-300 p-3 max-h-[100px]">
                        <CardHeader className="p-0">
                            <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                                <HiCash />
                                <h1>{earnings} €</h1>
                            </CardTitle>
                            <p className="opacity-[60%] text-sm p-0"> Total Earnings </p>
                        </CardHeader>
                        <CardContent className="opacity-[60%] text-sm p-0">
                            Total Earnings
                        </CardContent>
                    </Card>
                    :
                    null
            }
            {/* Fourth Chart - Employee Earnings*/}
            {
                employeeEarnings ?
                    <Card className="bg-slate-300 p-3 max-h-[100px]">
                        <CardHeader className="p-0">
                            <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                                <HiCash />
                                <h1>{employeeEarnings} €</h1>
                            </CardTitle>
                            <p className="opacity-[60%] text-sm p-0"> Your Revenue</p>
                        </CardHeader>
                    </Card>
                    :
                    null
            }
        </div>
    )
}