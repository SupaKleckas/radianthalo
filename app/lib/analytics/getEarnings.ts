import prisma from "@/app/lib/database/db";

export default async function getEarnings(employeeId?: string) {
    let earnings;

    if (employeeId) {
        earnings = await prisma.appointment.findMany({
            where: {
                employeeId: employeeId
            },
            select: {
                service: {
                    select: {
                        price: true
                    }
                }
            }
        })
    } else {
        earnings = await prisma.appointment.findMany({
            select: {
                service: {
                    select: {
                        price: true
                    }
                }
            }
        })
    }

    const result = earnings.reduce((sum, item) => {
        return sum + (item.service?.price ?? 0);
    }, 0);

    return result;
}