"use server";
// UNFINISHED
import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

export async function getAppointments() {
    return await prisma.service.findMany();
}

export async function getAppointmentById(id: string) {
    return await prisma.service.findUnique({
        where: {
            id: id
        }
    });
}

export async function addAppointment(title: string, price: number, duration: number) {
    await prisma.service.create({
        data: {
            title: title,
            price: price,
            duration: duration,
        }
    });

    revalidatePath('/dashboard/appointments');
}

export async function updateAppointment(id: string, title: string, price: number, duration: number) {
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
    revalidatePath(`/dashboard/appointments/${id}`);
}

export async function deleteAppointment(id: string): Promise<void> {
    await prisma.service.delete({ where: { id: id } });
    revalidatePath('/dashboard/appointments');
}