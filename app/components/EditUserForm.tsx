"use client";
import { HiPencil, HiCheck } from "react-icons/hi";
import { useState, useActionState } from "react";
import { editUserByForm } from "@/app/actions/userActions";
import { User } from "@prisma/client";

export default function UserEditForm({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
    const [state, updateUserAction] = useActionState(editUserByForm, undefined);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setFormData(user);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        const form = document.querySelector("form");
        form?.requestSubmit();
        setIsEditing(false);
    };

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className='w-[50%] flex justify-end'>
                <button onClick={isEditing ? handleSave : handleEditToggle}>
                    {isEditing ? <HiCheck className='text-3xl hover:cursor-pointer hover:text-[#7d94b6]' /> : <HiPencil className='text-3xl hover:cursor-pointer hover:text-[#7d94b6]' />}
                </button>
            </div>

            <div className="w-full flex flex-col items-center">
                {isEditing ? (
                    <>
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
                            <button type="submit" className="hidden"></button>
                        </form>
                    </>
                ) : (
                    <>
                        <p className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded '>{user.firstName}</p>
                        <p className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded'>{user.lastName}</p>
                        <p className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded'>{user.email}</p>
                        <p className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded'>{user.role.toLowerCase()}</p>
                    </>
                )}
            </div>
        </div >
    );
}
