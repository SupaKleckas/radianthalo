import prisma from "@/app/lib/database/db";

export default async function getAppointmentsPerService() {
    const data = await prisma.service.findMany({
        select: {
            title: true,
            _count: {
                select: { appointment: true }
            }
        },
        orderBy: {
            appointment: {
                _count: 'desc'
            }
        },
        take: 5
    });

    const result = data
        .filter(service => service._count.appointment > 0)
        .sort((a, b) => b._count.appointment - a._count.appointment)
        .map(service => ({
            title: service.title,
            count: service._count.appointment,
        }));

    return result;
}