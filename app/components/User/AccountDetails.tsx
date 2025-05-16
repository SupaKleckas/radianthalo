"use client";
import { User } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useActionState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { EditAccountState } from "@/app/lib/states/states";
import { editAccountAction } from "@/app/actions/user/actions";

interface Props {
    user: User;
}

export default function AccountDetails({ user }: Props) {
    const [isPasswordChangeOpen, setPasswordChangeOpen] = useState(false);
    const [state, editAccount] = useActionState<EditAccountState, FormData>(editAccountAction, {});

    const toggleChangePasswordForm = () => {
        setPasswordChangeOpen(!isPasswordChangeOpen);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col text-slate-800 gap-y-2">
                <h1 className="text-5xl">Account Details</h1>
                <h1 className="text-slate-500">Manage your account details below.</h1>
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="text-3xl">My Profile</h2>
                <form action={editAccount} className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                defaultValue={user.firstName}
                                required
                            />
                            {state._errors?.firstName && <p className='text-red-500 text-sm'>{state._errors.firstName[0]}</p>}
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                defaultValue={user.lastName}
                                required
                            />
                            {state._errors?.lastName && <p className='text-red-500 text-sm'>{state._errors.lastName[0]}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            required
                        />
                        {state._errors?.email && <p className='text-red-500 text-sm'>{state._errors.email[0]}</p>}
                    </div>

                    <div className="flex gap-4 mt-2 justify-end">
                        <Button type="submit" className="bg-slate-700 hover:bg-slate-800 hover:cursor-pointer">
                            Save Changes
                        </Button>
                        <Button
                            variant="link"
                            type="button"
                            onClick={toggleChangePasswordForm}
                            className="hover:cursor-pointer"
                        >
                            Change Password
                        </Button>
                    </div>
                </form>

                {isPasswordChangeOpen && (
                    <div className="mt-4">
                        <ChangePasswordForm onClose={toggleChangePasswordForm} />
                    </div>
                )}
            </div>
        </div>
    )
}