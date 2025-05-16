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

    const result = data.map(item => ({
        name: item.user.firstName + " " + item.user.lastName,
        count: item._count.appointment
    }));

    return result;
}