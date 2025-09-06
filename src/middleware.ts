import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const redirectToLogin = () => {
    const url = new URL("/", request.url);
    const response = NextResponse.redirect(url);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  };

  const refreshAccessToken = async () => {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return redirectToLogin();
    }

    const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API;
    const response = await fetch(`${BASE_API_URL}/user/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || !data.body) {
      console.error("Gagal me-refresh token:", data);
      return redirectToLogin();
    }

    const newAccessToken = data.body;
    const res = NextResponse.next();
    res.cookies.set({
      name: "access_token",
      value: newAccessToken,
      path: "/",
    });
    return res;
  };

  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = payload.exp;

      return expiryTime - currentTime <= 3600;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
  };

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      return refreshAccessToken();
    }
  } else {
    if (refreshToken && !accessToken) {
      return refreshAccessToken();
    }

    if (refreshToken && accessToken && isTokenExpiringSoon(accessToken)) {
      return refreshAccessToken();
    }
  }

  return NextResponse.next();
}
