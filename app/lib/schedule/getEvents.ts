import { getEmployeeAppointments } from "@/app/actions/appointment/db";
import { getServiceById } from "@/app/actions/service/db";
import { getUserById } from "@/app/actions/user/db";

export async function getEvents(userId: string) {
    const appointments = await getEmployeeAppointments(userId);

    const events = await Promise.all(
        appointments.map(async (appointment) => {
            let client;
            let service;
            if (appointment.clientId) {
                client = await getUserById(appointment.clientId);
            }
            if (appointment.serviceId) {
                service = await getServiceById(appointment.serviceId);
            }
            return {
                title: `${service ? service.title : appointment.title}`,
                start: new Date(appointment.startTime),
                end: new Date(appointment.endTime),
                client: `${client ? client.firstName + " " + client.lastName : ""}`,
                paymentMethod: `${appointment.paymentMethod}`
            };
        })
    );
    return events;
};