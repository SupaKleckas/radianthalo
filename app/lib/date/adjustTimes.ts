import { getTimezoneOffset } from "date-fns-tz";

export function adjustToUTC(date: Date, timeZone: string) {
    const offsetHours = getTimezoneOffset(timeZone) / (3600 * 1000);
    const adjusted = new Date(date);
    adjusted.setHours(date.getHours() + offsetHours, 0, 0, 0);
    return adjusted;
}

export function addTimeToDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
}