import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {GetUserData} from "@/lib/GetUserData";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard") && !request.cookies.has("access_token")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const userRole = GetUserData().role;

    if (userRole !== 'seller') {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*"],
};
