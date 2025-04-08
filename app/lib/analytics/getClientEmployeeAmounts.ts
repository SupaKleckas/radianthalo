import prisma from "@/app/lib/database/db";

export async function getEmployeeCount() {
    const employees = await prisma.employee.count();
    return employees;
}

export async function getClientCount() {
    const clients = await prisma.client.count();
    return clients;
}