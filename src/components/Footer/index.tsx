"use client"

import { Image, Link } from "@heroui/react";
import {usePathname} from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <div className={`max-w-7xl mx-auto mt-20 md:mt-42 ${isDashboard ? 'hidden' : ''}`}>
            <div className="pt-40 px-4 md:py-10 py-8">
                <div className="md:flex md:justify-between">
                    <div id="footer">
                        <div className="flex items-center mb-4 gap-2">
                            <Image alt="Logo" src="/assets/logo.png" width={40} />
                            <h2 className="text-xl font-bold text-white">RagaMaya</h2>
                        </div>
                        <p className="text-white text-xl font-semibold leading-relaxed">
                            Temukan Makna, Hidupkan Budaya, Bersama RagaMaya.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-3 mt-8 xl:mt-2 text-white">
                        <div className="flex flex-col gap-4">
                            <h1>Repositori</h1>
                            <Link
                                href="https://github.com/"
                                className="hover:underline text-gray-400 text-sm"
                            >
                                Github
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1>Developers</h1>
                            <Link
                                href="https://github.com/"
                                className="hover:underline text-gray-400 text-sm"
                            >
                                Tim Kami
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1>LEGAL</h1>
                            <Link href="#" className="hover:underline text-gray-400 text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:underline text-gray-400 text-sm">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-500 my-8"></div>
                <div className="text-center">
                    <p className="text-white text-sm">
                        ©2025 RagaMaya. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer;
