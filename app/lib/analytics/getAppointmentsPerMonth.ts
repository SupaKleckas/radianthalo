import prisma from "@/app/lib/database/db";

export default async function getAppointmentsPerMonth(employeeId?: string) {
    const now = new Date().getFullYear();
    const yearStart = new Date(now, 0, 1);
    const yearEnd = new Date(now, 11, 31);

    let data;
    if (employeeId) {
        data = await prisma.appointment.findMany({
            where: {
                employeeId: employeeId,
                startTime: {
                    gte: yearStart,
                    lte: yearEnd
                }
            },
            select: {
                startTime: true
            }
        });
    } else {
        data = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: yearStart,
                    lte: yearEnd
                }
            },
            select: {
                startTime: true
            }
        });
    }

    const monthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    data.forEach(appt => {
        const month = appt.startTime.getMonth();
        monthCounts[month]++;
    })

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const result = monthCounts.map((count, index) => ({
        month: monthLabels[index],
        count: count
    }))

    return result
}