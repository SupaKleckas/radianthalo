"use client";
import React, { useState, useActionState } from 'react';
import { addServiceByForm } from "@/app/actions/service/actions"
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/app/components/UI/MultiSelect";
import { User, ServiceCategory } from "@prisma/client";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';

interface AddServiceFormProps {
    employees: User[];
}

export function AddServiceForm({ employees }: AddServiceFormProps) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [duration, setDuration] = useState<number | ''>('');
    const [state, addServiceAction] = useActionState(addServiceByForm, undefined);
    const [servicecategory, setServiceCategory] = useState<ServiceCategory>(ServiceCategory.Hair);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrice(value === '' ? '' : Number(value));
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDuration(value === '' ? '' : Number(value));
    };

    return (
        <div className='flex justify-center'>
            <div className='w-[50%] flex flex-col items-center'>
                <form action={addServiceAction} className='flex flex-col w-full gap-y-2'>
                    <Label htmlFor='title' className='text-base text-slate-700'>Title</Label>
                    <Input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className='w-full'
                    />
                    {state?.errors?.title && <p className='text-red-500 text-sm'>{state.errors.title._errors[0]}</p>}
                    <Label htmlFor='price' className='text-base text-slate-700'>Price</Label>
                    <Input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Price'
                        value={price}
                        onChange={handlePriceChange}
                        className='w-full'
                    />
                    {state?.errors?.price && <p className='text-red-500 text-sm'>{state.errors.price._errors[0]}</p>}
                    <Label htmlFor='duration' className='text-base text-slate-700'>Duration</Label>
                    <Input
                        type='number'
                        id='duration'
                        name='duration'
                        placeholder='Duration'
                        value={duration}
                        onChange={handleDurationChange}
                        className='w-full'
                    />
                    {state?.errors?.duration && <p className='text-red-500 text-sm'>{state.errors.duration._errors[0]}</p>}
                    <Label htmlFor='category' className='text-base text-slate-700'>Category</Label>
                    <Select value={servicecategory} onValueChange={(value) => setServiceCategory(value as ServiceCategory)}>
                        <SelectTrigger className="w-full" defaultValue={ServiceCategory.Hair}>
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
                    <Label htmlFor='employees' className='text-base text-slate-700'>Employees</Label>
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
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <div className='flex justify-center mt-4'>
                        <Button type='submit' className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                            Add service
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}