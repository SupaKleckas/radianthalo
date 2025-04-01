"use client";
import { useActionState, useState } from "react";
import { editServiceByForm } from "@/app/actions/serviceActions";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/app/components/MultiSelect";

type ServiceWithEmployees = {
    id: string;
    title: string;
    price: number;
    duration: number;
    employees: { userId: string }[];
};

export default function UserEditForm({ service, employees }: { service: ServiceWithEmployees, employees: User[] }) {
    const [state, updateServiceAction] = useActionState(editServiceByForm, undefined);
    const [selectedEmployees, setSelectedEmployees] = useState(service.employees.map((e: any) => e.userId)) || [];

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className="w-full flex flex-col items-center">
                <form action={updateServiceAction} className="w-full flex flex-col items-center">
                    <input type="text" name="title" defaultValue={service.title} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.title && <p className='text-red-500 text-sm'>{state.errors.title._errors[0]}</p>}
                    <input type="number" name="price" defaultValue={service.price} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.price && <p className='text-red-500 text-sm'>{state.errors.price._errors[0]}</p>}
                    <input type="number" name="duration" defaultValue={service.duration} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.duration && <p className='text-red-500 text-sm'>{state.errors.duration._errors[0]}</p>}
                    <MultiSelect
                        employees={employees}
                        selectedValues={selectedEmployees}
                        setSelectedValues={setSelectedEmployees}
                    />
                    <input
                        type="hidden"
                        name="employeeIds"
                        value={JSON.stringify(selectedEmployees)}
                    />
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <input type="hidden" name="id" value={service.id} />
                    <Button className="hover:cursor-pointer bg-slate-500 hover:bg-slate-600">Save</Button>
                </form>
            </div>
        </div >
    );
}