"use client";

import { Button, Chip, useDisclosure} from "@heroui/react";
import { Clock, BookOpen, PlayCircle } from "lucide-react";
import { easeOut, motion } from "motion/react";
import { useState, useEffect } from "react";
import RequestAPI from "@/helper/http";
import {useRouter} from "next/navigation";
import {isUserLoggedIn} from "@/lib/GetUserData";
import {LoginModal} from "@/components/LoginModal";

// 1. Definisi tipe data berdasarkan respons API
interface QuizCategory {
    uuid: string;
    name: string;
}

interface QuizData {
    uuid: string;
    slug: string;
    title: string;
    desc: string;
    level: "beginner" | "intermediate" | "advanced" | string; // Menggunakan string untuk fleksibilitas
    estimate: number;
    total_questions: number;
    category: QuizCategory;
}

interface QuizProps {
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.15, ease: easeOut },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Quiz: React.FC<QuizProps> = ({ selectedLevel, setSelectedLevel }) => {
    const router = useRouter()

    // 2. State untuk menyimpan data kuis, status loading, dan error
    const [quizzes, setQuizzes] = useState<QuizData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal
    const modalLogin = useDisclosure();

    // 3. useEffect untuk mengambil data saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true);
                const response = await RequestAPI("/quiz/search", "get");
                setQuizzes(response.body || []); // Ambil data dari properti 'body'
                setError(null);
            } catch (err) {
                console.error("Failed to fetch quizzes:", err);
                setError("Gagal memuat data kuis. Silakan coba lagi nanti.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []); // Dependensi kosong agar hanya berjalan sekali

    // Helper untuk mengubah nama level dari API ke format UI
    const levelMapping: Record<string, string> = {
        beginner: "Pemula",
        intermediate: "Menengah",
        advanced: "Lanjutan",
    };

    const uiLevelMapping: Record<string, string> = {
        Pemula: "beginner",
        Menengah: "intermediate",
        Lanjutan: "advanced",
    };

    // Helper untuk mengubah huruf pertama menjadi kapital
    const capitalizeFirstLetter = (string: string) => {
        const mappedLevel = levelMapping[string.toLowerCase()];
        return mappedLevel || string.charAt(0).toUpperCase() + string.slice(1);
    };

    // 4. Fungsi filter disesuaikan dengan data API
    const filterByLevel = (items: QuizData[], level: string) => {
        if (level === "Semua Level") return items;
        const apiLevel = uiLevelMapping[level];
        return items.filter((item) => item.level === apiLevel);
    };

    // Helper untuk warna level disesuaikan
    const getLevelColor = (level: string) => {
        const levelColors: Record<string, string> = {
            Pemula: "bg-green-500/20 backdrop-blur-sm text-green-300 border border-green-500/30",
            Menengah: "bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border border-yellow-500/30",
            Lanjutan: "bg-red-500/20 backdrop-blur-sm text-red-300 border border-red-500/30",
        };
        return levelColors[level] || "bg-white/10 backdrop-blur-sm text-white/90 border border-white/20";
    };

    const filteredQuizzes = filterByLevel(quizzes, selectedLevel);

    // 5. Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="mt-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-3 mb-8 md:flex-row md:flex-wrap md:justify-center">
                <div className="h-10 w-24 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl animate-pulse"></div>
                <div className="flex flex-wrap justify-center gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-20 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 h-full">
                            <div className="p-6">
                                <div className="flex gap-2 mb-4">
                                    <div className="h-6 w-16 bg-gradient-to-r from-white/20 to-white/10 rounded-full"></div>
                                    <div className="h-6 w-16 bg-gradient-to-r from-white/20 to-white/10 rounded-full"></div>
                                </div>
                                <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl mb-3 w-3/4"></div>
                                <div className="space-y-2 mb-8">
                                    <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-full"></div>
                                    <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-2/3"></div>
                                </div>
                                <div className="flex justify-between mb-6">
                                    <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-1/3"></div>
                                    <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-1/4"></div>
                                </div>
                                <div className="h-12 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Tampilan untuk state loading
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="mt-8 max-w-7xl mx-auto text-center">
                <div className="bg-red-900/20 backdrop-blur-sm border-2 border-red-700 rounded-2xl p-1">
                    <div className="p-6">
                        <p className="text-red-400">{error}</p>
                        <Button 
                            className="mt-4 bg-red-700 hover:bg-red-600 text-white rounded-2xl"
                            onPress={() => window.location.reload()}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <>
        <div className="mt-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-3 mb-8 md:flex-row md:flex-wrap md:justify-center">
                <Button
                    variant={selectedLevel === "Semua Level" ? "solid" : "bordered"}
                    color={selectedLevel === "Semua Level" ? "primary" : "default"}
                    onPress={() => setSelectedLevel("Semua Level")}
                    className={`${
                        selectedLevel === "Semua Level"
                            ? "bg-white/20 backdrop-blur-sm text-white border-white/40 rounded-2xl"
                            : "bg-white/10 backdrop-blur-sm text-white/70 border-white/20 hover:border-white/40 rounded-2xl"
                    }`}
                >
                    Semua Level
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                    {["Pemula", "Menengah", "Lanjutan"].map((level) => (
                        <Button
                            key={level}
                            variant={selectedLevel === level ? "solid" : "bordered"}
                            color={selectedLevel === level ? "primary" : "default"}
                            onPress={() => setSelectedLevel(level)}
                            className={`${
                                selectedLevel === level
                                    ? "bg-white/20 backdrop-blur-sm text-white border-white/40 rounded-2xl"
                                    : "bg-white/10 backdrop-blur-sm text-white/70 border-white/20 hover:border-white/40 rounded-2xl"
                            }`}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 6. Render data dari state 'quizzes' */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz, index) => {
                        const displayLevel = capitalizeFirstLetter(quiz.level);
                        return (
                            <motion.div
                                key={quiz.uuid} // Menggunakan uuid sebagai key unik
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                transition={{ delay: index * 0.2 }}
                                className="h-full"
                            >
                                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] h-full rounded-2xl shadow-xl">
                                    <div className="p-6 text-white flex flex-col h-full">
                                        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full border border-white/20"
                                            >
                                                {quiz.category.name}
                                            </Chip>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className={`${getLevelColor(displayLevel)} px-3 py-1 rounded-full`}
                                            >
                                                {displayLevel}
                                            </Chip>
                                        </motion.div>
                                        <motion.h3
                                            variants={itemVariants}
                                            className="text-xl font-bold mb-3 line-clamp-2 hover:text-gray-300 transition-colors"
                                        >
                                            {quiz.title}
                                        </motion.h3>
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-gray-300 text-sm mb-8 flex-grow line-clamp-3 leading-relaxed"
                                        >
                                            {quiz.desc}
                                        </motion.p>
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex items-center justify-between text-sm text-gray-300 mb-6"
                                        >
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={14} className="align-middle relative top-[1px]" />
                                                <span className="leading-none">{quiz.total_questions} pertanyaan</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="align-middle relative top-[1px]" />
                                                <span className="leading-none">{quiz.estimate} menit</span>
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="mt-auto">
                                            {isUserLoggedIn() ? (
                                                <Button
                                                    onPress={() => router.push(`/education/quiz/${quiz.slug}`)}
                                                    className="w-full text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                                                    size="md"
                                                >
                                                    <PlayCircle 
                                                        size={18} 
                                                        className="align-middle relative top-[1px] group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    Mulai Kuis
                                                </Button>
                                            ) : (
                                                <Button
                                                    onPress={modalLogin.onOpen}
                                                    className="w-full text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                                                    size="md"
                                                >
                                                    <PlayCircle 
                                                        size={18} 
                                                        className="align-middle relative top-[1px] group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    Login Terlebih Dahulu
                                                </Button>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-1 lg:col-span-2 text-center">
                        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-1">
                            <div className="p-6">
                                <p className="text-gray-400">Tidak ada kuis yang tersedia untuk level ini.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <LoginModal
            isOpen={modalLogin.isOpen}
            onClose={modalLogin.onClose}
            onLoginSuccess={() => window.location.reload()}
        />
    </>;
};

export default Quiz;