import { Search, Store, Funnel, TrendingUp, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { GetUserData, isUserLoggedIn } from "@/lib/GetUserData";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import ModalRegisterSeller from "@/components/ui/modal/ModalRegisterSeller";
import { LoginModal } from "@/components/LoginModal";

interface UserData {
    id?: string;
    name?: string;
    avatar?: string;
    email?: string;
    role?: string;
}

interface HeaderProps {
    searchKeyword: string;
    onSearchChange: (value: string) => void;
    loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    searchKeyword,
    onSearchChange,
    loading = false
}) => {
    const [userData, setUserData] = useState<UserData>({});
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

    const modalRegisterSeller = useDisclosure();

    const checkLoginStatus = () => {
        setIsLoading(true);
        try {
            const loggedIn = isUserLoggedIn();

            if (loggedIn) {
                setIsLoggedIn(true);
                const user_data = GetUserData();
                setUserData(user_data);
            } else {
                setIsLoggedIn(false);
                setUserData({});
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            setIsLoggedIn(false);
            setUserData({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();

        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLoginSuccess = () => {
        checkLoginStatus();
        setIsLoginOpen(false);
    };

    const handleSellerButtonClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setIsLoginOpen(true);
            return;
        }

        if (userData?.role === "user") {
            e.preventDefault();
            modalRegisterSeller.onOpen();
        }
    };

    const getButtonConfig = () => {
        if (isLoading) {
            return {
                icon: null,
                text: "Memuat...",
                href: "#",
                onClick: () => { },
                variant: "loading"
            };
        }

        if (userData?.role === "user") {
            return {
                icon: <Store size={20} />,
                text: "Jadilah Penjual",
                href: "#",
                onClick: handleSellerButtonClick,
                variant: "seller"
            };
        }

        if (userData?.role === "seller" || userData?.role === "admin") {
            return {
                icon: <TrendingUp size={20} />,
                text: "Dashboard",
                href: "/dashboard",
                onClick: () => { },
                variant: "dashboard"
            };
        }

        return {
            icon: <LogIn size={20} />,
            text: "Login untuk Jadi Penjual",
            href: "#",
            onClick: handleSellerButtonClick,
            variant: "login"
        };
    };

    const buttonConfig = getButtonConfig();

    const popularSearches = [
        "Batik Solo", "Batik Jawa", "Batik Pekalongan", "Batik Sunda"
    ];

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
                                    {"Belanja Batik Autentik"
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
                                Temukan motif batik autentik Indonesia dengan kualitas terbaik untuk kebutuhan desain dan koleksi Anda
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <AnimatePresence mode="wait">
                                {buttonConfig.variant === "loading" ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 flex items-center gap-3"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span className="text-white font-medium">Memuat...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={buttonConfig.variant}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href={buttonConfig.href}
                                            onClick={buttonConfig.onClick}
                                            className="block"
                                        >
                                            <HoverBorderGradient
                                                containerClassName="rounded-xl"
                                                as="button"
                                                className="bg-black text-white flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                                            >
                                                {buttonConfig.icon}
                                                <span>{buttonConfig.text}</span>
                                            </HoverBorderGradient>
                                        </Link>
                                    </motion.div>
                                )}
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
                                    <h2 className="text-2xl font-bold text-white">Pencarian Produk</h2>
                                    <p className="text-gray-400">Cari motif batik favorit Anda</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                                className="relative mb-6"
                            >
                                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-[1.02]' : ''
                                    }`}>
                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors duration-300 ${isSearchFocused ? 'text-white' : 'text-gray-400'
                                        }`} />
                                    <input
                                        type="text"
                                        placeholder="Cari motif atau jenis batik..."
                                        value={searchKeyword}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        disabled={loading}
                                        className={`w-full bg-white/10 backdrop-blur-sm border-2 rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-gray-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isSearchFocused
                                            ? 'border-white shadow-lg shadow-blue-400/20'
                                            : 'border-white/30 hover:border-white/50'
                                            }`}
                                        aria-label="Pencarian motif atau jenis batik"
                                    />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.6 }}
                                className="space-y-3"
                            >
                                <p className="text-gray-400 text-sm font-medium">Pencarian Populer:</p>
                                <div className="flex flex-wrap gap-3">
                                    {popularSearches.map((search, index) => (
                                        <motion.button
                                            key={search}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8 + index * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onSearchChange(search)}
                                            disabled={loading}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl border border-white/20 hover:border-white/40 text-sm font-medium transition-all duration-300 disabled:opacity-50"
                                        >
                                            {search}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <ModalRegisterSeller
                isOpen={modalRegisterSeller.isOpen}
                onOpen={modalRegisterSeller.onOpen}
                onOpenChange={modalRegisterSeller.onOpenChange}
                onClose={modalRegisterSeller.onClose}
            />
        </div>
    );
};

export default Header;