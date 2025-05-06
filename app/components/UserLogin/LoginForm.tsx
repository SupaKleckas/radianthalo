import React, { useState, useActionState } from 'react';
import { HiX } from "react-icons/hi";
import SignupForm from '@/app/components/UserLogin/SignupForm';
import { login } from "@/app/actions/user/login/actions";
import { Button } from "@/components/ui/button";
import { LoginFormState } from '@/app/lib/states/states';

interface LoginFormProps {
  onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [state, loginAction] = useActionState<LoginFormState, FormData>(login, {});

  const toggleSignupForm = () => {
    setIsSignupFormOpen(!isSignupFormOpen);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-[100]' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
      <div className='bg-slate-400 p-8 rounded-lg relative lg:w-1/4 max-w-[400px] w-full'>
        <HiX className='absolute top-5 right-5 text-3xl cursor-pointer text-slate-800' onClick={onClose} />
        <h1 className='text-3xl font-bold mb-4 text-center text-slate-800'>Login</h1>
        <form action={loginAction}>
          <input
            type='text'
            name='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          {state?._errors?.email && <p className='text-red-500 text-sm'>{state._errors.email[0]}</p>}
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-slate-700 rounded focus:outline-none'
          />
          {state?._errors?.password && <p className='text-red-500 text-sm'>{state._errors.password[0]}</p>}
          <Button type='submit' className='bg-slate-700 px-5 py-2 mt-4 w-full hover:bg-slate-800 hover:cursor-pointer'>
            Login
          </Button>
        </form>
        <span className='flex flex-row items-center mt-4 text-slate-800'>
          <p>Create account</p>
          <Button onClick={toggleSignupForm} variant='link' className='text-slate-800 text-base hover:underline hover:cursor-pointer'>Sign up</Button>
        </span>
      </div>
      {isSignupFormOpen && <SignupForm onClose={toggleSignupForm} />}
    </div>
  );
}