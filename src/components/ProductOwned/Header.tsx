'use client'

import { Search, Store, Funnel, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { PaymentStatusType } from "@/types/payment_history_type";

const Header = () => {
    return (
        <div>
            <div className="relative z-10 px-4 pt-24 lg:pt-28">
                <div className="max-w-7xl w-full mx-auto">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 pt-8 lg:pt-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white space-y-3 text-center lg:text-left max-w-2xl"
                        >
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    {"Produk Dimiliki"
                                        .split(" ")
                                        .map((word, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, filter: "blur(8px)", y: 40 }}
                                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: index * 0.2 + 0.3,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="mr-3 inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                            >
                                                {word}
                                            </motion.span>
                                        ))}

                                </h1>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                                className="text-gray-300 text-md md:text-lg leading-relaxed"
                            >
                                {`Kamu dapat melihat produk yang kamu miliki disini.`}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`marketplace`}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={`/marketplace`}
                                        className="block"
                                    >
                                        <HoverBorderGradient
                                            containerClassName="rounded-xl"
                                            as="button"
                                            className="bg-black text-white flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                                        >
                                            <Store size={20} />
                                            <span>{`Marketplace`}</span>
                                        </HoverBorderGradient>
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;