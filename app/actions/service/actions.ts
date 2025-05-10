import { addServiceSchema, editServiceSchema } from "../../lib/database/zod";
import { addService, getServiceById, updateService } from "./db";
import { redirect } from "next/navigation";
import { ServiceCategory } from "@prisma/client";
import { AddServiceFormState, EditServiceFormState } from "@/app/lib/states/states";

export async function addServiceByForm(state: AddServiceFormState, formData: FormData) {
    if (formData.get('price') === '' || formData.get('duration') === '') {
        return {
            _errors: { employees: ["Please fill in all fields."] }
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
            _errors: {
                title: validationResult.error.format().title?._errors,
                price: validationResult.error.format().price?._errors,
                duration: validationResult.error.format().duration?._errors,
            }
        }
    }

    const employeeIds = formData.get('employeeIds') ? JSON.parse(formData.get('employeeIds') as string) : [];

    if (employeeIds.length === 0) {
        return {
            _errors: { employees: ["You must select at least one employee."] }
        }
    }

    const category = formData.get('category') as ServiceCategory;

    await addService(validationResult.data.title, validationResult.data.price, validationResult.data.duration, category, employeeIds);
    redirect("/dashboard/services");
}

export async function editServiceByForm(state: EditServiceFormState, formData: FormData) {
    if (formData.get('price') === '' || formData.get('duration') === '') {
        return {
            _errors: { employees: ["Please fill in all fields."] }
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
            _errors: {
                title: validationResult.error.format().title?._errors,
                price: validationResult.error.format().price?._errors,
                duration: validationResult.error.format().duration?._errors,
            }
        }
    }

    if (await getServiceById(validationResult.data.id) == null) {
        return {
            _errors: { duration: ["Service doesn't exist."] }
        }
    }

    const employeeIds = formData.get('employeeIds') ? JSON.parse(formData.get('employeeIds') as string) : [];

    if (employeeIds.length === 0) {
        return {
            _errors: { employees: ["You must select at least one employee."] }
        }
    }

    const category = formData.get('category') as ServiceCategory;

    updateService(validationResult.data.id, validationResult.data.title, validationResult.data.price, validationResult.data.duration, category, employeeIds);
    redirect("/dashboard/services");
}