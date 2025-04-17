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
        },
        orderBy: {
            appointment: {
                _count: 'desc'
            }
        },
        take: 3
    });


    const result = data
    .filter(service => service._count.appointment > 0)
    .map(service => ({
        title: service.title,
        count: service._count.appointment,
    }));

    return result;
}