"use server";
import prisma from "@/app/lib/database/db";
import { Day } from "@prisma/client";

function stringToDay(val: string): Day {
    return Day[val as keyof typeof Day];
}

export async function getWorkingHoursFromAvailibility(userId: string, weekday: string, date: Date) {
    const data = await prisma.availability.findFirst({
        where: {
            employeeId: userId,
            day: stringToDay(weekday)
        },
        select: {
            day: true,
            fromTime: true,
            untilTime: true
        }
    })

    if (!data) {
        return undefined
    }

    const [fromHours, fromMinutes] = data.fromTime.split(":").map(Number);
    const [untilHours, untilMinutes] = data.untilTime.split(":").map(Number);

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);

    startOfDay.setHours(fromHours, fromMinutes, 0, 0);
    endOfDay.setHours(untilHours, untilMinutes, 0, 0);

    return { startOfDay, endOfDay };
}

export async function getUnavailableWeekdays(employeeId: string | null) {
    const result: string[] = [];

    if (!employeeId) {
        return result
    }

    const data = await prisma.availability.findMany({
        where: {
            employeeId: employeeId,
        },
        select: {
            day: true,
            isActive: true
        }
    })

    if (!data) {
        return result
    }

    data.forEach(item => {
        if (!item.isActive) {
            result.push(item.day)
        }
    });

    return result
}

export async function getEmployeeTimeOff(employeeId: string) {
    if (!employeeId) return [];

    const timeOffData = await prisma.timeOff.findMany({
        where: {
            employeeId: employeeId,
        }
    });

    const dates: string[] = [];
    for (const timeOff of timeOffData) {
        const current = new Date(timeOff.startDate);
        const end = new Date(timeOff.endDate);

        while (current <= end) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
    }
    return dates;
}