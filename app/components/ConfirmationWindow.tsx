"use client";

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
                    <button onClick={params.onClose} className='mr-4 px-4 py-2 bg-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-400'>Cancel</button>
                    <button onClick={params.onConfirm} className='px-4 py-2 bg-[#325670] text-white rounded-full hover:cursor-pointer hover:bg-[#1f3d53]'>Confirm</button>
                </div>
            </div>
        </div>
    );
}