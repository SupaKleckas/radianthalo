"use client";
import React, { useState, useActionState } from 'react';
import { HiX } from "react-icons/hi";
import { signup } from "@/app/authActions/signupActions";
import { useFormStatus } from "react-dom";

interface SignupFormProps {
  onClose: () => void;
}

function SignupForm({ onClose }: SignupFormProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [state, signupAction] = useActionState(signup, undefined);

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-[#94B6CE] p-8 rounded-lg relative lg:w-1/3 max-w-[400px] w-full'>
        <HiX className='absolute top-5 right-5 text-3xl cursor-pointer' onClick={onClose} />
        <h1 className='text-3xl font-bold mb-4 text-center'>Sign Up</h1>
        <form action={signupAction}>
          <input
            placeholder='Email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
          />
          {state?.errors.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
          />
          {state?.errors.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
export default SignupForm;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className='bg-[#325670] text-white px-5 py-2 mt-4 w-full rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'
      disabled={pending}
    >
      Sign Up
    </button>
  );
}