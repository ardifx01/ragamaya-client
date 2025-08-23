"use client"

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { BookOpen, Brain } from "lucide-react";
import { motion } from "motion/react";
import Header from "@/components/Edukasi/Header";
import Article from "@/components/Edukasi/Article";
import Quiz from "@/components/Edukasi/Quiz";

const Edukasi = () => {
    const [selectedLevel, setSelectedLevel] = useState("Semua Level");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 px-4 pt-28 pb-16">
            <div className="max-w-7xl mx-auto">

                    <Header />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="w-full"
                    >
                        <Tabs
                            aria-label="Konten Edukasi"
                            size="lg"
                            classNames={{
                                tabList:
                                    "flex justify-center md:justify-start gap-6 w-full relative rounded-lg p-1 bg-black border-2 border-gray-600",
                                cursor: "w-full bg-gray-700",
                                tab: "max-w-fit px-8 h-12",
                                tabContent:
                                    "group-data-[selected=true]:text-white text-gray-400 font-medium",
                            }}
                        >
                            <Tab
                                key="articles"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <BookOpen size={20} />
                                        <span>Artikel</span>
                                    </div>
                                }
                            >
                                <Article
                                    selectedLevel={selectedLevel}
                                    setSelectedLevel={setSelectedLevel}
                                />
                            </Tab>

                            <Tab
                                key="quizzes"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Brain size={20} />
                                        <span>Kuis</span>
                                    </div>
                                }
                            >
                                <Quiz
                                    selectedLevel={selectedLevel}
                                    setSelectedLevel={setSelectedLevel}
                                />
                            </Tab>
                        </Tabs>
                    </motion.div>
            </div>
        </div>
    )
}

export default Edukasi;