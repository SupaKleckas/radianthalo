"use client";
import { useState, useActionState } from "react";
import { addUserByForm } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button"

export default function AddUserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [state, addUserAction] = useActionState(addUserByForm, undefined);

    return (
        <div className='flex flex-col items-center justify-center'>
            <form action={addUserAction} className="w-full flex flex-col items-center">
                <input
                    type='text'
                    name='email'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                />
                {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='w-[50%]  p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                />
                {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
                <input
                    type='firstName'
                    name='firstName'
                    placeholder='First Name'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className='w-[50%]  p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                />
                {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                <input
                    type='lastName'
                    name='lastName'
                    placeholder='Last Name'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className='w-[50%]  p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                />
                {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                <select
                    name='role'
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                >
                    <option value='USER'>User</option>
                    <option value='EMPLOYEE'>Employee</option>
                    <option value='ADMIN'>Admin</option>
                </select>
                {state?.errors?.role && <p className='text-red-500 text-sm'>{state.errors.role._errors[0]}</p>}
                {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                <Button type='submit' className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                    Add user
                </Button>
            </form>
        </div>
    );
}
