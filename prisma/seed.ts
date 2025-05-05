import { PrismaClient, Role } from "@prisma/client";
import { saltAndHashPassword } from "../app/lib/auth/hash";

const prisma = new PrismaClient();

async function main() {
    console.log("Started seeding...");
    const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
    const password = process.env.INIT_ADMIN_PASSWORD || "adminpassword123";

    if (!process.env.INIT_ADMIN_EMAIL || !process.env.INIT_ADMIN_PASSWORD) {
        console.log("Not recommended - using default admin email/password.");
    }

    const hashed = await saltAndHashPassword(password);

    await prisma.user.upsert({
        where: { email: email, },
        update: {},
        create: {
            email: email,
            firstName: "Admin",
            lastName: "Admin",
            role: Role.ADMIN,
            hashedPassword: hashed,
        },
    })
    console.log("Seeding complete.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })