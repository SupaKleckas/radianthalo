"use server";
import { loginSchema } from "../../../lib/database/zod"
import { verifyPassword } from "../../../lib/auth/hash";
import { getUserByEmail } from "../db";
import { createSession, deleteSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";

export async function login(state: any, formData: FormData) {
    const validationResult = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    const user = await getUserByEmail(validationResult.data.email);

    if (!user) {
        return {
            password: {
                _errors: ["Email or password is incorrect."]
            }
        }
    }

    const isPasswordValid = await verifyPassword(validationResult.data.password, user.hashedPassword);

    if (!isPasswordValid) {
        return {
            password: {
                _errors: ["Email or password is incorrect."]
            }
        }
    }

    await createSession(user.id, user.role);

    switch (user.role) {
        case "ADMIN":
            redirect("/dashboard")
        case "USER":
            redirect("/home")
        case "EMPLOYEE":
            redirect("/staff-dashboard")
        default:
            redirect("/");
    }
}

export async function logout() {
    await deleteSession();
    redirect("/");
}