import { NextResponse } from "next/server";
import prisma from "@/app/lib/database/db";

export async function GET() {
    const oneDayOld = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.temporaryAppointment.deleteMany({
        where: {
            createdAt: {
                lte: oneDayOld
            }
        }
    })

    return NextResponse.json({ deleted: result.count });
}
