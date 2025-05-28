"use client";
import { useActionState, useState } from "react";
import { editServiceByForm } from "@/app/actions/service/actions";
import { User, ServiceCategory } from "@prisma/client";
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/app/components/UI/MultiSelect";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { EditServiceFormState } from "@/app/lib/states/states";

type ServiceWithEmployees = {
    id: string;
    title: string;
    price: number;
    duration: number;
    category: ServiceCategory;
    employees: { userId: string }[];
};

export default function UserEditForm({ service, employees }: { service: ServiceWithEmployees, employees: User[] }) {
    const [state, updateServiceAction] = useActionState<EditServiceFormState, FormData>(editServiceByForm, {});
    const [selectedEmployees, setSelectedEmployees] = useState(service.employees.map((e) => e.userId)) || [];
    const [servicecategory, setServiceCategory] = useState(service.category);

    return (
        <div className="flex justify-center">
            <div className="w-[50%]">
                <form action={updateServiceAction} className="flex flex-col w-full justify-center gap-y-2">
                    <Label htmlFor='title' className='text-base text-slate-700'>Title</Label>
                    <Input type="text" id='title' name="title" defaultValue={service.title} className='w-full' />
                    {state?._errors?.title && <p className='text-red-500 text-sm'>{state._errors.title[0]}</p>}
                    <Label htmlFor='price' className='text-base text-slate-700'>Price</Label>
                    <Input type="number" id='price' name="price" defaultValue={service.price} className='w-full' />
                    {state?._errors?.price && <p className='text-red-500 text-sm'>{state._errors.price[0]}</p>}
                    <Label htmlFor='duration' className='text-base text-slate-700'>Duration</Label>
                    <Input type="number" id='duration' name="duration" defaultValue={service.duration} className='w-full' />
                    {state?._errors?.duration && <p className='text-red-500 text-sm'>{state._errors.duration[0]}</p>}
                    <Label className='text-base text-slate-700'>Category</Label>
                    <Select value={servicecategory} onValueChange={(value) => setServiceCategory(value as ServiceCategory)}>
                        <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='Hair'>{ServiceCategory.Hair}</SelectItem>
                            <SelectItem value='Lashes'>{ServiceCategory.Lashes}</SelectItem>
                            <SelectItem value='Brows'>{ServiceCategory.Brows}</SelectItem>
                            <SelectItem value='Nails'>{ServiceCategory.Nails}</SelectItem>
                        </SelectContent>
                    </Select>

                    <input type="hidden" name="category" value={servicecategory} />
                    <Label className='text-base text-slate-700'>Employees</Label>
                    <MultiSelect
                        employees={employees}
                        selectedValues={selectedEmployees}
                        setSelectedValues={setSelectedEmployees}
                    />
                    <Input
                        id='employees'
                        type="hidden"
                        name="employeeIds"
                        value={JSON.stringify(selectedEmployees)}
                    />

                    {state?._errors?.employees && <p className='text-red-500 text-sm'>{state._errors.employees[0]}</p>}
                    <Input type="hidden" name="id" value={service.id} />
                    <div className="flex justify-center">
                        <Button className="hover:cursor-pointer w-fit bg-slate-700 hover:bg-slate-800 mt-4">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}