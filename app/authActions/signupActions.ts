"use server";

import { signupSchema } from "../lib/zod"
import { saltAndHashPassword } from "../lib/hash";
import { addUser, getUserByEmail } from "../actions/userActions";
import { redirect } from "next/navigation";

export async function signup(state: any, formData: FormData) {
    console.log(formData.get("email"));
    console.log(formData.get("password"));

    const validationResult = signupSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getUserByEmail(validationResult.data.email) != null) {
        return {
            errors: {
                email: "Email already exists."
            }
        }
    }

    const hashed = await saltAndHashPassword(validationResult.data.password);
    await addUser(validationResult.data.email, hashed);

    redirect("/");
}