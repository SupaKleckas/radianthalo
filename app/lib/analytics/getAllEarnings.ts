import prisma from "@/app/lib/database/db";

export default async function getAllEarnings() {
    const earnings = await prisma.appointment.findMany({
        select: {
            service: {
                select: {
                    price: true
                }
            }
        }
    })

    const result = earnings.reduce((sum, item) => {
        return sum + (item.service?.price ?? 0);
    }, 0);

    return result;
}