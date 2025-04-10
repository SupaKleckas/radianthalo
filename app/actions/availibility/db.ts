import prisma from "@/app/lib/database/db";
import { notFound } from "next/navigation";

export async function getAvailability(employeeId: string) {
    const data = await prisma.availability.findMany({
        where: {
            employeeId: employeeId
        }
    })

    console.log(data)

    if (!data) {
        return notFound();
    }

    return data
}