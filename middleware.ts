import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/auth/session"
import { cookies } from "next/dist/server/request/cookies";

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId && (path.startsWith("/home") || path.startsWith("/dashboard") || path.startsWith("/staff-dashboard"))) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (session?.userId && path === "/") {
        if (session.role === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else if (session.role === "EMPLOYEE") {
            return NextResponse.redirect(new URL("/staff-dashboard", req.nextUrl));
        } else if (session.role === "USER") {
            return NextResponse.redirect(new URL("/home", req.nextUrl));
        }
    }

    return NextResponse.next();
};