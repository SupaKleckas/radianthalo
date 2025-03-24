import { addServiceSchema, editServiceSchema } from "../lib/zod";
import { addService, getServiceById, updateService } from "./serviceDbActions";
import { redirect } from "next/navigation";

export async function addServiceByForm(state: any, formData: FormData) {
    if (formData.get('price') === '' || formData.get('duration') === '') {
        return {
            _errors: ['Please fill in all fields.']
        }
    }

    const formDataObject = Object({
        title: formData.get('title'),
        price: parseFloat(formData.get('price') as string),
        duration: parseFloat(formData.get('duration') as string)
    })

    const validationResult = addServiceSchema.safeParse(formDataObject);

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }
    await addService(validationResult.data.title, validationResult.data.price, validationResult.data.duration);
    redirect("/dashboard/services");
}

export async function editServiceByForm(state: any, formData: FormData) {
    const validationResult = editServiceSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getServiceById(validationResult.data.id) == null) {
        return {
            _errors: ["ID doesn't exist."]
        }
    }

    updateService(validationResult.data.id, validationResult.data.title, validationResult.data.price, validationResult.data.duration)
}