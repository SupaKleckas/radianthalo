"use server";
import { Employee, User, Service, Appointment, PaymentMethod } from "@prisma/client";
import { getAppointmentForTimeSlots, addAppointment, addTemporaryAppointment, deleteAppointment, updateAppointment, getAppointmentById, deleteExpiredTemporaryAppointments } from "@/app/actions/appointment/db";
import { getEmployeeById, getClientById, getUserById } from "@/app/actions/user/db";
import { getUserIdAndRoleFromSession, getUserIdFromSession } from "@/app/lib/auth/session"
import { getTimezoneOffset, format } from "date-fns-tz"
import { getWorkingHoursFromAvailibility } from "@/app/lib/date/availability"
import { goToPayment } from "@/app/lib/payment/goToPayment";
import { redirect } from "next/navigation";
import { sendAppointmentSuccessEmail } from "@/app/lib/email/sendAppointmentSuccessEmail";
import { sendRescheduleSuccessEmail } from "@/app/lib/email/sendRescheduleSuccessEmail";
import { sendCancelSuccessEmail } from "@/app/lib/email/sendCancelSuccessEmail";
import { adjustToUTC, addTimeToDate } from "@/app/lib/date/adjustTimes";

export async function addAppointmentByBooking(employee: User, date: Date, time: string, service: Service, timeZone: string, paymentMethod: PaymentMethod) {
    if (await getEmployeeById(employee.id) == null) {
        return ({ redirectUrl: `/home/services` });
    }

    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000)
    const dateUtc = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + offsetHours, 0, 0, 0);

    if (dateUtc <= new Date()) {
        return ({ redirectUrl: `/home/services` });
    }

    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        return ({ redirectUrl: `/home/services` });
    }

    const user = await getUserById(userInfo.userId);

    if (!user) {
        return ({ redirectUrl: `/home/services` });
    }

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    const appt = await addAppointment(service.title, startTime, endTime, employee.id, user.id, service.id, paymentMethod);

    await sendAppointmentSuccessEmail(user, appt);

    return ({ redirectUrl: `/home/appointments/${appt.id}` });
}

export async function addTemporaryAppointmentByBooking(employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.id) == null) {
        return;
    }

    const dateUtc = adjustToUTC(date, timeZone)

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

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    return await addTemporaryAppointment(service.title, startTime, endTime, employee.id, client.userId, service.id);
}



export async function getAvailableTimeSlots(employee: Employee, date: Date, timeZone: string) {
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
            return addAppointmentByBooking(employee, date, time, service, timeZone, PaymentMethod.Cash);
        }
    } else if (paymentMethod === "card") {
        return goToPayment(employee, date, time, service, timeZone);
    }
}

export async function deleteAppointmentAction(id: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        return;
    }

    const user = await getUserById(userInfo.userId);

    if (!user) {
        return;
    }
    const cancelled = await getAppointmentById(id);

    if (!cancelled) {
        return;
    }
    await deleteAppointment(id);
    const response = await sendCancelSuccessEmail(user, cancelled);
    if (response) {
        redirect(`/home/appointments?status=cancel-success`)
    } else {
        redirect(`/home/appointments?status=cancel-success-noemail`)
    }

}

export async function updateAppointmentAction(appt: Appointment, employee: User, date: Date, time: string, service: Service, timeZone: string) {
    if (await getEmployeeById(employee.id) == null) {
        return;
    }

    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000)
    const dateUtc = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + offsetHours, 0, 0, 0);

    if (dateUtc <= new Date()) {
        redirect(`/home/appointments/${appt.id}`);
    }

    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        redirect(`/`);
    }

    const user = await getUserById(userInfo.userId);

    if (!user) {
        redirect(`/home/appointments/${appt.id}`);
    }

    const startTime = addTimeToDate(dateUtc, time);
    const endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes() + service.duration, 0, 0);

    const updated = await updateAppointment(appt.id, startTime, endTime, employee.id);
    const response = await sendRescheduleSuccessEmail(user, updated);

    if (response) {
        redirect(`/home/appointments/${updated.id}?status=reschedule-success`);
    } else {
        redirect(`/home/appointments/${updated.id}?status=reschedule-success-noemail`);
    }

}

export async function deleteExpiredTemporaryAppointmentsAction() {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "ADMIN") {
        return;
    }
    deleteExpiredTemporaryAppointments();
}
