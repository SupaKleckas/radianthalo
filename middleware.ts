import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/auth/session"
import { cookies } from "next/dist/server/request/cookies";

const userRoutes = ["/home"];
const adminRoutes = ["/dashboard"];
const employeeRoutes = ["/staff-dashboard"];
const publicRoutes = ["/", "/faq", "/locations", "/services"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isUserRoute = userRoutes.includes(path);
    const isAdminRoute = adminRoutes.includes(path);
    const isEmployeeRoute = employeeRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if ((isUserRoute || isAdminRoute || isEmployeeRoute) && !session?.userId) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if ((isPublicRoute || isAdminRoute || isEmployeeRoute) && (session?.userId && session?.role === 'USER')) {
        return NextResponse.redirect(new URL("/home", req.nextUrl));
    }

    if ((isPublicRoute || isAdminRoute || isUserRoute) && (session?.userId && session?.role === 'EMPLOYEE')) {
        return NextResponse.redirect(new URL("/staff-dashboard", req.nextUrl));
    }

    if ((isPublicRoute || isUserRoute || isEmployeeRoute) && (session?.userId && session?.role === 'ADMIN')) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
};