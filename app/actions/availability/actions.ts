"use server";
import { getAvailability, updateAvailability } from "@/app/actions/availability/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { logout } from "@/app/actions/user/login/actions";
import { addTimeOff } from "@/app/actions/availability/db";
import { adjustToUTC } from "@/app/lib/date/adjustTimes";
import { getUserById } from "../user/db";
import { getEmployeeAppointmentsInInterval } from "../appointment/db";
import { sendTimeOffAnnounement } from "@/app/lib/email/sendTimeOffAnnoucement";
import { redirect } from "next/navigation";
import { parse } from "date-fns";

export async function getEmployeeAvailability() {
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.role != "EMPLOYEE") {
        return undefined;
    }

    return getAvailability(user.userId);
}

export async function updateAvailabilityAction(formData: FormData) {
    const user = await getUserIdAndRoleFromSession();
    if (!user || user.role != "EMPLOYEE") {
        logout();
    }

    const data = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(data)
        .filter((key) => key.startsWith("id-"))
        .map((key) => {
            const id = key.replace("id-", "");
            const isActive = data[`isActive-${id}`] === "on";
            const fromTime = data[`fromTime-${id}`] as string;
            const untilTime = data[`untilTime-${id}`] as string;

            if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(fromTime) ||
                !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(untilTime)) {
                console.warn("Availability: invalid data submitted.");
                logout();
            }

            const timeFormat = 'HH:mm';
            const fromDate = parse(fromTime, timeFormat, new Date());
            const untilDate = parse(untilTime, timeFormat, new Date());

            if (isNaN(fromDate.getTime()) || isNaN(untilDate.getTime())) {
                console.warn("Availability: invalid data format submitted.");
                logout();
            }

            if (fromTime >= untilTime) {
                console.warn("Availability: invalid data submitted.");
                logout();
            }

            return { id, isActive, fromTime, untilTime };
        });

    await updateAvailability({ availabilityData });
}

export async function addTemporaryLeave(fromDate: Date, toDate: Date, timeZone: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "EMPLOYEE") {
        logout();
        return;
    }

    const user = await getUserById(userInfo.userId);

    if (!user) {
        return;
    }

    fromDate = adjustToUTC(fromDate, timeZone);
    toDate = adjustToUTC(toDate, timeZone);

    await addTimeOff(fromDate, toDate, user);

    const apptsToEmail = await getEmployeeAppointmentsInInterval(fromDate, toDate, user.id);
    await sendTimeOffAnnounement(apptsToEmail, user);

    redirect("/staff-dashboard/availability?status=success");
}