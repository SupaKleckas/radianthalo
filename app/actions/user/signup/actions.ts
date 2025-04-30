"use server";

import { signupSchema } from "../../../lib/database/zod"
import { saltAndHashPassword } from "../../../lib/auth/hash";
import { addUser, getUserByEmail } from "../db";
import { redirect } from "next/navigation";
import { sendRegistrationSuccessEmail } from "@/app/lib/email/sendRegistrationSuccessEmail";

export async function signup(state: any, formData: FormData) {
    const validationResult = signupSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getUserByEmail(validationResult.data.email) != null) {
        return {
            email: {
                _errors: ["Email already exists."]
            }
        }
    }

    const hashed = await saltAndHashPassword(validationResult.data.password);
    const user = await addUser(validationResult.data.email, hashed, validationResult.data.firstName, validationResult.data.lastName);
    await sendRegistrationSuccessEmail(user);
    redirect("/?status=signup-success");
}