import React, { useState, useActionState } from 'react';
import { HiX } from "react-icons/hi";
import SignupForm from './SignupForm';
import { login } from "@/app/authActions/loginActions";

interface LoginFormProps {
  onClose: () => void;
}

function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [state, loginAction] = useActionState(login, undefined);

  const toggleSignupForm = () => {
    setIsSignupFormOpen(!isSignupFormOpen);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
      <div className='bg-[#94B6CE] p-8 rounded-lg relative lg:w-1/4 max-w-[400px] w-full'>
        <HiX className='absolute top-5 right-5 text-3xl cursor-pointer' onClick={onClose} />
        <h1 className='text-3xl font-bold mb-4 text-center'>Login</h1>
        <form action={loginAction}>
          <input
            type='text'
            name='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
          />
          {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email._errors}</p>}
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full p-2 mt-4 mb-4 border border-[#325670] rounded focus:outline-none'
          />
          {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password._errors}</p>}
          {state?.password?._errors && <p className='text-red-500 text-sm'>{state.password._errors}</p>}
          <button type='submit' className='bg-[#325670] text-white px-5 py-2 mt-4 w-full rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
            Login
          </button>
        </form>
        <p className='mt-4'>
          Don't have an account?{' '}
          <button onClick={toggleSignupForm} className='mt-2 text-[#325670] hover:underline hover:cursor-pointer'>Sign up</button>
        </p>
      </div>
      {isSignupFormOpen && <SignupForm onClose={toggleSignupForm} />}
    </div>
  );
}

export default LoginForm;