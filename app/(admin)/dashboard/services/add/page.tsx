"use client";
import React, { useState, useActionState } from 'react';
import { HiOutlineChevronLeft } from "react-icons/hi";
import { addServiceByForm } from "@/app/actions/serviceActions"
import Link from "next/link";

function AddServiceForm() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [duration, setDuration] = useState<number | ''>('');
    const [state, addServiceAction] = useActionState(addServiceByForm, undefined);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrice(value === '' ? '' : Number(value));
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDuration(value === '' ? '' : Number(value));
    };

    return (
        <div className='flex flex-col items-center justify-center py-[5%]'>
            <div className='w-[50%] flex flex-col items-center justify-center'>
                <div className='flex w-full justify-start mb-[8%]'>
                    <Link href="/dashboard/services">
                        <HiOutlineChevronLeft className='text-4xl cursor-pointer' />
                    </Link>
                </div>
                <h1 className='text-3xl font-bold mb-4 text-center'>Enter new service details</h1>
                <form action={addServiceAction} className='w-full' >
                    <input
                        type='text'
                        name='title'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.title && <p className='text-red-500 text-sm'>{state.errors.title._errors[0]}</p>}
                    <input
                        type='number'
                        name='price'
                        placeholder='Price'
                        value={price}
                        onChange={handlePriceChange}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.price && <p className='text-red-500 text-sm'>{state.errors.price._errors[0]}</p>}
                    <input
                        type='number'
                        name='duration'
                        placeholder='Duration'
                        value={duration}
                        onChange={handleDurationChange}
                        className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
                    />
                    {state?.errors?.duration && <p className='text-red-500 text-sm'>{state.errors.duration._errors[0]}</p>}
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <div className='flex justify-center'>
                        <button type='submit' className='bg-[#325670] w-40 text-white px-5 py-2 mt-4 rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
                            Add service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddServiceForm;