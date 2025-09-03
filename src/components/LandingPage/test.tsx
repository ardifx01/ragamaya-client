"use client"

import { BookOpenText, Brain, MessageSquare, ShoppingBag, Sparkles, ChevronRight } from "lucide-react";
import CardSwap, { Card } from "../ui/card-swap";
import { Image } from "@heroui/react";

const Fitur = () => {
    const fiturData = [
        {
            id: 1,
            icon: Brain,
            title: "Deteksi Batik Berbasis AI",
            subtitle: "AI Pattern Recognition",
            description: "Teknologi computer vision terdepan untuk identifikasi motif batik dengan akurasi tinggi",
            image: "/assets/fitur1.jpg",
            gradient: "from-blue-500 to-cyan-400",
            stats: "99% Akurasi"
        },
        {
            id: 2,
            icon: BookOpenText,
            title: "Belajar Budaya Batik Indonesia",
            subtitle: "Cultural Education Hub",
            description: "Artikel mendalam, quiz interaktif, dan panduan komprehensif budaya batik nusantara",
            image: "/assets/fitur4.jpg",
            gradient: "from-emerald-500 to-teal-400",
            stats: "500+ Artikel"
        },
        {
            id: 3,
            icon: ShoppingBag,
            title: "Marketplace Batik",
            subtitle: "Digital Marketplace",
            description: "Platform jual beli desain batik digital dan karya seni dari kreator lokal terpercaya",
            image: "/assets/fitur3.jpg",
            gradient: "from-purple-500 to-pink-400",
            stats: "1000+ Desain"
        },
    ];

    return (
        <div className="relative py-20">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="pt-12 md:pt-20 pb-12">
                <div className="max-w-6xl w-full mx-auto px-4">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-start justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 space-y-8 pt-8">
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Platform Features</span>
                            </div>

                            <div>
                                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        Fitur
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                                        RagaMaya
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-xl leading-relaxed max-w-xl">
                                    Eksplorasi lengkap fitur-fitur canggih yang dirancang khusus untuk pelestarian 
                                    dan pembelajaran budaya batik Indonesia
                                </p>
                            </div>

                            {/* Feature List Preview */}
                            <div className="space-y-4">
                                {fiturData.slice(0, 2).map((fitur, index) => (
                                    <div key={fitur.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${fitur.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <fitur.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">
                                                {fitur.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                {fitur.subtitle}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400 group-hover:text-white transition-colors duration-300">
                                            <span className="text-sm font-medium">{fitur.stats}</span>
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button className="group flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                                <span>Jelajahi Semua Fitur</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Right Content - Card Swap */}
                        <div className="flex-1 relative" style={{ height: '500px' }}>
                            <CardSwap
                                positioning="default"
                                cardDistance={25}
                                verticalDistance={40}
                                delay={4000}
                                pauseOnHover={true}
                                easing="elastic"
                                width={"100%"}
                            >
                                {fiturData.map((fitur) => {
                                    const IconComponent = fitur.icon;
                                    return (
                                        <Card key={fitur.id} className="overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/20 shadow-2xl">
                                            {/* Header */}
                                            <div className="relative bg-black/60 backdrop-blur-sm">
                                                <div className={`absolute inset-0 bg-gradient-to-r ${fitur.gradient} opacity-20`} />
                                                <div className="relative flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${fitur.gradient} shadow-lg`}>
                                                            <IconComponent className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold text-sm leading-tight">
                                                                {fitur.title}
                                                            </h3>
                                                            <p className="text-gray-300 text-xs">{fitur.subtitle}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-300 font-medium bg-white/10 px-2 py-1 rounded-lg">
                                                        {fitur.stats}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className="relative">
                                                <Image
                                                    src={fitur.image}
                                                    alt={`Fitur ${fitur.title}`}
                                                    width={600}
                                                    height={280}
                                                    className="w-full h-64 object-cover"
                                                />
                                            </div>
                                        </Card>
                                    );
                                })}
                            </CardSwap>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                        <div className="text-center space-y-6 mb-12">
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Platform Features</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent block">
                                    Fitur
                                </span>
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent block">
                                    RagaMaya
                                </span>
                            </h1>
                            <p className="text-gray-400 text-base sm:text-lg px-2 leading-relaxed">
                                Eksplorasi lengkap fitur-fitur canggih untuk pelestarian budaya batik Indonesia
                            </p>
                        </div>

                        {/* Mobile Card Swap */}
                        <div className="flex justify-center items-center min-h-[500px] px-4">
                            <div className="relative w-full max-w-[340px]" style={{ height: '420px' }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl border border-white/10 -z-10" />
                                <CardSwap
                                    positioning="center"
                                    cardDistance={12}
                                    verticalDistance={25}
                                    delay={3500}
                                    pauseOnHover={true}
                                    easing="elastic"
                                    width={320}
                                    height={380}
                                >
                                    {fiturData.map((fitur) => {
                                        const IconComponent = fitur.icon;
                                        return (
                                            <Card key={fitur.id} className="overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-white/20">
                                                {/* Header */}
                                                <div className="relative bg-black/70 backdrop-blur-sm">
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${fitur.gradient} opacity-20`} />
                                                    <div className="relative flex items-center justify-between p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${fitur.gradient} shadow-lg`}>
                                                                <IconComponent className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-white font-semibold text-xs leading-tight">
                                                                    {fitur.title}
                                                                </h3>
                                                                <p className="text-gray-300 text-xs">{fitur.subtitle}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-300 font-medium bg-white/10 px-2 py-1 rounded">
                                                            {fitur.stats}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Image */}
                                                <div className="relative">
                                                    <Image
                                                        src={fitur.image}
                                                        alt={`Fitur ${fitur.title}`}
                                                        width={320}
                                                        height={180}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                </div>

                                               
                                            </Card>
                                        );
                                    })}
                                </CardSwap>
                            </div>
                        </div>

                        {/* Mobile Feature List */}
                        <div className="mt-8 space-y-3 px-4">
                            {fiturData.map((fitur, index) => (
                                <div key={fitur.id} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${fitur.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <fitur.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white text-sm group-hover:text-gray-200 transition-colors duration-300">
                                            {fitur.subtitle}
                                        </h3>
                                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                            {fitur.stats}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fitur;