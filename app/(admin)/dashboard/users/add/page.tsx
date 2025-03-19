"use client";

import React, { useState, useActionState } from 'react';
import { HiOutlineChevronLeft } from "react-icons/hi";
import { addUserByForm } from "@/app/actions/userActions"
import Link from "next/link";

function AddUserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [state, addUserAction] = useActionState(addUserByForm, undefined);

    return (
        <div className='flex mt-[5%] items-center justify-center'>
            <div className='relative p-8 max-w-[500px] w-full'>
                <Link href="/dashboard/users">
                    <HiOutlineChevronLeft className='absolute top-0 left-5 text-3xl cursor-pointer' />
                </Link>
                <h1 className='text-3xl font-bold mb-4 text-center'>Enter new user details</h1>
                <form action={addUserAction} >
                    <input
                        type='text'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
                    <input
                        type='firstName'
                        name='firstName'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                    <input
                        type='lastName'
                        name='lastName'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                    <select
                        name='role'
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    >
                        <option value='USER'>User</option>
                        <option value='EMPLOYEE'>Employee</option>
                        <option value='ADMIN'>Admin</option>
                    </select>
                    {state?.errors?.role && <p className='text-red-500 text-sm'>{state.errors.role._errors[0]}</p>}
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <button type='submit' className='bg-[#325670] text-white px-5 py-2 mt-4 w-full rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
                        Add user
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddUserForm;