"use server";
import { addUserSchema, editUserSchema, editPasswordSchema, editAccountSchema } from "@/app/lib/database/zod"
import { saltAndHashPassword } from "@/app/lib/auth/hash";
import { addUser, getUserByEmail, getUserById, updateUser, updateUserDetails, updateUserPassword } from "@/app/actions/user/db"
import { redirect } from "next/navigation";
import { EditAccountState, EditPasswordState, AddUserFormState, EditUserFormState } from "@/app/lib/states/states";
import { sendPasswordChangeEmail } from "@/app/lib/email/sendPasswordChangeEmail"
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { logout } from "./login/actions";

export async function addUserByForm(state: AddUserFormState, formData: FormData) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "ADMIN") {
        logout();
    }

    const validationResult = addUserSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            _errors: {
                email: validationResult.error.format().email?._errors,
                password: validationResult.error.format().password?._errors,
                firstname: validationResult.error.format().firstName?._errors,
                lastname: validationResult.error.format().lastName?._errors,
                role: validationResult.error.format().role?._errors,
            }
        };
    }

    if (await getUserByEmail(validationResult.data.email) != null) {
        return { _errors: { role: ["Something went wrong. Try again later."] } }
    }

    const hashed = await saltAndHashPassword(validationResult.data.password);
    await addUser(validationResult.data.email, hashed, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.role);
    redirect("/dashboard/users");
}

export async function editUserByForm(state: EditUserFormState, formData: FormData) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "ADMIN") {
        logout();
    }

    const validationResult = editUserSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            _errors: {
                email: validationResult.error.format().email?._errors,
                firstname: validationResult.error.format().firstName?._errors,
                lastname: validationResult.error.format().lastName?._errors,
                role: validationResult.error.format().role?._errors,
            }
        }
    }

    if (await getUserById(validationResult.data.id) == null) {
        return {
            _errors: { role: ["Something went wrong. Try again later."] }
        }
    }

    await updateUser(validationResult.data.id, validationResult.data.email, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.role);
    redirect("/dashboard/users");
}

export async function editPasswordAction(state: EditPasswordState, formData: FormData): Promise<EditPasswordState> {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || !userInfo.userId) {
        logout();
        redirect("/");
    }

    const data = {
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const validationResult = editPasswordSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            _errors: {
                newPassword: validationResult.error.format().newPassword?._errors,
                confirmPassword: validationResult.error.format().confirmPassword?._errors,
            }
        };
    }
    const { newPassword } = validationResult.data;

    const user = await getUserById(userInfo.userId)

    if (!user) {
        return { _errors: { confirmPassword: ["Something went wrong. Try again later."] } }
    }

    const hashed = await saltAndHashPassword(newPassword);
    await updateUserPassword(userInfo.userId, hashed);

    const response = await sendPasswordChangeEmail(user);

    switch (user.role) {
        case "ADMIN":
            return redirect(response.success ? "/dashboard/account?status=password-success" : "/dashboard/account?status=password-success-noemail");
        case "EMPLOYEE":
            return redirect(response.success ? "/staff-dashboard/account?status=password-success" : "/staff-dashboard/account?status=password-success-noemail");
        case "USER":
            return redirect(response.success ? "/home/account?status=password-success" : "/home/account?status=password-success-noemail");
        default:
            return redirect("/");
    }
}

export async function editAccountAction(state: EditAccountState, formData: FormData): Promise<EditAccountState> {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || !userInfo.userId) {
        logout();
        redirect("/");
    }

    const data = {
        firstName: formData.get("firstname"),
        lastName: formData.get("lastname"),
        email: formData.get("email")
    };

    const validationResult = editAccountSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            _errors: {
                firstName: validationResult.error.format().firstName?._errors,
                lastName: validationResult.error.format().lastName?._errors,
                email: validationResult.error.format().email?._errors,
            }
        };
    }

    const user = await getUserById(userInfo.userId)

    if (!user) {
        return {
            _errors:
                { email: ["Something went wrong. Try again later."] }
        }
    }

    await updateUserDetails(userInfo.userId, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.email);
    switch (user.role) {
        case "ADMIN":
            redirect("/dashboard/account?status=detail-success");
        case "USER":
            redirect("/home/account?status=detail-success");
        case "EMPLOYEE":
            redirect("/staff-dashboard/account?status=detail-success");
        default:
            redirect("/");
    }
}