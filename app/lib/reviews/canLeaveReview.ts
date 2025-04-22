import prisma from "../database/db";

export async function canLeaveReview(clientId: string, employeeId?: string | null, serviceId?: string | null) {
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