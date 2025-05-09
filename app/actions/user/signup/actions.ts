"use server";

import { signupSchema } from "../../../lib/database/zod"
import { saltAndHashPassword } from "../../../lib/auth/hash";
import { addUser, getUserByEmail } from "../db";
import { redirect } from "next/navigation";
import { sendRegistrationSuccessEmail } from "@/app/lib/email/sendRegistrationSuccessEmail";
import { SignupFormState } from "@/app/lib/states/states";

export async function signup(state: SignupFormState, formData: FormData) {
    const validationResult = signupSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            _errors: {
                email: validationResult.error.format().email?._errors,
                password: validationResult.error.format().password?._errors,
                firstname: validationResult.error.format().firstName?._errors,
                lastname: validationResult.error.format().lastName?._errors,
            }
        };
    }

    if (await getUserByEmail(validationResult.data.email) != null) {
        return {
            _errors: { email: ["Email already exists."] }
        }
    }

    const hashed = await saltAndHashPassword(validationResult.data.password);
    const user = await addUser(validationResult.data.email, hashed, validationResult.data.firstName, validationResult.data.lastName);
    const response = await sendRegistrationSuccessEmail(user);
    if (response) {
        redirect("/?status=signup-success");
    } else {
        redirect("/?status=signup-success-noemail");
    }

}