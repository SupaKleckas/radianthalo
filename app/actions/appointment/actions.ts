"use server";
import { Employee, User, Service } from "@prisma/client";
import { getAppointmentForTimeSlots, addAppointment } from "@/app/actions/appointment/db";
import { getEmployeeById, getClientById } from "@/app/actions/user/db";
import { getUserIdAndRoleFromSession, getUserIdFromSession } from "@/app/lib/auth/session"
import { getTimezoneOffset, format } from "date-fns-tz"
import { redirect } from "next/navigation";
import { getWorkingHoursFromAvailibility } from "@/app/lib/date/availability"
import { Day } from "@prisma/client"

export async function addAppointmentByBooking(employee: Employee & { user: User }, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.userId) == null) {
        return;
    }

    //Converting time to UTC
    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000)
    const dateUtc = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + offsetHours, 0, 0, 0);

    if (dateUtc <= new Date()) {
        return;
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
        return;
    }

    const client = await getClientById(userId);
    if (!client) {
        return;
    }

    const title = `${service.title} on ${format(dateUtc, "MMMM do, yyyy")} at ${time}`;

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    addAppointment(title, startTime, endTime, employee.userId, client.userId, service.id);
    redirect("/home/appointments");
}

function addTimeToDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export async function getAvailableTimeSlots(employee: Employee, date: Date, timeZone: string) {
    //Converting time to UTC
    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000)
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + offsetHours, 0, 0, 0);

    const timeData = await getWorkingHoursFromAvailibility(employee.userId, format(date, "EEEE"), date);

    if (timeData == undefined) {
        return []
    }

    const appointments: { startTime: Date; endTime: Date }[] = await getAppointmentForTimeSlots(employee, timeData.startOfDay, timeData.endOfDay);

    const availableSlots: string[] = [];
    let currentTime = new Date(timeData.startOfDay);

    while (currentTime < timeData.endOfDay) {
        const nextTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        const isBlocked = appointments.some(({ startTime, endTime }) =>
            currentTime >= startTime && currentTime < endTime
        );

        if (!isBlocked) {
            availableSlots.push(currentTime.toTimeString().slice(0, 5));
        }

        currentTime = nextTime;
    }

    return availableSlots;
}

export async function goCheckout(employee: Employee & { user: User }, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.userId) == null) {
        return;
    }

    //Converting time to UTC
    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000)
    const dateUtc = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + offsetHours, 0, 0, 0);

    if (dateUtc <= new Date()) {
        return;
    }

    const user = await getUserIdAndRoleFromSession();

    if (!user || user.role != "CLIENT") {
        return
    }

    const title = `${service.title} on ${format(dateUtc, "MMMM do, yyyy")} at ${time}`;

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    // addAppointment(title, startTime, endTime, employee.userId, client.userId, service.id);
    // addTempAppointment(title, startTime, endTime, employee.userId, user.userId, service.id);
    //to checkout
    // redirect("/home/appointments");
}