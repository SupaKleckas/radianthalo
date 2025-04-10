import prisma from "@/app/lib/database/db";

export default async function getAppointmentsPerMonth() {
    const data = await prisma.appointment.findMany({
        select: {
            startTime: true
        }
    })

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

    console.log(result)

    return result
}