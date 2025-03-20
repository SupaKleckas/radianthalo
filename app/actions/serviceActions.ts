import { addServiceSchema } from "../lib/zod";
import { } from "./serviceDbActions";
import { redirect } from "next/navigation";

export async function addService(state: any, formData: FormData) {
    const validationResult = addServiceSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    //await addService();

    redirect("/dashboard/services")
}

// export async function editUserByForm(state: any, formData: FormData) {
//     const validationResult = editUserSchema.safeParse(Object.fromEntries(formData));

//     if (!validationResult.success) {
//         return {
//             errors: validationResult.error.format(),
//         }
//     }

//     if (await getUserById(validationResult.data.id) == null) {
//         return {
//             _errors: ["ID doesn't exist."]
//         }
//     }

//     await updateUser(validationResult.data.id, validationResult.data.email, validationResult.data.firstName, validationResult.data.lastName, validationResult.data.role);
// }