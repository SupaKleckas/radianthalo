"use server";
import prisma from "@/app/lib/database/db";
import { Employee, PaymentStatus } from "@prisma/client";

export async function getAppointments(currPage: number, query?: string) {
    const searchTerm = query
        ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' as const } },
            ]
        }
        : {};

    const result = await prisma.appointment
        .paginate({
            where: searchTerm,
            orderBy: {
                startTime: "asc"
            }
        })
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        })

    return result;
}

export async function getClientAppointmetns(currPage: number, clientId: string) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await prisma.appointment
        .paginate({
            where: {
                clientId: clientId,
                startTime: {
                    gte: oneMonthAgo
                }
            },
            orderBy: {
                startTime: "asc"
            }
        })
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        })

    return result;
}

export async function getEmployeeAppointmetns(currPage: number, employeeId: string) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const result = await prisma.appointment
        .paginate({
            where: {
                employeeId: employeeId,
                startTime: {
                    gte: oneDayAgo
                }
            },
            orderBy: {
                startTime: "asc"
            }
        })
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        })

    return result;
}

export async function getAppointmentById(id: string) {
    return await prisma.appointment.findUnique({
        where: {
            id: id
        }
    });
}

export async function getAppointmentForTimeSlots(employee: Employee, startOfDay: Date, endOfDay: Date) {
    return await prisma.appointment.findMany({
        where: {
            employeeId: employee.userId,
            startTime: { gte: startOfDay, lt: endOfDay },
        },
        select: { startTime: true, endTime: true }
    });
}

export async function addAppointment(title: string, startTime: Date, endTime: Date, employeeId: string, clientId: string, serviceId: string) {
    await prisma.appointment.create({
        data: {
            title: title,
            startTime: startTime,
            endTime: endTime,
            employee: {
                connect: {
                    userId: employeeId
                }
            },
            client: {
                connect: {
                    userId: clientId
                }
            },
            service: {
                connect: {
                    id: serviceId
                }
            }
        }
    });

}

export async function addTemporaryAppointment(title: string, startTime: Date, endTime: Date, employeeId: string, clientId: string, serviceId: string) {
    return await prisma.temporaryAppointment.create({
        data: {
            title: title,
            startTime: startTime,
            endTime: endTime,
            status: PaymentStatus.PENDING_PAYMENT,
            createdAt: new Date(),
            employee: {
                connect: {
                    userId: employeeId
                }
            },
            client: {
                connect: {
                    userId: clientId
                }
            },
            service: {
                connect: {
                    id: serviceId
                }
            }
        }
    });
}

export async function deleteTemporaryAppointment(id: string) {
    await prisma.temporaryAppointment.delete({
        where: { id: id }
    })
}