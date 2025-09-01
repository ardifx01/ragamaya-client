// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

// Middleware utama
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const redirectToLogin = () => {
        const url = new URL("/", request.url);
        const response = NextResponse.redirect(url);
        // Fungsi ini sekarang menjadi pusat untuk menghapus cookie
        console.log("Menghapus access_token dan refresh_token cookies.");
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
    };

    if (pathname.startsWith("/dashboard")) {
        const accessToken = request.cookies.get("access_token")?.value;

        if (!accessToken) {
            return redirectToLogin();
        }

        try {
            const decodedToken = decodeJwt(accessToken);

            if (!decodedToken || !decodedToken.exp) {
                console.error("Token tidak valid atau tidak memiliki 'exp'.");
                return redirectToLogin();
            }

            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();

            // KONDISI 1: Jika token SUDAH KEDALUWARSA
            if (currentTime >= expirationTime) {
                console.log("Access token sudah kedaluwarsa. Redirecting to login.");
                return redirectToLogin(); // Langsung hapus cookies dan redirect
            }

            // KONDISI 2: Jika token AKAN KEDALUWARSA dalam 1 jam
            const timeUntilExpiration = expirationTime - currentTime;
            if (timeUntilExpiration < 3600000) {
                console.log("Token akan kedaluwarsa, mencoba refresh...");
                const refreshToken = request.cookies.get("refresh_token")?.value;

                if (!refreshToken) {
                    console.log("Refresh token tidak ditemukan.");
                    return redirectToLogin();
                }

                const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API;
                const response = await fetch(`${BASE_API_URL}/user/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                const data = await response.json();

                if (!response.ok || !data.body) {
                    console.error("Gagal me-refresh token:", data);
                    return redirectToLogin(); // Hapus cookies jika refresh gagal
                }

                console.log("Token berhasil di-refresh.");
                const newAccessToken = data.body;

                const res = NextResponse.next();
                res.cookies.set({
                    name: "access_token",
                    value: newAccessToken,
                    httpOnly: true,
                    path: "/",
                });
                return res;
            }

            // KONDISI 3: Jika token masih valid lebih dari 1 jam
            return NextResponse.next();

        } catch (error: any) {
            console.error("Gagal memproses token:", error);
            return redirectToLogin();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};