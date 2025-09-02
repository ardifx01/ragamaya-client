import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    History,
    Info,
    Star,
    Sparkles,
    Copy,
    Share2,
    ChevronDown,
    Award,
    Palette,
} from 'lucide-react';

interface AlternativePattern {
    pattern: string;
    code: string;
    score: number;
    match: "high" | "medium" | "low";
}

interface AnalyzeResponse {
    pattern: string;
    origin: string;
    description: string;
    history: string;
    score: number;
    match: "high" | "medium" | "low";
    alternative: AlternativePattern[];
}

interface AnalysisResultsProps {
    results: AnalyzeResponse;
    imageUrl?: string;
    onClose?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
    results,
    imageUrl,
    onClose
}) => {
    const [showHistory, setShowHistory] = useState(false);
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [copiedText, setCopiedText] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const getMatchColor = (match: string) => {
        switch (match) {
            case 'high': return 'from-green-500 to-emerald-600';
            case 'medium': return 'from-yellow-500 to-orange-500';
            case 'low': return 'from-gray-500 to-gray-600';
            default: return 'from-blue-500 to-purple-600';
        }
    };

    const getMatchText = (match: string) => {
        switch (match) {
            case 'high': return 'Kecocokan Tinggi';
            case 'medium': return 'Kecocokan Sedang';
            case 'low': return 'Kecocokan Rendah';
            default: return 'Tidak Diketahui';
        }
    };

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(type);
            setTimeout(() => setCopiedText(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Analisis Batik: ${results.pattern}`,
                    text: `Saya menemukan motif ${results.pattern} dari ${results.origin}! Tingkat kecocokan: ${results.score}%`,
                    url: window.location.href
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    useEffect(() => {
        // Scroll to top when results appear
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [results]);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mx-auto p-6"
        >
            {/* Header Card */}
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl mb-6 overflow-hidden">
                <div className="relative">
                    {/* Success Banner */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-b border-white/10 p-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4"
                        >
                            <Award className="w-8 h-8 text-white" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
                        >
                            Analisis Berhasil!
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-300 text-center"
                        >
                            AI berhasil mengidentifikasi motif batik Anda
                        </motion.p>
                    </div>

                    {/* Main Result */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Image Preview */}
                            {imageUrl && (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="relative"
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                                        <img
                                            src={imageUrl}
                                            alt="Analyzed batik pattern"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <div className={`bg-gradient-to-r ${getMatchColor(results.match)} rounded-full px-4 py-2 shadow-lg`}>
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-white fill-white" />
                                                <span className="text-white font-semibold text-sm">
                                                    {results.score}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Pattern Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-6"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                                            <Palette className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                            Motif Teridentifikasi
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {results.pattern}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin className="w-4 h-4" />
                                        <span>{results.origin}</span>
                                    </div>
                                </div>

                                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getMatchColor(results.match)} rounded-full px-4 py-2`}>
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span className="text-white font-semibold text-sm">
                                        {getMatchText(results.match)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCopy(results.pattern, 'pattern')}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {copiedText === 'pattern' ? 'Tersalin!' : 'Salin'}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Bagikan
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2">
                        <Info className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">Deskripsi Motif</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                    {results.description}
                </p>
            </motion.div >

            {/* History Expandable Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl mb-6 overflow-hidden"
            >
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Sejarah & Latar Belakang</h4>
                    </div>
                    <motion.div
                        animate={{ rotate: showHistory ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-white/10"
                        >
                            <div className="p-6">
                                <p className="text-gray-300 leading-relaxed">
                                    {results.history}
                                </p>
                                <button
                                    onClick={() => handleCopy(results.history, 'history')}
                                    className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    <Copy className="w-4 h-4" />
                                    {copiedText === 'history' ? 'Tersalin!' : 'Salin Sejarah'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div >

            {/* Alternative Patterns */}
            {
                results.alternative && results.alternative.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                    >
                        <button
                            onClick={() => setShowAlternatives(!showAlternatives)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full p-2">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-white">
                                    Kemungkinan Alternatif ({results.alternative.length})
                                </h4>
                            </div>
                            <motion.div
                                animate={{ rotate: showAlternatives ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {showAlternatives && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-white/10"
                                >
                                    <div className="p-6 space-y-4">
                                        {results.alternative.map((alt, index) => (
                                            <motion.div
                                                key={alt.code}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getMatchColor(alt.match)}`} />
                                                    <div>
                                                        <h5 className="text-white font-medium">{alt.pattern}</h5>
                                                        <p className="text-gray-400 text-sm">{alt.code}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-semibold">
                                                        {alt.score}%
                                                    </div>
                                                    <div className="text-gray-400 text-xs">
                                                        {getMatchText(alt.match)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            }

            {/* Close Button */}
            {
                onClose && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-8 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="bg-gradient-to-r from-gray-600/50 to-gray-700/50 hover:from-gray-500/50 hover:to-gray-600/50 text-white px-8 py-3 rounded-xl border border-white/20 transition-all duration-300"
                        >
                            Tutup Hasil Analisis
                        </motion.button>
                    </motion.div>
                )
            }
        </motion.div >
    );
};

export default AnalysisResults;