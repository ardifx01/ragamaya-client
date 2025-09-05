'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import RequestAPI from "@/helper/http";
import {IconBrandLinkedin} from "@tabler/icons-react";

// Types untuk Respons API
interface Category {
    uuid: string;
    name: string;
}

interface Quiz {
    uuid: string;
    slug: string;
    title: string;
    desc: string;
    level: string;
    estimate: number;
    minimum_score: number;
    total_questions: number;
    category: Category;
}

interface User {
    uuid: string;
    name: string;
    avatar_url: string;
}

interface CertificateData {
    uuid: string;
    score: number;
    certificate_url: string;
    created_at: string;
    quiz: Quiz;
    user: User;
}

interface CertificateResponse {
    body: CertificateData;
}

interface CertificateDetailsProps {
    userName?: string;
    quizName?: string;
    score?: number;
    date?: string;
    uuid?: string;
    certificateUrl?: string;
}

const CertificatePage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const uuid = params.uuid as string;

    useEffect(() => {
        if (uuid) {
            fetchCertificateData();
        }
    }, [uuid]);

    const fetchCertificateData = async (): Promise<void> => {
        try {
            setLoading(true);
            const response: CertificateResponse = await RequestAPI(
                `/quiz/certificate/${uuid}`,
                "get"
            );
            setCertificateData(response.body);
        } catch (err) {
            setError('Gagal memuat data sertifikat. Mungkin terjadi masalah koneksi atau sertifikat tidak valid.');
            console.error('Error fetching certificate:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                    <p className="text-white/70">Memuat sertifikat...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center bg-black/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
                        <svg className="h-8 w-8 text-red-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Oops! Terjadi Masalah</h2>
                    <p className="text-white/70 mb-8">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (!certificateData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center bg-black/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-yellow-500/10 mb-6">
                        <svg className="h-8 w-8 text-yellow-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sertifikat Tidak Ditemukan</h2>
                    <p className="text-white/70 mb-8">Kami tidak dapat menemukan sertifikat dengan ID yang Anda berikan. Pastikan ID sudah benar.</p>
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 md:p-8 pt-32 md:pt-40">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Kembali
                    </button>
                </div>

                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">

                    <div className="flex justify-center items-start">
                        <CertificateDetails
                            userName={certificateData.user.name}
                            quizName={certificateData.quiz.title}
                            score={certificateData.score}
                            date={formatDate(certificateData.created_at)}
                            uuid={certificateData.uuid}
                            certificateUrl={certificateData.certificate_url}
                        />
                    </div>

                    {/* DETAIL QUIZ tetap dipertahankan */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <h3 className="text-yellow-400 font-medium mb-2">Kategori Quiz</h3>
                            <p className="text-white/80">{certificateData.quiz.category.name}</p>
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <h3 className="text-yellow-400 font-medium mb-2">Level</h3>
                            <p className="text-white/80 capitalize">{certificateData.quiz.level}</p>
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <h3 className="text-yellow-400 font-medium mb-2">Skor Minimum</h3>
                            <p className="text-white/80">{certificateData.quiz.minimum_score}%</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/10">
                        <h3 className="text-yellow-400 font-medium mb-2">Tentang Quiz</h3>
                        <p className="text-white/70 text-sm leading-relaxed">{certificateData.quiz.desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CertificateDetails: React.FC<CertificateDetailsProps> = ({ userName, quizName, score, date, uuid, certificateUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // LinkedIn share
    const handleLinkedInShare = () => {
        const credentialUrl = window.location.href;
        const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
            quizName || ''
        )}&organizationName=${encodeURIComponent(
            'RagaMaya'
        )}&issueYear=${new Date(date || '').getFullYear()}&issueMonth=${new Date(
            date || ''
        ).getMonth() + 1}&certId=${uuid}&certUrl=${encodeURIComponent(credentialUrl)}`;

        window.open(linkedInUrl, "_blank");
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Sertifikat Kelulusan</h1>
            </div>

            <p className="text-white/60 mb-2">Diberikan kepada:</p>
            <h2 className="text-4xl font-serif font-bold text-yellow-400 mb-6">{userName}</h2>

            <p className="text-white/60 mb-2">Telah berhasil menyelesaikan kuis:</p>
            <h3 className="text-2xl font-semibold text-white mb-8">{quizName}</h3>

            <div className="space-y-4 text-left border-t border-white/10 pt-6 max-w-lg mx-auto">
                <div className="flex justify-between items-center">
                    <span className="text-white/70">Skor Akhir:</span>
                    <span className="font-bold text-lg text-yellow-300 bg-yellow-400/10 px-3 py-1 rounded-md">{score}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/70">Tanggal Diterbitkan:</span>
                    <span className="font-medium text-white">{date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/70">ID Sertifikat:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/80">{uuid}</span>
                        <button onClick={() => handleCopy(uuid || '')} className="text-white/60 hover:text-yellow-400 transition-colors">
                            {copied ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tombol aksi */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => window.open(certificateUrl, '_blank')}
                    disabled={!certificateUrl}
                    className="cursor-pointer flex-1 max-w-sm mx-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Sertifikat (PDF)
                </button>

                <button
                    onClick={handleLinkedInShare}
                    className="cursor-pointer flex-1 max-w-sm mx-auto flex items-center justify-center gap-3 px-6 py-3 bg-[#0a66c2] text-white font-bold rounded-lg hover:bg-[#004182] transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                    <IconBrandLinkedin />
                    Tambahkan ke LinkedIn
                </button>
            </div>
        </div>
    );
};

export default CertificatePage;
