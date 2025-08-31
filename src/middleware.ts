// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Fungsi untuk mendapatkan secret key dari environment variables
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT_SECRET_KEY is not set in environment variables");
    }
    return new TextEncoder().encode(secret);
};

// Middleware utama
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Hanya jalankan logika ini untuk path yang dimulai dengan /dashboard
    if (pathname.startsWith("/dashboard")) {
        // 1. Cek apakah cookie access_token ada
        const token = request.cookies.get("access_token")?.value;

        if (!token) {
            // Jika tidak ada token, redirect ke halaman utama/login
            const url = new URL("/", request.url);
            return NextResponse.redirect(url);
        }
    }

    // Jika semua kondisi terpenuhi atau path bukan /dashboard, lanjutkan request
    return NextResponse.next();
}

// Konfigurasi matcher
export const config = {
    // Jalankan middleware HANYA pada path yang diinginkan
    matcher: ["/dashboard/:path*"],
};