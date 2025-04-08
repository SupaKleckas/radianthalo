"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HiUser, HiIdentification } from "react-icons/hi";

interface DataProps {
    employees: number,
    clients: number
}

export default function GeneralData({ employees, clients }: DataProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* First Chart - Total Employees*/}
            <Card className="bg-slate-300 text-slate-800 p-3 max-h-[100px]">
                <CardHeader className="p-0">
                    <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                        <HiIdentification />
                        <h1>{employees}</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-[60%] text-sm p-0">
                    Total Employees
                </CardContent>
            </Card>
            {/* Second Chart - Total Clients*/}
            <Card className="bg-slate-300 p-3 max-h-[100px]">
                <CardHeader className="p-0">
                    <CardTitle className="text-slate-800 flex flex-row items-center text-xl gap-2">
                        <HiUser />
                        <h1>{clients}</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent className="opacity-[60%] text-sm p-0">
                    Total Clients
                </CardContent>
            </Card>
        </div>
    )
}