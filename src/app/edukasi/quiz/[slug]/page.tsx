"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, Button, Chip, Progress } from "@heroui/react";
import { Clock, HelpCircle, ChevronLeft, ChevronRight, Send, CheckCircle, Award, BrainCircuit } from "lucide-react";
import RequestAPI from "@/helper/http";

// Tipe Data (Tidak ada perubahan)
interface Question {
    question: string;
    options: string[];
}

interface QuizDetail {
    uuid: string;
    title: string;
    desc: string;
    level: string;
    estimate: number;
    total_questions: number;
    questions: Question[];
    category: {
        name: string;
    };
}

type QuizStatus = "loading" | "ready" | "active" | "submitting" | "completed";

const StartQuizPage = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [status, setStatus] = useState<QuizStatus>("loading");
    const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [quizResult, setQuizResult] = useState<any>(null);

    useEffect(() => {
        if (!slug) return;
        const fetchQuizDetail = async () => {
            try {
                const response = await RequestAPI(`/quiz/${slug}`, "get");
                setQuizDetail(response.body);
                setTimeLeft(response.body.estimate * 60);
                setAnswers(new Array(response.body.total_questions).fill(null));
                setStatus("ready");
            } catch (err) {
                setError("Gagal memuat detail kuis. Pastikan URL valid.");
                setStatus("loading");
            }
        };
        fetchQuizDetail();
    }, [slug]);

    const handleSubmitQuiz = useCallback(async () => {
        setStatus("submitting");
        try {
            const finalAnswers = answers.map(ans => ans === null ? -1 : ans);
            const response = await RequestAPI(
                `/quiz/analyze/${quizDetail!.uuid}`,
                "post",
                { answers: finalAnswers }
            );
            setQuizResult(response.body);
            setStatus("completed");
        } catch (err) {
            setError("Gagal mengirim jawaban. Silakan coba lagi.");
            setStatus("active");
        }
    }, [answers, quizDetail]);

    useEffect(() => {
        if (status !== "active") return;
        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }
        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [status, timeLeft, handleSubmitQuiz]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Anda yakin ingin meninggalkan halaman? Progres kuis akan hilang.";
        };
        if (status === "active") {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [status]);

    const handleStartQuiz = () => setStatus("active");

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizDetail!.total_questions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const currentQuestion = useMemo(() => {
        return quizDetail?.questions[currentQuestionIndex];
    }, [quizDetail, currentQuestionIndex]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const capitalizeFirstLetter = (string: string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 text-white w-full max-w-2xl">
                        <CardBody className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <div className="text-lg">Memuat Detail Kuis...</div>
                        </CardBody>
                    </Card>
                );

            case "ready":
                return (
                    <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-white w-full max-w-2xl">
                        <CardBody className="p-8 text-center">
                            <Chip
                                size="sm"
                                variant="flat"
                                className="bg-slate-700/50 text-slate-300 border border-slate-600/50 mb-4"
                            >
                                {quizDetail?.category.name}
                            </Chip>
                            <h1 className="text-3xl font-bold mb-3 text-white">
                                {quizDetail?.title}
                            </h1>
                            <p className="text-slate-300 mb-6">{quizDetail?.desc}</p>

                            <div className="flex justify-center gap-6 text-sm mb-8">
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30">
                                    <HelpCircle size={16} className="text-blue-400" />
                                    <span className="text-slate-300">{quizDetail?.total_questions} Pertanyaan</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30">
                                    <Award size={16} className="text-yellow-400" />
                                    <span className="text-slate-300">Level {capitalizeFirstLetter(quizDetail?.level || '')}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30">
                                    <Clock size={16} className="text-green-400" />
                                    <span className="text-slate-300">{quizDetail?.estimate} Menit</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleStartQuiz}
                                className="w-full bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                            >
                                Mulai Kuis
                            </Button>
                        </CardBody>
                    </Card>
                );

            case "active":
                return (
                    <div className="w-full max-w-3xl">
                        {/* Header Card */}
                        <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-white mb-6">
                            <CardBody className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <BrainCircuit className="text-blue-400" size={24}/>
                                    <h2 className="text-lg font-semibold truncate text-white">
                                        {quizDetail?.title}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        className="bg-slate-700/50 border border-slate-600/50 text-slate-300"
                                    >
                                        {quizDetail?.category.name}
                                    </Chip>
                                    <div className="flex items-center gap-2 bg-red-600/80 backdrop-blur-sm border border-red-500/50 text-white font-bold px-3 py-1 rounded-md">
                                        <Clock size={16} />
                                        <span>{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Main Question Card */}
                        <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-white">
                            <CardBody className="p-8">
                                <div className="mb-6">
                                    <p className="text-slate-300 text-sm mb-2">
                                        Pertanyaan {currentQuestionIndex + 1} dari {quizDetail?.total_questions}
                                    </p>
                                    <Progress
                                        value={((currentQuestionIndex + 1) / quizDetail!.total_questions) * 100}
                                        color="primary"
                                        className="[&>div]:bg-blue-500 bg-slate-700/50 backdrop-blur-sm rounded-full"
                                    />
                                </div>
                                <h3 className="text-2xl font-medium mb-8 min-h-[64px] text-white">
                                    {currentQuestion?.question}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion?.options.map((option, index) => {
                                        const isSelected = answers[currentQuestionIndex] === index;
                                        return (
                                            <Button
                                                key={index}
                                                onPress={() => handleAnswerSelect(index)}
                                                className={`flex justify-between items-center text-left h-auto py-4 px-5 whitespace-normal transition-all duration-300 backdrop-blur-sm
                                                    ${isSelected
                                                    ? 'bg-blue-600/60 text-white border border-blue-500/60'
                                                    : 'bg-slate-700/30 text-slate-300 border border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-600/40'}`}
                                                variant="bordered"
                                            >
                                                <span>{option}</span>
                                                {isSelected && <CheckCircle size={20} className="text-blue-300" />}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="bordered"
                                className="bg-slate-700/30 backdrop-blur-sm text-slate-300 border border-slate-600/50 hover:bg-slate-600/40 hover:border-slate-500/50 transition-all duration-300"
                                onClick={handlePrevQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ChevronLeft size={18}/> Sebelumnya
                            </Button>
                            {currentQuestionIndex === quizDetail!.total_questions - 1 ? (
                                <Button
                                    className="bg-green-600/80 backdrop-blur-sm text-white font-semibold border border-green-500/50 hover:bg-green-500/80 hover:border-green-400/50 transition-all duration-300"
                                    onClick={handleSubmitQuiz}
                                >
                                    Kirim Jawaban <Send size={18}/>
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-600/80 backdrop-blur-sm text-white border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                    onClick={handleNextQuestion}
                                >
                                    Selanjutnya <ChevronRight size={18}/>
                                </Button>
                            )}
                        </div>
                    </div>
                );

            case "submitting":
                return (
                    <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 text-white w-full max-w-2xl">
                        <CardBody className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                            <div className="text-lg">Mengirim jawaban...</div>
                        </CardBody>
                    </Card>
                );

            case "completed":
                return (
                    <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-white w-full max-w-2xl">
                        <CardBody className="p-8 text-center">
                            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold mb-3 text-white">
                                Kuis Selesai!
                            </h1>
                            <p className="text-slate-300 mb-6">
                                Terima kasih telah menyelesaikan kuis ini. Berikut adalah hasilnya.
                            </p>

                            {/* Score card */}
                            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 p-6 rounded-xl mb-6">
                                <p className="text-lg text-slate-300 mb-2">Skor Anda:</p>
                                <p className="text-5xl font-bold text-blue-400">
                                    {quizResult?.score ? Math.round(Number(quizResult.score)) : "N/A"}
                                </p>
                            </div>

                            <Button
                                onClick={() => router.push('/edukasi/quiz')}
                                className="w-full bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                            >
                                Kembali ke Daftar Kuis
                            </Button>
                        </CardBody>
                    </Card>
                );
        }
    };

    if (error) {
        return (
            <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:4000ms]"></div>

                <Card className="bg-black/30 backdrop-blur-md border border-red-500/50 text-white w-full max-w-2xl shadow-2xl shadow-red-500/20 z-10">
                    <CardBody className="p-8 text-center">
                        <div className="text-red-400 text-lg font-semibold">{error}</div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:4000ms]"></div>

            <main className="w-full flex justify-center z-10">
                {renderContent()}
            </main>
        </div>
    );
};

export default StartQuizPage;