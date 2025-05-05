import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/auth/session"
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session || !session.userId || !session.role) {
        if (path.startsWith("/home") || path.startsWith("/dashboard") || path.startsWith("/staff-dashboard")) {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }
    }

    if (session?.userId) {
        if (path.startsWith("/dashboard") && session.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }

        if (path.startsWith("/staff-dashboard") && session.role !== "EMPLOYEE") {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }

        if (path.startsWith("/home") && session.role !== "USER") {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }

        if (path === "/" || path === "/faq" || path === "/services" || path === "/reviews") {
            switch (session.role) {
                case "ADMIN":
                    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
                case "EMPLOYEE":
                    return NextResponse.redirect(new URL("/staff-dashboard", req.nextUrl));
                case "USER":
                    return NextResponse.redirect(new URL("/home", req.nextUrl));
            }
        }
    }
    return NextResponse.next();
};