"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../lib/database/db";
import { ServiceCategory } from "@prisma/client";

export async function getAllServices() {
    return await prisma.service.findMany();
}

export async function getServices(currPage: number) {
    const result = await prisma.service
        .paginate({})
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        })

    return result;
}

export async function getServiceById(id: string) {
    return await prisma.service.findUnique({
        where: {
            id: id
        },
        include: {
            employees: true
        }
    });
}

export async function addService(title: string, price: number, duration: number, category: ServiceCategory, employeeIds: string[]) {
    await prisma.service.create({
        data: {
            title: title,
            price: price,
            duration: duration,
            category: category,
            employees: {
                connect: employeeIds.map((userId) => ({ userId })),
            }
        }
    });

    revalidatePath("/dashboard/services");
}

export async function updateService(id: string, title: string, price: number, duration: number, category: ServiceCategory, employeeIds: string[]) {
    const existingService = await prisma.service.findUnique({
        where: { id },
        include: { employees: true },
    });

    if (!existingService) {
        revalidatePath("/dashboard/services");
        return
    }

    const existingEmployeeIds = existingService.employees.map((e) => e.userId);

    const employeesToConnect = employeeIds.filter((id) => !existingEmployeeIds.includes(id));
    const employeesToDisconnect = existingEmployeeIds.filter((id) => !employeeIds.includes(id));

    const existingEmployees = await prisma.employee.findMany({
        where: {
            userId: { in: employeeIds }
        },
        select: { userId: true }
    });

    const validEmployeeIds = existingEmployees.map(e => e.userId);

    if (validEmployeeIds.length !== employeeIds.length) {
        revalidatePath("/dashboard/services");
        return
    }

    await prisma.service.update({
        where: {
            id: id
        },
        data: {
            title: title,
            price: price,
            duration: duration,
            category: category,
            employees: {
                connect: employeesToConnect.map((userId) => ({ userId })),
                disconnect: employeesToDisconnect.map((userId) => ({ userId })),
            }
        }
    })
    revalidatePath("/dashboard/services");
}

export async function deleteService(id: string): Promise<void> {
    await prisma.service.delete({ where: { id: id } });
    revalidatePath("/dashboard/services");
}