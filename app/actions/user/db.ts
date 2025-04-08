"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../lib/database/db";
import { Role } from "@prisma/client";

export async function getUsers(currPage: number) {
    const result = await prisma.user
        .paginate({})
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        })

    return result;
}

export async function getEmployees() {
    return await prisma.user.findMany({
        where: {
            role: 'EMPLOYEE'
        }
    }
    )
}

export async function getEmployeebyId(id: string) {
    return await prisma.employee.findUnique({
        where: {
            userId: id
        }
    }
    )
}

export async function getEmployeesByService(serviceId: string) {
    return await prisma.employee.findMany({
        where: {
            services: {
                some: {
                    id: serviceId
                }
            }
        },
        include: {
            user: true
        }
    })
}

export async function getClients() {
    return await prisma.user.findMany({
        where: {
            role: 'USER'
        }
    }
    )
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
            data: { userId: user.id }
        });
    } else if (role === "USER") {
        await prisma.client.create({
            data: { userId: user.id }
        });
    }
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
            create: { userId: id },
        });
    } else if (role === "USER") {
        await prisma.employee.deleteMany({ where: { userId: id } });

        await prisma.client.upsert({
            where: { userId: id },
            update: {},
            create: { userId: id },
        });
    }
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id: id } });
    revalidatePath('/dashboard/users');
}