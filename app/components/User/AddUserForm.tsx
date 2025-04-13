"use client";
import { useState, useActionState } from "react";
import { addUserByForm } from "@/app/actions/user/actions";
import { Role } from "@prisma/client";
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

export default function AddUserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<Role>(Role.USER);
    const [state, addUserAction] = useActionState(addUserByForm, undefined);

    return (
        <div className='flex justify-center'>
            <div className='w-[50%] flex items-center'>
                <form action={addUserAction} className="flex flex-col w-full gap-y-2">
                    <Label htmlFor='email' className='text-base text-slate-700'>Email</Label>
                    <Input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='w-full'
                    />
                    {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                    <Label htmlFor='password' className='text-base text-slate-700'>Password</Label>
                    <Input
                        type='password'
                        id="password"
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='w-full'
                    />
                    {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
                    <Label htmlFor='firstName' className='text-base text-slate-700'>First Name</Label>
                    <Input
                        type='firstName'
                        id='firstName'
                        name='firstName'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className='w-full'
                    />
                    {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                    <Label htmlFor='lastName' className='text-base text-slate-700'>Last Name</Label>
                    <Input
                        type='lastName'
                        id='lastName'
                        name='lastName'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className='w-full'
                    />
                    {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                    <Label htmlFor='role' className='text-base text-slate-700'>Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as Role)}>
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
                    <div className='flex justify-center'>
                        <Button type='submit' className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                            Add user
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
