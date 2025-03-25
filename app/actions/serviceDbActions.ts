"use server";
import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

export async function getServices() {
    return await prisma.service.findMany();
}

export async function getServiceById(id: string) {
    return await prisma.service.findUnique({
        where: {
            id: id
        }
    });
}

export async function addService(title: string, price: number, duration: number) {
    await prisma.service.create({
        data: {
            title: title,
            price: price,
            duration: duration,
        }
    });

    revalidatePath("/dashboard/services");
}

export async function updateService(id: string, title: string, price: number, duration: number) {
    await prisma.service.update({
        where: {
            id: id
        },
        data: {
            title: title,
            price: price,
            duration: duration,
        }
    })
    revalidatePath("/dashboard/services");
}

export async function deleteService(id: string): Promise<void> {
    await prisma.service.delete({ where: { id: id } });
    revalidatePath("/dashboard/services");
}