"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from "react-icons/hi";
import LoginForm from '../UserLogin/LoginForm';
import { Button } from "@/components/ui/button";
import { GuestDashboardItems } from "@/app/components/Navbar/NavigationItems";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLoginForm = () => {
    setIsLoginFormOpen(!isLoginFormOpen);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className='bg-slate-400 py-5'>
      <nav className='flex justify-between items-center w-[92%] mx-auto'>
        <div>
          <Link href='/'>
            <h3 className='text-3xl name font-bold px-5'>{isSmallScreen ? 'RH' : 'Radiant Halo'}</h3>
          </Link>
        </div>
        <div className='flex flex-row items-center ml-auto gap-10'>
          <div className={`bg-slate-400 flex gap-4 md:gap-10 lg:static lg:min-h-fit absolute min-h-[20vh] left-0 ${menuOpen ? 'top-18 flex-col' : 'top-[-100%] flex-row'} lg:w-auto w-full px-5`}>
            <GuestDashboardItems />
          </div>
          <div className='flex items-center gap-6 px-5'>
            <Button onClick={toggleLoginForm} className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
              Sign in
            </Button>
            {menuOpen ? (
              <HiX className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
            ) : (
              <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
            )}
          </div>
        </div>
      </nav>
      {isLoginFormOpen && <LoginForm onClose={toggleLoginForm} />}
    </header>
  )
}

export default Navbar