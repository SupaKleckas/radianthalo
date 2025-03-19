"use server";

import { addUserSchema } from "../lib/zod"
import { saltAndHashPassword } from "../lib/hash";
import { addUser, getUserByEmail } from "./userDbActions";
import { redirect } from "next/navigation";

export async function addUserByForm(state: any, formData: FormData) {
    const validationResult = addUserSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getUserByEmail(validationResult.data.email) != null) {
        return {
            _errors: ["Email already exists."]
        }
    }

    const hashed = await saltAndHashPassword(validationResult.data.password);
    await addUser(validationResult.data.email, hashed, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.role);

    redirect("/dashboard/users")
}