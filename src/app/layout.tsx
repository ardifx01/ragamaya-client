import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/main_provider";
import MainNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Tambahkan ini
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Tambahkan ini
  preload: true,
});

export const metadata: Metadata = {
  title: "RagaMaya",
  description: " Melestarikan Batik Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark bg-gradient-to-br from-gray-900 via-black to-gray-800`}
      >
        <Providers>
          <MainNavbar />
          <div className="min-h-screen">
            {children}-
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
