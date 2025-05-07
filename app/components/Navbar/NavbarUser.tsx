"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { HiMenu, HiX, HiLogout, HiUser } from "react-icons/hi";
import { logout } from "@/app/actions/user/login/actions"
import { ClientDashboardItems } from "@/app/components/Navbar/NavigationItems";
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation';

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
        <header className='flex bg-slate-400 py-5'>
            <nav className='w-[92%] mx-auto flex flex-row'>
                <div className='flex items-center justify-start'>
                    <Link href='/'>
                        <h3 className='text-3xl name font-bold px-5'>{isSmallScreen ? 'RH' : 'Radiant Halo'}</h3>
                    </Link>
                </div>
                <div className='flex flex-row items-center ml-auto gap-10'>
                    <div className={`bg-slate-400 z-50 flex gap-4 md:gap-10 lg:static lg:min-h-fit absolute min-h-[20vh] left-0 ${menuOpen ? 'top-18 flex-col' : 'top-[-100%] flex-row'} lg:w-auto w-full px-5`}>
                        <ClientDashboardItems />
                    </div>
                    <div className=''>
                        {menuOpen ? (
                            <HiX className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                        ) : (
                            <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={toggleMenu} />
                        )}
                    </div>
                    <div className="flex flex-row gap-x-4">
                        <Button onClick={() => redirect("/home/account")} variant={"ghost"} className="hover:cursor-pointer h-auto w-auto">
                            <HiUser className="text-slate-800" />
                        </Button>
                        <Button onClick={() => logout()} className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                            {isSmallScreen ? <HiLogout className="text-2xl" /> : "Logout"}
                        </Button>
                    </div>

                </div>
            </nav>
        </header>
    )
}

export default Navbar