"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {Card, CardBody, Button, Chip, Progress, useDisclosure} from "@heroui/react";
import { Clock, HelpCircle, ChevronLeft, ChevronRight, Send, CheckCircle, Award, BrainCircuit, XCircle, Download, Trophy, AlertTriangle } from "lucide-react";
import RequestAPI from "@/helper/http";
import {isUserLoggedIn} from "@/lib/GetUserData";
import {LoginModal} from "@/components/LoginModal";

// Tipe Data
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
    certificate?: Certificate;
}

interface Certificate {
    uuid: string;
    score: number;
    certificate_url: string;
    created_at: string;
}

interface QuizResult {
    score: number;
    match: "success" | "failed";
    certificate?: Certificate;
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
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

    // Modal
    const modalLogin = useDisclosure();

    useEffect(() => {
        if (!slug) return;
        const fetchQuizDetail = async () => {
            try {
                const response = await RequestAPI(`/quiz/${slug}`, "get");
                setQuizDetail(response.body);

                // Hanya set timer dan jawaban jika kuis belum dikerjakan
                if (!response.body.certificate) {
                    setTimeLeft(response.body.estimate * 60);
                    setAnswers(new Array(response.body.total_questions).fill(null));
                }

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

    // Handler untuk mengunduh sertifikat dari halaman 'completed'
    const handleDownloadCertificate = () => {
        if (quizResult?.certificate?.certificate_url) {
            window.open(quizResult.certificate.certificate_url, '_blank');
        }
    };

    // Handler untuk mengunduh sertifikat dari halaman 'ready' (jika sudah selesai sebelumnya)
    const handleDownloadPreviousCertificate = () => {
        if (quizDetail?.certificate?.certificate_url) {
            window.open(quizDetail.certificate.certificate_url, '_blank');
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

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreMessage = (match: string, score: number) => {
        if (match === "success") {
            return "Selamat! Anda berhasil menyelesaikan kuis dengan baik.";
        } else {
            if (score >= 60) {
                return "Hampir! Sedikit lagi untuk mencapai nilai kelulusan.";
            } else {
                return "Jangan menyerah! Mari belajar lebih giat dan coba lagi.";
            }
        }
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
                if (quizDetail?.certificate) {
                    return (
                        <Card className="bg-slate-800/30 backdrop-blur-md border border-green-500/50 text-white w-full max-w-2xl shadow-lg shadow-green-500/20">
                            <CardBody className="p-8 text-center">
                                <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
                                <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                                    Kuis Telah Selesai Dikerjakan
                                </h1>
                                <p className="text-slate-300 mb-6">
                                    Selamat! Anda telah berhasil menyelesaikan kuis ini sebelumnya.
                                </p>

                                <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl mb-6">
                                    <p className="text-slate-300 mb-1">Skor yang Anda Peroleh:</p>
                                    <p className={`text-4xl font-bold ${getScoreColor(quizDetail.certificate.score)}`}>
                                        {quizDetail.certificate.score}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto">
                                    <Button
                                        onClick={handleDownloadPreviousCertificate}
                                        className="w-full bg-yellow-600/80 backdrop-blur-sm text-white font-semibold border border-yellow-500/50 hover:bg-yellow-500/80 hover:border-yellow-400/50 transition-all duration-300"
                                    >
                                        <Download size={18} /> Unduh Sertifikat
                                    </Button>
                                    <Button
                                        onClick={() => router.push('/edukasi/quiz')}
                                        className="w-full bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                    >
                                        Kembali ke Daftar Kuis
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    );
                }

                // Jika tidak ada 'certificate', tampilkan halaman mulai kuis seperti biasa
                return (
                    <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 text-white w-full max-w-2xl">
                        <CardBody className="p-6 sm:p-8 text-center">
                            <Chip
                                size="sm"
                                variant="flat"
                                className="bg-slate-700/50 text-slate-300 border border-slate-600/50 mb-4"
                            >
                                {quizDetail?.category.name}
                            </Chip>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                                {quizDetail?.title}
                            </h1>
                            <p className="text-slate-300 mb-6 text-sm sm:text-base">{quizDetail?.desc}</p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-sm mb-8">
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30 w-full sm:w-auto justify-center">
                                    <HelpCircle size={16} className="text-blue-400" />
                                    <span className="text-slate-300">{quizDetail?.total_questions} Pertanyaan</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30 w-full sm:w-auto justify-center">
                                    <Award size={16} className="text-yellow-400" />
                                    <span className="text-slate-300">Level {capitalizeFirstLetter(quizDetail?.level || '')}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-600/30 w-full sm:w-auto justify-center">
                                    <Clock size={16} className="text-green-400" />
                                    <span className="text-slate-300">{quizDetail?.estimate} Menit</span>
                                </div>
                            </div>

                            {isUserLoggedIn() ? (
                                <Button
                                    onPress={handleStartQuiz}
                                    className="w-full bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    Mulai Kuis
                                </Button>
                            ) : (
                                <Button
                                    onPress={modalLogin.onOpen}
                                    className="w-full bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    Login Terlebih Dahulu
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                );

            case "active":
                return (
                    <div className="w-full max-w-3xl">
                        {/* Header Card - Diperbaiki untuk responsive */}
                        <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 text-white mb-6">
                            <CardBody className="p-3 sm:p-4">
                                {/* Mobile Layout */}
                                <div className="flex flex-col sm:hidden space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <BrainCircuit className="text-blue-400 flex-shrink-0" size={20}/>
                                            <h2 className="text-sm font-semibold text-white truncate">
                                                {quizDetail?.title}
                                            </h2>
                                        </div>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs flex-shrink-0 ml-2"
                                        >
                                            {quizDetail?.category.name}
                                        </Chip>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center gap-2 bg-red-600/80 backdrop-blur-sm border border-red-500/50 text-white font-bold px-3 py-2 rounded-lg">
                                            <Clock size={18} />
                                            <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden sm:flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <BrainCircuit className="text-blue-400" size={24}/>
                                        <h2 className="text-lg font-semibold text-white">
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
                                </div>
                            </CardBody>
                        </Card>

                        {/* Main Question Card */}
                        <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 text-white">
                            <CardBody className="p-4 sm:p-6 lg:p-8">
                                <div className="mb-4 sm:mb-6">
                                    <p className="text-slate-300 text-xs sm:text-sm mb-2">
                                        Pertanyaan {currentQuestionIndex + 1} dari {quizDetail?.total_questions}
                                    </p>
                                    <Progress
                                        value={((currentQuestionIndex + 1) / quizDetail!.total_questions) * 100}
                                        color="primary"
                                        className="[&>div]:bg-blue-500 bg-slate-700/50 backdrop-blur-sm rounded-full"
                                    />
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-6 sm:mb-8 min-h-[2rem] sm:min-h-[3rem] text-white leading-relaxed">
                                    {currentQuestion?.question}
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {currentQuestion?.options.map((option, index) => {
                                        const isSelected = answers[currentQuestionIndex] === index;
                                        return (
                                            <Button
                                                key={index}
                                                onPress={() => handleAnswerSelect(index)}
                                                className={`flex justify-between items-center text-left h-auto py-3 sm:py-4 px-4 sm:px-5 whitespace-normal transition-all duration-300 backdrop-blur-sm text-sm sm:text-base
                                                    ${isSelected
                                                    ? 'bg-blue-600/60 text-white border border-blue-500/60'
                                                    : 'bg-slate-700/30 text-slate-300 border border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-600/40'}`}
                                                variant="bordered"
                                            >
                                                <span className="flex-1 text-left leading-relaxed">{option}</span>
                                                {isSelected && <CheckCircle size={18} className="text-blue-300 flex-shrink-0 ml-2" />}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
                            <Button
                                variant="bordered"
                                className="w-full sm:w-auto bg-slate-700/30 backdrop-blur-sm text-slate-300 border border-slate-600/50 hover:bg-slate-600/40 hover:border-slate-500/50 transition-all duration-300"
                                onPress={handlePrevQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ChevronLeft size={18}/> Sebelumnya
                            </Button>
                            {currentQuestionIndex === quizDetail!.total_questions - 1 ? (
                                <Button
                                    className="w-full sm:w-auto bg-green-600/80 backdrop-blur-sm text-white font-semibold border border-green-500/50 hover:bg-green-500/80 hover:border-green-400/50 transition-all duration-300"
                                    onPress={handleSubmitQuiz}
                                >
                                    Kirim Jawaban <Send size={18}/>
                                </Button>
                            ) : (
                                <Button
                                    className="w-full sm:w-auto bg-blue-600/80 backdrop-blur-sm text-white border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                    onPress={handleNextQuestion}
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
                const isSuccess = quizResult?.match === "success";
                const score = quizResult?.score || 0;

                return (
                    <Card className={`bg-slate-800/30 backdrop-blur-md border transition-all duration-300 text-white w-full max-w-2xl ${
                        isSuccess
                            ? 'border-green-500/50 hover:border-green-400/50 shadow-lg shadow-green-500/20'
                            : 'border-red-500/50 hover:border-red-400/50 shadow-lg shadow-red-500/20'
                    }`}>
                        <CardBody className="p-6 sm:p-8 text-center">
                            {/* Icon and Status */}
                            <div className="mb-6">
                                {isSuccess ? (
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <Trophy size={64} className="text-yellow-400 mx-auto mb-2 animate-bounce" />
                                            <div className="absolute -top-2 -right-2">
                                                <CheckCircle size={24} className="text-green-400" />
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            className="bg-green-600/20 text-green-300 border border-green-500/30"
                                        >
                                            LULUS
                                        </Chip>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <AlertTriangle size={64} className="text-red-400 mx-auto mb-2" />
                                            <div className="absolute -top-2 -right-2">
                                                <XCircle size={24} className="text-red-400" />
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            className="bg-red-600/20 text-red-300 border border-red-500/30"
                                        >
                                            TIDAK LULUS
                                        </Chip>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                                {isSuccess ? "Selamat! Kuis Berhasil!" : "Kuis Selesai"}
                            </h1>

                            {/* Message */}
                            <p className="text-slate-300 mb-6">
                                {getScoreMessage(quizResult?.match || "failed", score)}
                            </p>

                            {/* Score Display */}
                            <div className={`backdrop-blur-sm border p-6 rounded-xl mb-6 ${
                                isSuccess
                                    ? 'bg-green-700/20 border-green-600/30'
                                    : 'bg-red-700/20 border-red-600/30'
                            }`}>
                                <p className="text-lg text-slate-300 mb-2">Skor Anda:</p>
                                <p className={`text-4xl sm:text-5xl font-bold ${getScoreColor(score)}`}>
                                    {Math.round(score)}
                                </p>
                                <div className="mt-2">
                                    <Progress
                                        value={score}
                                        color={isSuccess ? "success" : "danger"}
                                        className="max-w-md mx-auto"
                                    />
                                </div>
                            </div>

                            {/* Certificate Section - Only for Success */}
                            {isSuccess && quizResult?.certificate && (
                                <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 p-4 rounded-xl mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Award size={20} className="text-yellow-400" />
                                        <span className="text-yellow-300 font-semibold">Sertifikat Tersedia</span>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-4">
                                        Anda telah memenuhi syarat untuk mendapatkan sertifikat!
                                    </p>
                                    <Button
                                        onPress={handleDownloadCertificate}
                                        className="bg-yellow-600/80 backdrop-blur-sm text-white font-semibold border border-yellow-500/50 hover:bg-yellow-500/80 hover:border-yellow-400/50 transition-all duration-300"
                                    >
                                        <Download size={18} /> Unduh Sertifikat
                                    </Button>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onPress={() => router.push('/education/quiz')}
                                    className="flex-1 bg-blue-600/80 backdrop-blur-sm text-white font-bold border border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    Kembali ke Daftar Kuis
                                </Button>
                                {!isSuccess && (
                                    <Button
                                        onPress={() => window.location.reload()}
                                        className="flex-1 bg-orange-600/80 backdrop-blur-sm text-white font-bold border border-orange-500/50 hover:bg-orange-500/80 hover:border-orange-400/50 transition-all duration-300"
                                    >
                                        Coba Lagi
                                    </Button>
                                )}
                            </div>

                            {/* Additional Info for Failed Quiz */}
                            {!isSuccess && (
                                <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                                    <p className="text-slate-300 text-sm">
                                        <strong>Tips:</strong> Pelajari materi dengan lebih teliti dan pastikan Anda memahami setiap konsep sebelum mencoba lagi.
                                    </p>
                                </div>
                            )}
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

    return <>
        {/* Menggunakan padding-top untuk menghindari navbar yang fixed */}
        <div className="min-h-screen text-white p-4 sm:p-6 md:p-8 pt-20 sm:pt-24 flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:4000ms]"></div>

            <main className="w-full flex justify-center z-10">
                {renderContent()}
            </main>
        </div>
        <LoginModal
            isOpen={modalLogin.isOpen}
            onClose={modalLogin.onClose}
            onLoginSuccess={() => window.location.reload()}
        />
    </>;
};

export default StartQuizPage;