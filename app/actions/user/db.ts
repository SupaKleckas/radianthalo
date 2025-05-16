"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../lib/database/db";
import { Role, Prisma } from "@prisma/client";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { logout } from "./login/actions";

export async function getUsers(currPage: number, query?: string, role?: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "ADMIN") {
        logout();
    }

    const searchTerm: Prisma.UserWhereInput = {
        AND: [
            query
                ? {
                    OR: [
                        { firstName: { contains: query, mode: 'insensitive' as const } },
                        { lastName: { contains: query, mode: 'insensitive' as const } },
                        { email: { contains: query, mode: 'insensitive' as const } },
                    ]
                }
                : {},
            role ? { role } : {},
        ].filter(Boolean) as Prisma.UserWhereInput[]
    };
    const result = await prisma.user
        .paginate({
            where: searchTerm,
        })
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        });

    return result;
}

export async function getEmployees() {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "ADMIN") {
        logout();
    }
    return await prisma.user.findMany({
        where: {
            role: 'EMPLOYEE'
        }
    }
    )
}

export async function getEmployeeById(id: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo) {
        logout();
    }

    return await prisma.employee.findUnique({
        where: {
            userId: id
        }
    }
    )
}

export async function getEmployeesByService(serviceId: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        logout();
    }

    return await prisma.user.findMany({
        where: {
            employee: {
                services: {
                    some: {
                        id: serviceId
                    }
                }
            }
        }
    })
}

export async function getClientById(id: string) {
    return await prisma.client.findUnique({
        where: {
            userId: id
        }
    }
    )
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
}

export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

export async function addUser(email: string, hashedPassword: string, firstName: string, lastName: string, role: Role = "USER") {
    const user = await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: role
        }
    });

    if (role === "EMPLOYEE") {
        await prisma.employee.create({
            data: {
                userId: user.id,
                availability: {
                    createMany: {
                        data: [
                            {
                                day: "Monday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Tuesday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Wednesday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Thursday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Friday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Saturday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Sunday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            }
                        ]
                    }
                }
            }
        });
    } else if (role === "USER") {
        await prisma.client.create({
            data: { userId: user.id }
        });
    }
    return user;
}

export async function updateUser(id: string, email: string, firstName: string, lastName: string, role: Role) {
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role
        }
    })

    if (role === "EMPLOYEE") {
        await prisma.client.deleteMany({ where: { userId: id } });

        await prisma.employee.upsert({
            where: { userId: id },
            update: {},
            create: {
                userId: id,
                availability: {
                    createMany: {
                        data: [
                            {
                                day: "Monday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Tuesday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Wednesday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Thursday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Friday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Saturday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            },
                            {
                                day: "Sunday",
                                fromTime: "08:00",
                                untilTime: "18:00",

                            }
                        ]
                    }
                }
            },
        });
    } else if (role === "USER") {
        await prisma.employee.deleteMany({ where: { userId: id } });

        await prisma.client.upsert({
            where: { userId: id },
            update: {},
            create: { userId: id },
        });
    } else if (role === "ADMIN") {
        await prisma.client.deleteMany({ where: { userId: id } });
        await prisma.employee.deleteMany({ where: { userId: id } });
    }

    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id: id } });
    revalidatePath('/dashboard/users');
}

export async function updateUserPassword(id: string, password: string) {
    await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            hashedPassword: password
        }
    })
}

export async function updateUserDetails(id: string, firstName: string, lastName: string, email: string) {
    await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email
        }
    })
}