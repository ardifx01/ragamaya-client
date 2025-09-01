import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {Input, modal, Select, SelectItem, useDisclosure} from "@heroui/react";
import { Search, Store, ChevronDown, Funnel } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import ModalRegisterSeller from "@/components/ui/modal/ModalRegisterSeller";
import {GetUserData, isUserLoggedIn} from "@/lib/GetUserData";

export const categories = [
    { key: "semua", label: "Semua" },
    { key: "batik-tulis", label: "Batik Tulis" },
    { key: "batik-cap", label: "Batik Cap" },
    { key: "batik-printing", label: "Batik Printing" },
    { key: "batik-solo", label: "Batik Solo" },
    { key: "batik-yogya", label: "Batik Yogya" },
    { key: "batik-pekalongan", label: "Batik Pekalongan" },
    { key: "batik-cirebon", label: "Batik Cirebon" },
];

export const priceRanges = [
    { key: "0-100", label: "Rp 0 - Rp 100.000" },
    { key: "100-250", label: "Rp 100.000 - Rp 250.000" },
    { key: "250-500", label: "Rp 250.000 - Rp 500.000" },
    { key: "500-1000", label: "Rp 500.000 - Rp 1.000.000" },
    { key: "1000-plus", label: "Rp 1.000.000+" },
];

const Header = () => {
    const userData = GetUserData();
    const modalRegisterSeller = useDisclosure()

    return <>
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

                    {isUserLoggedIn() && userData.role !== 'seller' && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="flex justify-center lg:justify-end"
                        >
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    modalRegisterSeller.onOpen()
                                }}
                                href="#"
                                aria-label="Menjadi penjual batik">
                                <HoverBorderGradient
                                    containerClassName="rounded-lg"
                                    as="button"
                                    className="bg-black text-white flex items-center space-x-2 border cursor-pointer px-6 py-3"
                                    aria-label="Tombol untuk menjadi penjual"
                                >
                                    <Store size={20} className="md:w-6 md:h-6" aria-hidden="true" />
                                    <span className="font-bold text-sm md:text-lg">Jadilah Penjual</span>
                                </HoverBorderGradient>
                            </Link>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                    className="bg-black w-full mt-10 rounded-xl border-2 border-gray-500 text-white"
                    role="search"
                    aria-label="Panel pencarian dan filter produk batik"
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
                            <h2 className="text-lg font-medium">Filter</h2>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
                                className="w-full lg:basis-1/2"
                            >
                                <Input
                                    type="text"
                                    placeholder="Cari motif atau jenis batik..."
                                    startContent={<Search size={20} className="text-gray-400" aria-hidden="true" />}
                                    variant="bordered"
                                    size="lg"
                                    aria-label="Pencarian motif atau jenis batik"
                                    classNames={{
                                        inputWrapper: "border-2 border-gray-600 bg-transparent transition-all duration-300 hover:border-gray-400 focus-within:border-white",
                                        input: "text-white placeholder:text-gray-300",
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
                                className="w-full lg:basis-1/4"
                            >
                                <Select
                                    className="w-full"
                                    size="lg"
                                    placeholder="Pilih kategori"
                                    variant="bordered"
                                    aria-label="Pilih kategori batik"
                                    selectorIcon={<ChevronDown size={20} className="text-gray-400" aria-hidden="true" />}
                                    classNames={{
                                        trigger: "border-2 border-gray-600 bg-transparent transition-all duration-300 hover:border-gray-400 data-[open=true]:border-white",
                                        value: "text-white !text-white",
                                        selectorIcon: "text-gray-400",
                                        popoverContent: "bg-gray-800 border border-gray-600",
                                        listbox: "bg-gray-800",
                                    }}
                                >
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.key}
                                            className="text-white data-[hover=true]:bg-gray-700 data-[selectable=true]:focus:bg-gray-700"
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
                                className="w-full lg:basis-1/4"
                            >
                                <Select
                                    className="w-full"
                                    size="lg"
                                    placeholder="Pilih rentang harga"
                                    variant="bordered"
                                    aria-label="Pilih rentang harga batik"
                                    selectorIcon={<ChevronDown size={20} className="text-gray-400" aria-hidden="true" />}
                                    classNames={{
                                        trigger: "border-2 border-gray-600 bg-transparent transition-all duration-300 hover:border-gray-400 data-[open=true]:border-white",
                                        value: "text-white !text-white",
                                        selectorIcon: "text-gray-400",
                                        popoverContent: "bg-gray-800 border border-gray-600",
                                        listbox: "bg-gray-800",
                                    }}
                                >
                                    {priceRanges.map((price) => (
                                        <SelectItem
                                            key={price.key}
                                            className="text-white data-[hover=true]:bg-gray-700 data-[selectable=true]:focus:bg-gray-700"
                                        >
                                            {price.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
        <ModalRegisterSeller
            isOpen={modalRegisterSeller.isOpen}
            onOpen={modalRegisterSeller.onOpen}
            onOpenChange={modalRegisterSeller.onOpenChange}
            onClose={modalRegisterSeller.onClose}
        />
    </>
}

export default Header