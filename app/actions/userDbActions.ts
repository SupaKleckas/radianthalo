"use server";
import { revalidatePath } from "next/cache";
import prisma from "../lib/db";
import { Role } from "@prisma/client";

export async function getUsers() {
    return await prisma.user.findMany({
        orderBy: {
            role: 'asc'
        }
    }
    );
}

export async function getEmployees() {
    return await prisma.user.findMany({
        where: {
            role: 'EMPLOYEE'
        }
    }
    )
}

export async function getClients() {
    return await prisma.user.findMany({
        where: {
            role: 'USER'
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

export async function addUser(email: string, hashedPassword: string, firstName: string, lastName: string, role?: Role) {
    return await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: role
        }
    });
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
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id: id } });
    revalidatePath('/dashboard/users');
}