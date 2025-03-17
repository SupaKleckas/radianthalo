"use server";
import prisma from "../lib/db";

export async function getUsers() {
    return await prisma.user.findMany();
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

export async function addUser(email: string, hashedPassword: string) {
    return await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword
        }
    });
}

export async function updateUser() {
}

export async function deleteUser() {

}