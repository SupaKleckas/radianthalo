"use client";
import { useState, useActionState } from "react";
import { editUserByForm } from "@/app/actions/user/actions";
import { User, Role } from "@prisma/client";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function UserEditForm({ user }: { user: User }) {
    const [formData, setFormData] = useState(user);
    const [state, updateUserAction] = useActionState(editUserByForm, undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (value: Role) => {
        setFormData({ ...formData, role: value });
    }

    return (
        <div className='flex justify-center'>
            <div className='w-[50%] flex items-center'>
                <form action={updateUserAction} className="flex flex-col w-full gap-y-2">
                    <Label htmlFor='firstName' className='text-base text-slate-700'>First Name</Label>
                    <Input type="text" name="firstName" value={formData.firstName ?? ''} onChange={handleChange}
                        className='w-full' />
                    {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                    <Label htmlFor='lastName' className='text-base text-slate-700'>Last Name</Label>
                    <Input type="text" name="lastName" value={formData.lastName ?? ''} onChange={handleChange}
                        className='w-full' />
                    {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                    <Label htmlFor='email' className='text-base text-slate-700'>Email</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange}
                        className='w-full' />
                    {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                    <Label htmlFor='role' className='text-base text-slate-700'>Role</Label>
                    <Select value={formData.role ?? ''} onValueChange={(value) => setRole(value as Role)}>
                        <SelectTrigger className="w-full" defaultValue={Role.USER}>
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={`${Role.USER}`}>{Role.USER}</SelectItem>
                            <SelectItem value={`${Role.EMPLOYEE}`}>{Role.EMPLOYEE}</SelectItem>
                            <SelectItem value={`${Role.ADMIN}`}>{Role.ADMIN}</SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.errors?.role && <p className='text-red-500 text-sm'>{state.errors.role._errors[0]}</p>}
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <Input type="hidden" name="id" value={user.id} />
                    <div className='flex justify-center'>
                        <Button className="bg-slate-700 w-fit mt-2 hover:bg-slate-800 hover:cursor-pointer">Save</Button>
                    </div>
                </form>
            </div >
        </div>
    );
}
