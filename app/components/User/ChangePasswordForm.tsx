"use client";
import React, { useActionState, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EditPasswordState } from '@/app/lib/states/states';
import { editPasswordAction } from "@/app/actions/user/actions";

interface ChangePasswordProps {
    onClose: () => void;
}

export default function ChangePasswordForm({ onClose }: ChangePasswordProps) {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [state, addPassword] = useActionState<EditPasswordState, FormData>(editPasswordAction, {});

    return (
        <div className='fixed inset-0 flex items-center justify-center z-[100]' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className='bg-white p-8 rounded-lg relative max-w-[360px] w-full'>
                <h1 className='text-3xl font-bold mb-6 text-start text-slate-800'>Change Password</h1>
                <form action={addPassword} className="flex flex-col gap-y-4">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input name="newPassword" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                    {state._errors?.newPassword && <p className='text-red-500 text-sm'>{state._errors.newPassword[0]}</p>}
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input name="confirmPassword" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    {state._errors?.confirmPassword && <p className='text-red-500 text-sm'>{state._errors.confirmPassword[0]}</p>}
                    <div className="flex flex-row gap-x-4 justify-end">
                        <Button variant={'ghost'} onClick={onClose} className='hover:cursor-pointer'>
                            Cancel
                        </Button>
                        <Button type='submit' className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                            Confirm
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}