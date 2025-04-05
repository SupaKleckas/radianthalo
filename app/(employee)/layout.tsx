"use client";
import Link from "next/link";
import { EmployeeDashboardItems } from "@/app/components/Navbar/NavigationItems";
import { HiLogout, HiMenu, HiX } from "react-icons/hi";
import { logout } from "@/app/actions/loginActions";
import { useState, useEffect } from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1024);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="min-h-screen w-full grid md:grid-cols-[26%_1fr] bg-[#FCF9DE]">
                <div className="hidden md:block bg-[#7d94b6]">
                    <div className="flex h-full max-h-screen flex-col flex-col-gap">
                        <div className="flex items-center md:h-[70px] bg-[#7d94b6] lg:px-6">
                            <Link href="/dashboard">
                                <h3 className='text-3xl name font-bold px-5'>RH</h3>
                            </Link>
                        </div>

                        <div className="flex-1 bg-[#7d94b6]">
                            <nav className="grid items-start px-2 md:text-1xl lg:px-4 lg:text-3xl">
                                <EmployeeDashboardItems />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <header className="flex items-center justify-between md:justify-end px-4 bg-[#7d94b6] h-[70px]">
                        {menuOpen ? (
                            <HiX className='text-3xl cursor-pointer md:hidden' onClick={toggleMenu} />
                        ) : (
                            <HiMenu className='text-3xl cursor-pointer md:hidden' onClick={toggleMenu} />
                        )}
                        <button onClick={() => logout()} className='bg-[#325670] text-white px-5 py-2 rounded-full hover:bg-[#1f3d53] hover:cursor-pointer'>
                            {isSmallScreen ? <HiLogout className="text-2xl" /> : "Logout"}
                        </button>
                    </header>

                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>

                </div>

                {menuOpen ? (
                    <div className="absolute top-[70px] h-[calc(100vh-70px)] w-[50%] bg-[#7d94b6]" >
                        <nav className="grid items-start px-2">
                            <EmployeeDashboardItems />
                        </nav>
                    </div>
                )
                    : ""}
            </div>
        </>
    );
}