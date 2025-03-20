"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from "react-icons/hi";
import { logout } from "@/app/actions/loginActions"

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
                    {/* nav items */}
                </div>
                <div className='flex items-center gap-6 px-5'>
                    {menuOpen ? (
                        <HiX className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                    ) : (
                        <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                    )}
                </div>
                <button onClick={() => logout()} className='bg-[#325670] text-white px-5 py-2 rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
                    Logout
                </button>
            </nav>
        </header>
    )
}

export default Navbar