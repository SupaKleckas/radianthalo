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
        duration: parseInt(formData.get('duration') as string)
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
    if (formData.get('price') === '' || formData.get('duration') === '') {
        return {
            _errors: ['Please fill in all fields.']
        }
    }

    const formDataObject = {
        id: formData.get('id'),
        title: formData.get('title'),
        price: parseFloat(formData.get('price') as string),
        duration: parseInt(formData.get('duration') as string)
    };

    const validationResult = editServiceSchema.safeParse(formDataObject);

    if (!validationResult.success) {
        return {
            errors: validationResult.error.format(),
        }
    }

    if (await getServiceById(validationResult.data.id) == null) {
        return {
            _errors: ["Service ID doesn't exist."]
        }
    }

    const employeeIds = formData.get('employeeIds') ? JSON.parse(formData.get('employeeIds') as string) : [];

    updateService(validationResult.data.id, validationResult.data.title, validationResult.data.price, validationResult.data.duration, employeeIds);
    redirect("/dashboard/services");
}