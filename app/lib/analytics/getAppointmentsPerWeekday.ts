import prisma from "@/app/lib/database/db";

export default async function getAppointmentsPerWeekday() {
    const data = await prisma.appointment.findMany({
        select: {
            startTime: true
        },
    })

    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

    data.forEach(appt => {
        const day = appt.startTime.getDay();
        weekdayCounts[day]++;
    })

    const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


    const result = weekdayCounts.map((count, index) => ({
        weekday: weekdayLabels[index],
        count: count
    }))

    return result;
}