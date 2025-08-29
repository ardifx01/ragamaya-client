import { Search, Store, Funnel } from "lucide-react";
import { motion } from "framer-motion";
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

    return (
        <>
        <div className="px-4 pt-28">
            <div className="max-w-7xl w-full mx-auto">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 pt-8 lg:pt-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-white space-y-4 text-center lg:text-left"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            {"Belanja Batik Autentik"
                                .split(" ")
                                .map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.15,
                                            ease: "easeInOut",
                                        }}
                                        className="mr-2 inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                            className="text-gray-400 text-base md:text-lg"
                        >
                            Temukan motif batik autentik Indonesia dengan kualitas terbaik untuk kebutuhan desain Anda
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="flex justify-center lg:justify-end"
                    >
                        {isLoading ? (
                            <div className="w-full sm:w-auto">
                                <div className="bg-black border-2 border-gray-600 rounded-lg px-4 sm:px-6 py-3 w-full sm:w-auto">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 bg-gray-600 rounded animate-pulse"></div>
                                        <div className="w-24 h-4 bg-gray-600 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ) : userData?.role === "user" ? (
                            <Link 
                                href="#" 
                                aria-label="Daftar Sebagai Penjual" 
                                className="w-full sm:w-auto"
                                onClick={handleSellerButtonClick}
                            >
                                <HoverBorderGradient
                                    containerClassName="rounded-lg w-full sm:w-auto"
                                    as="button"
                                    className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer px-4 sm:px-6 py-3 w-full sm:w-auto"
                                    aria-label="Tombol daftar sebagai penjual"
                                >
                                    <Store size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                                    <span className="font-bold text-sm md:text-lg">Jadilah Penjual</span>
                                </HoverBorderGradient>
                            </Link>
                        ) : (userData?.role === "seller" || userData?.role === "admin") ? (
                            <Link 
                                href="/dashboard" 
                                aria-label="Dashboard" 
                                className="w-full sm:w-auto"
                            >
                                <HoverBorderGradient
                                    containerClassName="rounded-lg w-full sm:w-auto"
                                    as="button"
                                    className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer px-4 sm:px-6 py-3 w-full sm:w-auto"
                                    aria-label="Tombol menuju dashboard"
                                >
                                    <Store size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                                    <span className="font-bold text-sm md:text-lg">Dashboard</span>
                                </HoverBorderGradient>
                            </Link>
                        ) : (
                            <Link 
                                href="#" 
                                aria-label="Login untuk Jadi Penjual" 
                                className="w-full sm:w-auto"
                                onClick={handleSellerButtonClick}
                            >
                                <HoverBorderGradient
                                    containerClassName="rounded-lg w-full sm:w-auto"
                                    as="button"
                                    className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer px-4 sm:px-6 py-3 w-full sm:w-auto"
                                    aria-label="Tombol login untuk jadi penjual"
                                >
                                    <Store size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                                    <span className="font-bold text-sm md:text-lg">Login untuk Jadi Penjual</span>
                                </HoverBorderGradient>
                            </Link>
                        )}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                    className="bg-black w-full mt-10 rounded-xl border-2 border-gray-500 text-white"
                    role="search"
                    aria-label="Panel pencarian produk batik"
                >
                    <div className="p-4 md:p-5 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="flex gap-2 items-center mb-5"
                        >
                            <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                            >
                                <Funnel size={20} aria-hidden="true" />
                            </motion.div>
                            <h2 className="text-lg font-medium">Pencarian</h2>
                        </motion.div>

                        <div className="w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
                                className="relative"
                            >
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari motif atau jenis batik..."
                                    value={searchKeyword}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-transparent border-2 border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-300 focus:border-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Pencarian motif atau jenis batik"
                                />
                            </motion.div>
                        </div>
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
        </>
    );
};

export default Header;