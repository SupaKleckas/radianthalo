"use server";
// UNFINISHED
import { revalidatePath } from "next/cache";
import prisma from "../lib/db";
import { Employee } from "@prisma/client";

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

export async function getAppointmentForTimeSlots(employee: Employee, startOfDay: Date, endOfDay: Date) {
    return await prisma.appointment.findMany({
        where: {
            employeeId: employee.userId,
            startTime: { gte: startOfDay, lt: endOfDay },
        },
        select: { startTime: true, endTime: true },
    });
}

export async function addAppointment(title: string, startTime: Date, endTime: Date, employeeId: string, clientId: string, serviceId: string) {
    await prisma.appointment.create({
        data: {
            title: title,
            startTime: startTime,
            endTime: endTime,
            Employee: {
                connect: {
                    userId: employeeId
                }
            },
            Client: {
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