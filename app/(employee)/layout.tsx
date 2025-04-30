"use client";
import Link from "next/link";
import { EmployeeDashboardItems } from "@/app/components/Navbar/NavigationItems";
import { HiLogout, HiMenu, HiX } from "react-icons/hi";
import { logout } from "@/app/actions/user/login/actions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        <>
            <div className="min-h-screen w-full grid md:grid-cols-[26%_1fr]">
                <div className="hidden md:block bg-slate-400">
                    <div className="flex h-full max-h-screen flex-col flex-col-gap">
                        <div className="flex items-center md:h-[70px] bg-slate-400 lg:px-6">
                            <Link href="/dashboard">
                                <h3 className='text-3xl name font-bold px-5'>RH</h3>
                            </Link>
                        </div>

                        <div className="flex-1 bg-slate-400">
                            <nav className="grid items-start px-2 md:text-1xl lg:px-4 lg:text-3xl">
                                <EmployeeDashboardItems />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <header className="flex items-center justify-between md:justify-end px-4 bg-slate-400 h-[70px]">
                        {menuOpen ? (
                            <HiX className='text-3xl cursor-pointer md:hidden' onClick={toggleMenu} />
                        ) : (
                            <HiMenu className='text-3xl cursor-pointer md:hidden' onClick={toggleMenu} />
                        )}
                        <Button onClick={() => logout()} className='bg-slate-700 hover:bg-slate-800 hover:cursor-pointer'>
                            {isSmallScreen ? <HiLogout className="text-2xl" /> : "Logout"}
                        </Button>
                    </header>

                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>

                </div>

                {menuOpen ? (
                    <div className="absolute top-[70px] h-[calc(100vh-70px)] w-[50%] bg-slate-400" >
                        <nav className="grid items-start px-2 text-2xl">
                            <EmployeeDashboardItems />
                        </nav>
                    </div>
                )
                    : ""}
            </div>
        </>
    );
}