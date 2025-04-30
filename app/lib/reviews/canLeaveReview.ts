import prisma from "../database/db";

export async function canLeaveReview(clientId: string, employeeId?: string | null, serviceId?: string | null) {
    if (!clientId || !employeeId || !serviceId) {
        return false;
    }

    const hasAppointment = await prisma.appointment.findFirst({
        where: {
            clientId,
            employeeId,
            serviceId,
        }
    });

    if (!hasAppointment) {
        return false;
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            clientId_employeeId_serviceId: {
                clientId,
                employeeId: employeeId || "",
                serviceId: serviceId || "",
            }
        }
    });
    return !existingReview;
}