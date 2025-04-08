"use client";
import { useState, useActionState } from "react";
import { addUserByForm } from "@/app/actions/user/actions";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";

export default function AddUserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [state, addUserAction] = useActionState(addUserByForm, undefined);

    return (
        <div className='flex justify-center'>
            <div className='w-[50%] flex flex-col items-center'>
                <form action={addUserAction} className="w-full">
                    <Label htmlFor='email' className='text-base text-slate-700'>Email</Label>
                    <input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='w-full p-2 mb-4 border border-slate-800 rounded focus:outline-slate-400'
                    />
                    {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                    <Label htmlFor='password' className='text-base text-slate-700'>Password</Label>
                    <input
                        type='password'
                        id="password"
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='w-full p-2 mb-4 border border-slate-800 rounded focus:outline-slate-400'
                    />
                    {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
                    <Label htmlFor='firstName' className='text-base text-slate-700'>First Name</Label>
                    <input
                        type='firstName'
                        id='firstName'
                        name='firstName'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className='w-full p-2 mb-4 border border-slate-800 rounded focus:outline-slate-400'
                    />
                    {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                    <Label htmlFor='lastName' className='text-base text-slate-700'>Last Name</Label>
                    <input
                        type='lastName'
                        id='lastName'
                        name='lastName'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className='w-full p-2 mb-4 border border-slate-800 rounded focus:outline-slate-400'
                    />
                    {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                    <Label htmlFor='role' className='text-base text-slate-700'>Role</Label>
                    <select
                        name='role'
                        id='role'
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className='w-full p-2 mb-4 border border-slate-800 rounded focus:outline-slate-400'
                    >
                        <option value='USER'>User</option>
                        <option value='EMPLOYEE'>Employee</option>
                        <option value='ADMIN'>Admin</option>
                    </select>
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
