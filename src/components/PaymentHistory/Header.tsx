'use client'

import { Search, Store, Funnel, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { PaymentStatusType } from "@/types/payment_history_type";

interface HeaderProps {
    Status: PaymentStatusType;
    onStatusChange: (value: PaymentStatusType) => void;
    loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    Status,
    onStatusChange,
    loading = false
}) => {
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const statusOptions = Object.entries(PaymentStatusType).map(([key, value]) => ({
        label: key,
        value: value
    }));

    const selectedOption = statusOptions.find(option => option.value === Status);

    const handleOptionSelect = (value: PaymentStatusType) => {
        onStatusChange(value);
        setIsDropdownOpen(false);
        setIsSearchFocused(false);
    };

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
                                    {"Riwayat Pembayaran"
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
                                {`Kamu dapat melihat riwayat pembayaran kamu disini.`}
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

                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="mt-16"
                    >
                        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                                className="flex items-center gap-4 mb-8"
                            >
                                <motion.div
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"
                                >
                                    <Funnel size={20} aria-hidden="true" className="text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Pencarian Riwayat Pembayaran</h2>
                                    <p className="text-gray-400">Pilih status pembayaran dan batik untuk melihat riwayat pembayaran</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                                className="relative mb-6"
                            >
                                <div className={`relative transition-all duration-300 ${(isSearchFocused || isDropdownOpen) ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="relative">
                                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors duration-300 z-10 ${(isSearchFocused || isDropdownOpen) ? 'text-white' : 'text-gray-400'}`} />

                                        <button
                                            onClick={() => {
                                                if (!loading) {
                                                    setIsDropdownOpen(!isDropdownOpen);
                                                    setIsSearchFocused(!isDropdownOpen);
                                                }
                                            }}
                                            disabled={loading}
                                            className={`w-full bg-white/10 backdrop-blur-sm border-2 rounded-2xl pl-14 pr-14 py-5 text-white text-lg text-left focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${(isSearchFocused || isDropdownOpen)
                                                ? 'border-white shadow-lg shadow-blue-400/20'
                                                : 'border-white/30 hover:border-white/50'
                                                }`}
                                        >
                                            <span className={selectedOption?.label ? 'text-white' : 'text-gray-400'}>
                                                {selectedOption?.label || 'Pilih Status Pembayaran'}
                                            </span>
                                        </button>

                                        <ChevronDown
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300 ${(isSearchFocused || isDropdownOpen) ? 'text-white rotate-180' : 'text-gray-400'}`}
                                        />

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-zinc-900 to-zinc-800 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="py-2">
                                                        {statusOptions.map((option, index) => (
                                                            <motion.button
                                                                key={option.value}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                                onClick={() => handleOptionSelect(option.value)}
                                                                className={`w-full text-left px-6 py-4 text-lg transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none ${Status === option.value
                                                                    ? 'text-white bg-white/5 border-l-4 border-blue-400'
                                                                    : 'text-gray-300 hover:text-white'
                                                                    }`}
                                                            >
                                                                <motion.span
                                                                    whileHover={{ x: 4 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="block"
                                                                >
                                                                    {option.label}
                                                                </motion.span>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {isDropdownOpen && (
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsSearchFocused(false);
                                        }}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Header;