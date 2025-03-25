"use client";
import { useActionState } from "react";
import { editServiceByForm } from "@/app/actions/serviceActions";
import { Service } from "@prisma/client";

export default function UserEditForm({ service }: { service: Service }) {
    const [state, updateServiceAction] = useActionState(editServiceByForm, undefined);

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className="w-full flex flex-col items-center">
                <form action={updateServiceAction} className="w-full flex flex-col items-center">
                    <input type="text" name="title" defaultValue={service.title} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.title && <p className='text-red-500 text-sm'>{state.errors.title._errors[0]}</p>}
                    <input type="number" name="price" defaultValue={service.price} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.price && <p className='text-red-500 text-sm'>{state.errors.price._errors[0]}</p>}
                    <input type="number" name="duration" defaultValue={service.duration} className='w-[50%] p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none' />
                    {state?.errors?.duration && <p className='text-red-500 text-sm'>{state.errors.duration._errors[0]}</p>}
                    {state?._errors && <p className='text-red-500 text-sm'>{state._errors}</p>}
                    <input type="hidden" name="id" value={service.id} />
                    <button className="bg-[#325670] text-white px-5 py-2 mt-4 w-fit rounded-full hover:bg-[#1f3d53] hover:cursor-pointer">Save</button>
                </form>
            </div>
        </div >
    );
}
