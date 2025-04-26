"use server";
import { Employee, User, Service, Appointment } from "@prisma/client";
import { getAppointmentForTimeSlots, addAppointment, addTemporaryAppointment, deleteAppointment, updateAppointment } from "@/app/actions/appointment/db";
import { getEmployeeById, getClientById } from "@/app/actions/user/db";
import { getUserIdFromSession } from "@/app/lib/auth/session"
import { getTimezoneOffset, format } from "date-fns-tz"
import { getWorkingHoursFromAvailibility } from "@/app/lib/date/availability"
import { goToPayment } from "@/app/lib/payment/goToPayment";
import { redirect } from "next/navigation";

export async function addAppointmentByBooking(employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.id) == null) {
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


    const appt = await addAppointment(title, startTime, endTime, employee.id, client.userId, service.id);

    return ({ redirectUrl: `/home/appointments/${appt.id}` });
}

export async function addTemporaryAppointmentByBooking(employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.id) == null) {
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

    // const title = `${service.title} on ${format(dateUtc, "MMMM do, yyyy")} at ${time}`;

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    return await addTemporaryAppointment(service.title, startTime, endTime, employee.id, client.userId, service.id);
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

export async function handleBooking(paymentMethod: string, employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (paymentMethod === "cash") {
        if (employee && time) {
            return addAppointmentByBooking(employee, date, time, service, timeZone);
        }
    } else if (paymentMethod === "card") {
        return goToPayment(employee, date, time, service, timeZone);
    }
}

export async function deleteAppointmentAction(id: string) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return;
    }

    const client = await getClientById(userId);
    if (!client) {
        return;
    }
    await deleteAppointment(id);
    redirect(`/home/appointments?status=cancel-success`)
}

export async function updateAppointmentAction(appt: Appointment, employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.id) == null) {
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
    if (!client || appt.clientId != client.userId || appt.serviceId != service.id) {
        return;
    }

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    const updated = await updateAppointment(appt.id, startTime, endTime, employee.id);
    redirect(`/home/appointments/${updated.id}?status=reschedule-success`)
}