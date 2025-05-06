import prisma from "@/app/lib/database/db";

export default async function getEmployeeMostPopularService(employeeId: string) {
    const data = await prisma.service.findMany({
        where: {
            appointment: {
                some: {
                    employeeId: employeeId
                }
            }
        },
        select: {
            id: true,
            title: true,
            _count: {
                select: {
                    appointment: {
                        where: {
                            employeeId: employeeId
                        }
                    }
                }
            }
        }
    });

    const result = data
        .filter(service => service._count.appointment > 0)
        .sort((a, b) => b._count.appointment - a._count.appointment)
        .slice(0, 3)
        .map(service => ({
            title: service.title,
            count: service._count.appointment,
        }));

    return result;
}