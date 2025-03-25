"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { HiMenu, HiX, HiLogout } from "react-icons/hi";
import { logout } from "@/app/actions/loginActions"
import { ClientDashboardItems } from "@/app/components/NavigationItems";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1280);
            if (window.innerWidth >= 1280) {
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
            <nav className='w-[92%] mx-auto flex flex-row'>
                <div className='flex items-center justify-start'>
                    <Link href='/'>
                        <h3 className='text-3xl name font-bold px-5'>{isSmallScreen ? 'RH' : 'Radiant Halo'}</h3>
                    </Link>
                </div>
                <div className='flex flex-row items-center ml-auto gap-10'>
                    <div className={`bg-[#94B6CE] flex gap-4 md:gap-10 lg:static lg:min-h-fit absolute min-h-[20vh] left-0 ${menuOpen ? 'top-20 flex-col' : 'top-[-100%] flex-row'} lg:w-auto w-full px-5`}>
                        <ClientDashboardItems />
                    </div>
                    <div className=''>
                        {menuOpen ? (
                            <HiX className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                        ) : (
                            <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                        )}
                    </div>
                    <button onClick={() => logout()} className='bg-[#325670] text-white px-5 py-2 rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
                        {isSmallScreen ? <HiLogout className="text-2xl" /> : "Logout"}
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar