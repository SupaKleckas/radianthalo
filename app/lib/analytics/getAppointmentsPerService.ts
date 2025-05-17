import prisma from "@/app/lib/database/db";

export default async function getAppointmentsPerService() {
    const data = await prisma.service.findMany({
        where: {
            appointment: {
                some: {}
            }
        },
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

    const result = data.map(service => ({
        title: service.title,
        count: service._count.appointment
    }));

    return result;
}