"use server";
import prisma from "@/app/lib/database/db";
import { Appointment, Review } from "@prisma/client";
import { Role, ServiceCategory, Prisma } from "@prisma/client";

export async function getReviews(currPage: number, query?: string, service?: string, category?: string, client?: string, employee?: string) {
    const searchTerm = query
        ? {
            OR: [
                { content: { contains: query, mode: 'insensitive' as const } },
                { service: { title: { contains: query, mode: 'insensitive' as const } } },
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
        }
        : {};

    const categoryFilter = category ? {
        service:
        {
            category:
                { equals: category as ServiceCategory }
        }
    } : {};

    const serviceFilter = service ? {
        service: {
            OR: [
                { title: { contains: service, mode: 'insensitive' as const } },
                { id: { contains: service, mode: 'insensitive' as const } }
            ]
        }
    } : {};

    const clientFilter = client ? {
        client: {
            user: {
                OR: [
                    { firstName: { contains: client, mode: 'insensitive' as const } },
                    { lastName: { contains: client, mode: 'insensitive' as const } },
                    { id: { contains: client, mode: 'insensitive' as const } },
                ]
            }
        }
    } : {};

    const employeeFilter = employee ? {
        employee: {
            user: {
                OR: [
                    { firstName: { contains: employee, mode: 'insensitive' as const } },
                    { lastName: { contains: employee, mode: 'insensitive' as const } },
                    { id: { contains: employee, mode: 'insensitive' as const } },
                ]
            }
        }
    } : {};

    const whereClause = {
        ...searchTerm,
        ...serviceFilter,
        ...categoryFilter,
        ...clientFilter,
        ...employeeFilter
    };

    return await prisma.review
        .paginate({
            where: whereClause,
            include: {
                service: true,
                client: { include: { user: true } },
                employee: { include: { user: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        .withPages({
            limit: 10,
            page: currPage,
            includePageCount: true
        });
}

export async function addReview(rating: number, content: string, clientId: string, employeeId: string, serviceId: string) {
    const review = await prisma.review.create({
        data: {
            rating: rating,
            content: content,
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