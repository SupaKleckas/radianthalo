"use server";
import prisma from "@/app/lib/database/db";
import { Employee, PaymentMethod, User } from "@prisma/client";
import { parseISO, isValid, startOfDay, endOfDay } from "date-fns";

export async function getAppointments(currPage: number, query?: string) {
    let searchTerm = {};
    if (query) {
        const queryTrimmed = query.trim();
        const possibleDate = parseISO(queryTrimmed);
        const validDate = isValid(possibleDate);

        if (validDate) {
            searchTerm = {
                OR: [
                    { title: { contains: query, mode: 'insensitive' as const } },
                    // CLIENT first + last name
                    {
                        AND: [
                            { client: { user: { firstName: { contains: query.split(' ')[0], mode: 'insensitive' as const } } } },
                            { client: { user: { lastName: { contains: query.split(' ')[1] || query.split(' ')[0], mode: 'insensitive' as const } } } }
                        ]
                    },
                    // EMPLOYEE first + last name
                    {
                        AND: [
                            { employee: { user: { firstName: { contains: query.split(' ')[0], mode: 'insensitive' as const } } } },
                            { employee: { user: { lastName: { contains: query.split(' ')[1] || query.split(' ')[0], mode: 'insensitive' as const } } } }
                        ]
                    },
                    // Individual
                    { client: { user: { firstName: { contains: query, mode: 'insensitive' as const } } } },
                    { client: { user: { lastName: { contains: query, mode: 'insensitive' as const } } } },
                    { employee: { user: { firstName: { contains: query, mode: 'insensitive' as const } } } },
                    { employee: { user: { lastName: { contains: query, mode: 'insensitive' as const } } } },
                    { startTime: { gte: startOfDay(possibleDate), lte: endOfDay(possibleDate) } }
                ]
            }
        } else {
            searchTerm = {
                OR: [
                    { title: { contains: query, mode: 'insensitive' as const } },
                    // CLIENT first + last name
                    {
                        AND: [
                            { client: { user: { firstName: { contains: query.split(' ')[0], mode: 'insensitive' as const } } } },
                            { client: { user: { lastName: { contains: query.split(' ')[1] || query.split(' ')[0], mode: 'insensitive' as const } } } }
                        ]
                    },
                    // EMPLOYEE first + last name
                    {
                        AND: [
                            { employee: { user: { firstName: { contains: query.split(' ')[0], mode: 'insensitive' as const } } } },
                            { employee: { user: { lastName: { contains: query.split(' ')[1] || query.split(' ')[0], mode: 'insensitive' as const } } } }
                        ]
                    },
                    // Individual
                    { client: { user: { firstName: { contains: query, mode: 'insensitive' as const } } } },
                    { client: { user: { lastName: { contains: query, mode: 'insensitive' as const } } } },
                    { employee: { user: { firstName: { contains: query, mode: 'insensitive' as const } } } },
                    { employee: { user: { lastName: { contains: query, mode: 'insensitive' as const } } } }
                ]
            };
        }
    }

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

export async function getClientAppointments(currPage: number, clientId: string) {
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

export async function getEmployeeAppointments(employeeId: string) {
    const result = await prisma.appointment.findMany({
        where: {
            employeeId: employeeId,
        }
    })

    return result
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

export async function addAppointment(title: string, startTime: Date, endTime: Date, employeeId: string, clientId: string, serviceId: string, paymentMethod: PaymentMethod) {
    return await prisma.appointment.create({
        data: {
            title: title,
            startTime: startTime,
            endTime: endTime,
            paymentMethod: paymentMethod,
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

export async function deleteAppointment(id: string) {
    await prisma.appointment.delete({
        where: { id: id }
    })
}

export async function updateAppointment(id: string, startTime: Date, endTime: Date, employeeId: string) {
    return await prisma.appointment.update({
        where: {
            id: id
        },
        data: {
            startTime: startTime,
            endTime: endTime,
            employeeId: employeeId,
        }
    })
}

export async function getEmployeeAppointmentsInInterval(fromDate: Date, toDate: Date, employeeId: string) {
    return await prisma.appointment.findMany({
        where: {
            employeeId: employeeId,
            startTime: {
                gte: fromDate,
                lte: toDate
            },
        },
        include: {
            client: {
                include: {
                    user: {
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            }
        }
    })
}

export async function deleteExpiredTemporaryAppointments() {
    const oneDayOld = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleted = await prisma.temporaryAppointment.deleteMany({
        where: {
            createdAt: {
                lte: oneDayOld
            }
        }
    })
    console.log(`Deleted ${deleted.count} expired temporary appointments.`);
}

export async function doesApptExist(employeeId: string, startTime: Date, endTime: Date) {
    const existingAppointment = await prisma.appointment.findFirst({
        where: {
            employeeId: employeeId,
            OR: [
                {
                    startTime: {
                        gte: startTime,
                        lt: endTime
                    }
                },
                {
                    endTime: {
                        gt: startTime,
                        lte: endTime
                    }
                },
                {
                    startTime: {
                        lte: startTime
                    },
                    endTime: {
                        gte: endTime
                    }
                }
            ]
        }
    });

    return Boolean(existingAppointment);
}
