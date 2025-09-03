"use client"

import { BookOpenText, Brain, ChevronRight, ShoppingBag } from "lucide-react";
import CardSwap, { Card } from "../ui/card-swap";
import { Button, Image } from "@heroui/react";

const Fitur = () => {
    const fiturData = [
        {
            id: 1,
            icon: Brain,
            title: "Deteksi Batik Berbasis AI",
            subtitle: "AI Pattern Recognition",
            description: "Teknologi computer vision terdepan untuk identifikasi motif batik dengan akurasi tinggi",
            image: "/assets/fitur1.jpg",
        },
        {
            id: 2,
            icon: BookOpenText,
            title: "Belajar Budaya Batik Indonesia",
            subtitle: "Cultural Education Hub",
            description: "Artikel mendalam, quiz interaktif, dan panduan komprehensif budaya batik nusantara",
            image: "/assets/fitur4.jpg",
        },
        {
            id: 3,
            icon: ShoppingBag,
            title: "Marketplace Batik",
            subtitle: "Digital Marketplace",
            description: "Platform jual beli desain batik digital dan karya seni dari kreator lokal terpercaya",
            image: "/assets/fitur3.jpg",
        },
    ];

   const handleSmoothScroll = () => {
        const targetElement = document.getElementById('FiturUnggulan');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="relative">
            <div className="pt-32 md:pt-52 pb-12">
                <div className="max-w-6xl w-full mx-auto px-4">
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center justify-between gap-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Fitur
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
                                    RagaMaya
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xl leading-relaxed max-w-xl mb-6">
                                Eksplorasi lengkap fitur-fitur canggih yang dirancang khusus untuk pelestarian
                                dan pembelajaran budaya batik Indonesia
                            </p>
                            <Button 
                                onPress={handleSmoothScroll}
                                className="group inline-flex items-center text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                            >
                                <span className="text-base">Jelajahi Semua Fitur</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 mt-0.5" />
                            </Button>
                        </div>
                        <div className="flex-1 relative" style={{ height: '400px' }}>
                            <CardSwap
                                positioning="default"
                                cardDistance={30}
                                verticalDistance={50}
                                delay={5000}
                                pauseOnHover={false}
                                easing="elastic"
                                width={"100%"}
                            >
                                {fiturData.map((fitur) => {
                                    const IconComponent = fitur.icon;
                                    return (
                                        <Card key={fitur.id} className="overflow-hidden">
                                            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-t-md p-3 border border-white/20 flex items-center gap-2">
                                                <IconComponent color="white" />
                                                <h3 className="text-white font-bold">{fitur.title}</h3>
                                            </div>
                                            <Image
                                                src={fitur.image}
                                                alt={`Fitur ${fitur.title}`}
                                                width={600}
                                                height={350}
                                                className="p-3 rounded-md bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm"
                                            />
                                        </Card>
                                    );
                                })}
                            </CardSwap>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                        <div className="space-y-5 mb-8">
                            <h1 className="text-4xl text-center font-bold text-white leading-tight">
                                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Fitur
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
                                    RagaMaya
                                </span>
                            </h1>
                            <p className="text-gray-400 text-center text-base sm:text-lg leading-relaxed mb-6">
                                Eksplorasi lengkap fitur-fitur canggih yang dirancang untuk pelestarian
                                dan pembelajaran budaya batik Indonesia
                            </p>
                            <div className="flex justify-center">
                                <Button 
                                    onPress={handleSmoothScroll}
                                    className="bg-gradient-to-r inline-flex justify-center from-white/10 to-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/20 items-center gap-2 cursor-pointer"
                                >
                                    <span>Jelajahi Semua Fitur</span>
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center items-center min-h-[650px] px-4">
                            <div className="relative w-full max-w-[320px]" style={{ height: '400px' }}>
                                <CardSwap
                                    positioning="center"
                                    cardDistance={15}
                                    verticalDistance={30}
                                    delay={4000}
                                    pauseOnHover={false}
                                    easing="elastic"
                                    width={310}
                                    height={300}
                                >
                                    {fiturData.map((fitur) => {
                                        const IconComponent = fitur.icon;
                                        return (
                                            <Card key={fitur.id} className="overflow-hidden shadow-lg">
                                                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-t-lg p-3 border border-white/20 flex items-center gap-2">
                                                    <IconComponent color="white" size={16} />
                                                    <h3 className="text-white font-semibold text-sm leading-tight">
                                                        {fitur.title}
                                                    </h3>
                                                </div>
                                                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm p-2">
                                                    <Image
                                                        src={fitur.image}
                                                        alt={`Fitur ${fitur.title}`}
                                                        width={284}
                                                        height={240}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </CardSwap>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fitur;