"use server";
import { loginSchema } from "../../../lib/database/zod"
import { verifyPassword } from "../../../lib/auth/hash";
import { getUserByEmail } from "../db";
import { createSession, deleteSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import { LoginFormState } from "@/app/lib/states/states";

export async function login(state: LoginFormState, formData: FormData) {
    const validationResult = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            _errors: {
                email: validationResult.error.format().email?._errors,
                password: validationResult.error.format().password?._errors,
            }
        }
    }

    const user = await getUserByEmail(validationResult.data.email);

    if (!user) {
        return {
            _errors: { password: ["Email or password is incorrect."] }
        }
    }

    const isPasswordValid = await verifyPassword(validationResult.data.password, user.hashedPassword);

    if (!isPasswordValid) {
        return {
            _errors: { password: ["Email or password is incorrect."] }
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