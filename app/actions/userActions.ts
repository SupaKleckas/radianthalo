"use server";
import { addUserSchema, editUserSchema } from "@/app/lib/zod"
import { saltAndHashPassword } from "@/app/lib/hash";
import { addUser, getUserByEmail, getUserById, updateUser } from "@/app/actions/userDbActions"
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

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
    redirect("/dashboard/users");
}

export async function editUserByForm(state: any, formData: FormData) {
    const validationResult = editUserSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getUserById(validationResult.data.id) == null) {
        return {
            _errors: ["ID doesn't exist."]
        }
    }

    await updateUser(validationResult.data.id, validationResult.data.email, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.role);
    redirect("/dashboard/users");
}