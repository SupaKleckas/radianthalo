"use client";
import { IconType } from "react-icons";
import { HiOutlineUser, HiOutlineTruck, HiOutlineCalendar, HiOutlineHome, HiOutlineClipboardList, HiOutlinePencilAlt } from "react-icons/hi";
import Link from "next/link"
import React from "react";
import { usePathname } from "next/navigation";

interface navItem {
    id: number,
    title: string,
    href: string,
    icon?: IconType
}

export const adminItems: navItem[] = [
    {
        id: 0,
        title: "Dashboard",
        href: "/dashboard",
        icon: HiOutlineHome
    },
    {
        id: 1,
        title: "Appointments",
        href: "/dashboard/appointments",
        icon: HiOutlineCalendar
    },
    {
        id: 2,
        title: "Services",
        href: "/dashboard/services",
        icon: HiOutlineTruck
    },
    {
        id: 3,
        title: "Users",
        href: "/dashboard/users",
        icon: HiOutlineUser
    },
    {
        id: 4,
        title: "Reviews",
        href: "/dashboard/reviews",
        icon: HiOutlinePencilAlt
    },
]

export const employeeItems: navItem[] = [
    {
        id: 0,
        title: "Dashboard",
        href: "/staff-dashboard/",
        icon: HiOutlineHome
    },
    {
        id: 1,
        title: "Schedule",
        href: "/staff-dashboard/schedule",
        icon: HiOutlineCalendar
    },
    {
        id: 2,
        title: "Availability",
        href: "/staff-dashboard/availability",
        icon: HiOutlineClipboardList
    },
    {
        id: 3,
        title: "Reviews",
        href: "/staff-dashboard/reviews",
        icon: HiOutlinePencilAlt
    },
]

export const clientItems: navItem[] = [
    {
        id: 0,
        title: "Home",
        href: "/home",
        icon: HiOutlineHome
    },
    {
        id: 1,
        title: "My Appointments",
        href: "/home/appointments",
        icon: HiOutlineCalendar
    },
    {
        id: 2,
        title: "All services",
        href: "/home/services",
        icon: HiOutlineTruck
    },
    {
        id: 3,
        title: "Reviews",
        href: "/home/reviews",
        icon: HiOutlinePencilAlt
    },
]

export const guestItems: navItem[] = [
    {
        id: 0,
        title: "FAQ",
        href: "/faq"
    },
    {
        id: 1,
        title: "Services",
        href: "/services"
    },
    {
        id: 2,
        title: "Reviews",
        href: "/reviews"
    },
]

export function AdminDashboardItems() {
    const path = usePathname();
    return (
        <>
            {adminItems.map((item) => (
                <Link key={item.id} href={item.href} className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white
                    ${path === item.href ?
                        "text-white" :
                        "text-black"}`}>
                    {item.icon && React.createElement(item.icon)} {item.title}
                </Link>
            ))}
        </>
    )
}

export function EmployeeDashboardItems() {
    const path = usePathname();
    return (
        <>
            {employeeItems.map((item) => (
                <Link key={item.id} href={item.href} className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white
                    ${path === item.href ?
                        "text-white" :
                        "text-black"}`}>
                    {item.icon && React.createElement(item.icon)} {item.title}
                </Link>
            ))}
        </>
    )
}

export function ClientDashboardItems() {
    const path = usePathname();
    return (
        <>
            {clientItems.map((item) => (
                <Link key={item.id} href={item.href} className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white
                    ${path === item.href ?
                        "text-white" :
                        "text-black"}`}>
                    {item.icon && React.createElement(item.icon)} {item.title}
                </Link>
            ))}
        </>
    )
}

export function GuestDashboardItems() {
    const path = usePathname();
    return (
        <>
            {guestItems.map((item) => (
                <Link key={item.id} href={item.href} className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white
                    ${path === item.href ?
                        "text-white" :
                        "text-black"}`}>
                    {item.icon && React.createElement(item.icon)} {item.title}
                </Link>
            ))}
        </>
    )
}