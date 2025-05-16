"use server";
import prisma from "@/app/lib/database/db";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

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
    redirect("/staff-dashboard/availability?status=availability-success");
}

export async function addTimeOff(fromDate: Date, toDate: Date, user: User) {
    await prisma.timeOff.create({
        data: {
            startDate: fromDate,
            endDate: toDate,
            employeeId: user.id
        }
    })
}