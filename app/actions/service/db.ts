"use server";
import prisma from "../../lib/database/db";
import { ServiceCategory } from "@prisma/client";
import { stripe } from "@/app/lib/stripe/stripe";
import { redirect } from "next/navigation";

export async function getAllServices() {
    return await prisma.service.findMany();
}

export async function getPopularServices() {
    return await prisma.service.findMany({
        select: {
            id: true,
            title: true,
            duration: true,
            price: true,
            _count: {
                select: {
                    appointment: true
                }
            }
        },
        orderBy: {
            appointment: {
                _count: 'desc'
            }
        },
        take: 4
    });
}

export async function getServices(currPage: number, query?: string) {
    const searchTerm = query
        ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' as const } },
            ]
        }
        : {};


    const result = await prisma.service
        .paginate({
            where: searchTerm,
        })
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
    const service = await prisma.service.create({
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

    const stripeService = await stripe.products.create({
        name: service.title,
        default_price_data: {
            currency: 'EUR',
            unit_amount: Math.round(price * 100),
        }
    });

    await prisma.service.update({
        where: { id: service.id },
        data: {
            stripeProductId: stripeService.id,
            stripePriceId: stripeService.default_price as string
        }
    });

    redirect("/dashboard/services");
}

export async function updateService(id: string, title: string, price: number, duration: number, category: ServiceCategory, employeeIds: string[]) {
    const existingService = await prisma.service.findUnique({
        where: { id },
        include: { employees: true },
    });

    if (!existingService || !existingService.stripeProductId) {
        redirect("/dashboard/services");
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
        redirect("/dashboard/services");
    }

    const service = await prisma.service.update({
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

    const newPrice = await stripe.prices.create({
        product: existingService.stripeProductId,
        unit_amount: Math.round(price * 100),
        currency: 'EUR',
    });

    await stripe.products.update(
        service.stripeProductId!,
        {
            name: service.title,
            default_price: newPrice.id,
        }
    );

    redirect("/dashboard/services");
}

export async function deleteService(id: string): Promise<void> {
    const service = await prisma.service.delete({ where: { id: id } });

    await stripe.products.update(
        service.stripeProductId!,
        {
            active: false
        }
    );

    redirect("/dashboard/services");
}