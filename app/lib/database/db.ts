import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

const prismaClientSingleton = () => {
    return new PrismaClient().$extends(pagination({
        pages: {
            limit: 20
        }
    }));
};

const globalForPrisma = globalThis as unknown as {
    prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaGlobal = prisma;
}
