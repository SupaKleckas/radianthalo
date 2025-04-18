"use server";
import prisma from "@/app/lib/database/db";
import { revalidatePath } from "next/cache";

interface Props {
    availabilityData: {
        id: string
        isActive: boolean
        fromTime: string
        untilTime: string
    }[]
}

export async function getAvailability(employeeId: string) {
    const data = await prisma.availability.findMany({
        where: {
            employeeId: employeeId
        }
    })

    if (!data) {
        return undefined
    }

    return data
}

export async function updateAvailability({ availabilityData }: Props) {
    const data = await availabilityData;
    await prisma.$transaction(
        data.map((item) => prisma.availability.update({
            where: {
                id: item.id
            },
            data: {
                isActive: item.isActive,
                fromTime: item.fromTime,
                untilTime: item.untilTime
            }
        }))
    );
    revalidatePath("/staff-dashboard/availability");
}