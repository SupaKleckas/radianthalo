import { addServiceSchema, editServiceSchema } from "../../lib/database/zod";
import { addService, getServiceById, updateService } from "./db";
import { redirect } from "next/navigation";
import { ServiceCategory } from "@prisma/client";

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

    const employeeIds = formData.get('employeeIds') ? JSON.parse(formData.get('employeeIds') as string) : [];
    const category = formData.get('category') as ServiceCategory;

    await addService(validationResult.data.title, validationResult.data.price, validationResult.data.duration, category, employeeIds);
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
    const category = formData.get('category') as ServiceCategory;

    updateService(validationResult.data.id, validationResult.data.title, validationResult.data.price, validationResult.data.duration, category, employeeIds);
    redirect("/dashboard/services");
}