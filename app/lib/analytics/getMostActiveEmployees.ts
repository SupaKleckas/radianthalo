import prisma from "@/app/lib/database/db";

export default async function getMostActiveEmployees() {
    const data = await prisma.employee.findMany({
        select: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            _count: {
                select: {
                    appointment: true
                }
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
        .filter(employee => employee._count.appointment > 0)
        .map(employee => ({
            name: employee.user.firstName + " " + employee.user.lastName,
            count: employee._count.appointment,
        }));

    return result;
}