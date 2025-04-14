import { Appointment } from "@prisma/client";

export function groupByDate(appointments: Appointment[]) {
    const appointmentGroups: {
        [dateStr: string]:
        Appointment[]
    } = {}

    for (const appointment of appointments) {
        const dateGroup = appointment.startTime.toISOString().split("T")[0];

        if (!appointmentGroups[dateGroup]) {
            appointmentGroups[dateGroup] = [];
        }

        appointmentGroups[dateGroup].push(appointment);
    }
    const grouped = Object.entries(appointmentGroups);
    return grouped;
}