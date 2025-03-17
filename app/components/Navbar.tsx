"use client";
import Link from 'next/link'
import React,  {useState, useEffect} from 'react';
import {HiMenu, HiX} from "react-icons/hi";
import LoginForm from './LoginForm';

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
    <header className='bg-[#94B6CE] py-5'>
      <nav className='flex justify-between items-center w-[92%] mx-auto'>
        <div>
          <Link href='/'>
          <h3 className='text-3xl name font-bold px-5'>{isSmallScreen ? 'RH' : 'Radiant Halo'}</h3>
          </Link>
        </div>
        <div className={`bg-[#94B6CE] lg:static lg:min-h-fit absolute min-h-[20vh] left-0 ${menuOpen ? 'top-15 flex-col' : 'top-[-100%] flex-row'} lg:w-auto w-full px-5`}>
          <ul className={`flex ${menuOpen ? 'flex-col py-5' : 'lg:flex-row'} lg:gap-[4vw] gap-8 px-10`}>
            <li>
              <Link className='hover:text-[#1f3d53]' href='/services'>
                Services
              </Link>
            </li>
            <li>
              <Link className='hover:text-[#1f3d53]' href='/locations'>
                Locations
              </Link>
            </li>
            <li>
              <Link className='hover:text-[#1f3d53]' href='/faq'>
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className='flex items-center gap-6 px-5'>
          <button onClick={toggleLoginForm} className='bg-[#325670] text-white px-5 py-2 rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
            Sign in
          </button>
          {menuOpen ? (
            <HiX className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
          ) : (
            <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
          )}
        </div>
      </nav>
      {isLoginFormOpen && <LoginForm onClose={toggleLoginForm} />}
    </header>
  )
}

export default Navbar