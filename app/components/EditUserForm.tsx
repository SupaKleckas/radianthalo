"use client";
import { useState, useActionState } from "react";
import { editUserByForm } from "@/app/actions/userActions";
import { User } from "@prisma/client";

export default function UserEditForm({ user }: { user: User }) {
    const [formData, setFormData] = useState(user);
    const [state, updateUserAction] = useActionState(editUserByForm, undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className="w-full flex flex-col items-center">
                <form action={updateUserAction} className="w-full flex flex-col items-center">
                    <input type="text" name="firstName" value={formData.firstName ?? ''} onChange={handleChange} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.firstName && <p className='text-red-500 text-sm'>{state.errors.firstName._errors[0]}</p>}
                    <input type="text" name="lastName" value={formData.lastName ?? ''} onChange={handleChange} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.lastName && <p className='text-red-500 text-sm'>{state.errors.lastName._errors[0]}</p>}
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
                    <select
                        name='role'
                        value={formData.role}
                        onChange={setRole}
                        className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    >
                        <option value='USER'>user</option>
                        <option value='EMPLOYEE'>employee</option>
                        <option value='ADMIN'>admin</option>
                    </select>
                    {state?.errors?.role && <p className='text-red-500 text-sm'>{state.errors.role._errors[0]}</p>}
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <input type="hidden" name="id" value={user.id} />
                    <button className="bg-[#325670] text-white px-5 py-2 mt-4 w-fit rounded-full hover:bg-[#1f3d53] hover:cursor-pointer">Save</button>
                </form>
            </div>
        </div >
    );
}
