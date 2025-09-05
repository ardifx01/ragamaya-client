"use client"

import { useState } from "react";
import { Button } from "@heroui/react";
import { BookOpen, Brain } from "lucide-react";
import { motion } from "motion/react";
import Header from "@/components/Education/Header";
import Article from "@/components/Education/Article";
import Quiz from "@/components/Education/Quiz";

const Edukasi = () => {
    const [selectedLevel, setSelectedLevel] = useState("Semua Level");
    const [activeTab, setActiveTab] = useState("articles");

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="px-4 pt-28 pb-16">
            <div className="max-w-7xl mx-auto">

                <Header />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                    className="w-full"
                >
                    <div className="flex flex-col items-center gap-6 mb-8 md:flex-row md:justify-center">
                        <div className="flex gap-3">
                            <Button
                                variant="bordered"
                                color="default"
                                onPress={() => setActiveTab("articles")}
                                className={`${activeTab === "articles"
                                    ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 rounded-2xl"
                                    : "bg-white/10 backdrop-blur-sm text-white/70 border-2 border-white/20 hover:border-white/40 rounded-2xl"
                                    } px-8 py-6 transition-all duration-300 min-w-[140px] h-[46px] flex items-center justify-center`}
                            >
                                <div className="flex items-center space-x-2">
                                    <BookOpen size={20} />
                                    <span className="font-medium">Artikel</span>
                                </div>
                            </Button>

                            <Button
                                variant="bordered"
                                color="default"
                                onPress={() => setActiveTab("quizzes")}
                                className={`${activeTab === "quizzes"
                                    ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 rounded-2xl"
                                    : "bg-white/10 backdrop-blur-sm text-white/70 border-2 border-white/20 hover:border-white/40 rounded-2xl"
                                    } px-8 py-6 transition-all duration-300 min-w-[140px] h-[46px] flex items-center justify-center`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Brain size={20} />
                                    <span className="font-medium">Kuis</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <motion.div
                        key={activeTab}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {activeTab === "articles" && <Article />}
                        {activeTab === "quizzes" && (
                            <Quiz
                                selectedLevel={selectedLevel}
                                setSelectedLevel={setSelectedLevel}
                            />
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Edukasi;