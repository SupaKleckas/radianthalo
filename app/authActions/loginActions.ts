"use server";

import { loginSchema } from "../lib/zod"
import { verifyPassword } from "../lib/hash";
import { getUserByEmail } from "../actions/userActions";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function login(state: any, formData: FormData) {
    const validationResult = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        console.log(validationResult.error.format())
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

    await createSession(user.id);

    redirect("/");
}

export async function logout() {
}