"use client";

import { Button } from "@/components/ui/button";

interface ConfirmationWindowProps {
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmationWindow(params: ConfirmationWindowProps) {
    return (
        <div className='fixed inset-0 flex items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className='bg-white p-6 rounded-lg'>
                <h1 className='mb-4'>{params.message}</h1>
                <div className='flex justify-end'>
                    <Button onClick={params.onClose} className='bg-transparent text-black hover:cursor-pointer hover:text-slate-700 hover:bg-transparent'>Cancel</Button>
                    <Button onClick={params.onConfirm} className='bg-slate-700 hover:cursor-pointer hover:bg-slate-800'>Confirm</Button>
                </div>
            </div>
        </div>
    );
}