"use client";
import React, { useState, useActionState } from 'react';
import { HiX } from "react-icons/hi";
import { signup } from "@/app/actions/user/signup/actions";
import { SubmitButton } from '../UI/Buttons';

interface SignupFormProps {
  onClose: () => void;
}

function SignupForm({ onClose }: SignupFormProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, signupAction] = useActionState(signup, undefined);

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-slate-400 p-8 rounded-lg relative lg:w-1/3 max-w-[400px] w-full'>
        <HiX className='absolute top-5 right-5 text-3xl cursor-pointer text-slate-800' onClick={onClose} />
        <h1 className='text-3xl font-bold mb-4 text-center text-slate-800'>Sign Up</h1>
        <form action={signupAction}>
          <input
            placeholder='Email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors[0]}</p>}
          {state?.email?._errors && <p className='text-red-500 text-sm'>{state.email._errors}</p>}
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          <input
            type='firstName'
            name='firstName'
            placeholder='First Name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          <input
            type='lastName'
            name='lastName'
            placeholder='Last Name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors[0]}</p>}
          <SubmitButton text="Sign up" className="w-full bg-slate-700 mt-4" />
        </form>
      </div>
    </div>
  );
}
export default SignupForm;