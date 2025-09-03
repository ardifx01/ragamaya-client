"use client";

import {Card, CardBody, Button, Chip, useDisclosure} from "@heroui/react";
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
            Pemula: "bg-green-100 text-green-800",
            Menengah: "bg-yellow-100 text-yellow-800",
            Lanjutan: "bg-red-100 text-red-800",
        };
        return levelColors[level] || "bg-gray-100 text-gray-800";
    };

    const filteredQuizzes = filterByLevel(quizzes, selectedLevel);

    // 5. Tampilan untuk state loading dan error
    if (isLoading) {
        return <div className="text-center text-white mt-10">Memuat kuis...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
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
                            ? "bg-gray-700 text-white border-gray-500"
                            : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
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
                                    ? "bg-gray-700 text-white border-gray-500"
                                    : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
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
                                <Card className="bg-black border-2 border-gray-700 hover:border-gray-500 transition-all duration-200 h-full">
                                    <CardBody className="p-6 text-white flex flex-col h-full">
                                        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-gray-800 text-gray-300 px-2"
                                            >
                                                {quiz.category.name} {/* Menggunakan nama kategori */}
                                            </Chip>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className={`${getLevelColor(displayLevel)} px-2`}
                                            >
                                                {displayLevel} {/* Level yang sudah diformat */}
                                            </Chip>
                                        </motion.div>
                                        <motion.h3
                                            variants={itemVariants}
                                            className="text-xl font-semibold mb-3 line-clamp-2"
                                        >
                                            {quiz.title}
                                        </motion.h3>
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-gray-400 text-sm mb-8 flex-grow line-clamp-3"
                                        >
                                            {quiz.desc} {/* Menggunakan 'desc' dari API */}
                                        </motion.p>
                                        <motion.div
                                            variants={itemVariants}
                                            className="gap-3 mb-6 text-sm flex w-full justify-between items-center"
                                        >
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <BookOpen size={16} className="text-gray-500 align-middle relative top-[1px]" />
                                                <p className="leading-none">{quiz.total_questions} pertanyaan</p> {/* Menggunakan 'total_questions' */}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Clock size={16} className="text-gray-500 align-middle relative top-[1px]" />
                                                <span className="leading-none">{quiz.estimate} menit</span> {/* Menggunakan 'estimate' */}
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="mt-auto">
                                            {isUserLoggedIn() ? (
                                                <Button
                                                    onPress={() => router.push(`/education/quiz/${quiz.slug}`)}
                                                    className="w-full bg-white text-black hover:bg-gray-100 font-medium flex items-center justify-center gap-2"
                                                    size="md">
                                                    <PlayCircle size={18} />
                                                    Mulai Kuis
                                                </Button>
                                            ) : (
                                                <Button
                                                    onPress={modalLogin.onOpen}
                                                    className="w-full bg-white text-black hover:bg-gray-100 font-medium flex items-center justify-center gap-2"
                                                    size="md">
                                                    <PlayCircle size={18} />
                                                    Login Terlebih Dahulu
                                                </Button>
                                            )}
                                        </motion.div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-400 col-span-1 lg:col-span-2">
                        Tidak ada kuis yang tersedia untuk level ini.
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