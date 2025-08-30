"use client"

import { BookOpenText, Brain, MessageSquare, ShoppingBag } from "lucide-react";
import CardSwap, { Card } from "../ui/card-swap";
import { Image } from "@heroui/react";

const Fitur = () => {
    const fiturData = [
        {
            id: 1,
            icon: Brain,
            title: "Deteksi Batik Berbasis AI",
            image: "/assets/fitur1.jpg"
        },
        {
            id: 2,
            icon: BookOpenText,
            title: "Belajar Budaya Batik Indonesia",
            image: "/assets/fitur4.jpg"
        },
        {
            id: 3,
            icon: ShoppingBag,
            title: "Marketplace Batik",
            image: "/assets/fitur3.jpg"
        },
        {
            id: 4,
            icon: MessageSquare,
            title: "Forum Diskusi Mengenai Batik",
            image: "/assets/fitur2.jpg"
        }
    ];

    return (
        <div className="relative">
            <div className="pt-32 md:pt-52 pb-12">
                <div className="max-w-6xl w-full mx-auto px-4">
                    <div className="hidden md:flex items-center justify-between gap-8">
                        <div className="flex-1 space-y-5">
                            <h1 className="text-6xl font-bold text-white">
                                Fitur <span className="block">RagaMaya</span>
                            </h1>
                            <p className="text-gray-400 text-xl">Fitur-fitur yang ada pada RagaMaya</p>
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
                                            <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                                <IconComponent color="white" />
                                                <h3 className="text-white font-bold">{fitur.title}</h3>
                                            </div>
                                            <Image
                                                src={fitur.image}
                                                alt={`Fitur ${fitur.title}`}
                                                width={600}
                                                height={350}
                                                className="p-4 rounded-lg"
                                            />
                                        </Card>
                                    );
                                })}
                            </CardSwap>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <div className="text-center space-y-5 mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                Fitur <span className="block">RagaMaya</span>
                            </h1>
                            <p className="text-gray-400 text-base sm:text-lg px-2">
                                Fitur-fitur yang ada pada RagaMaya
                            </p>
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
                                                <div className="border-b border-white/20 flex items-center p-3 gap-2 bg-black/80">
                                                    <IconComponent color="white" size={16} />
                                                    <h3 className="text-white font-semibold text-sm leading-tight">
                                                        {fitur.title}
                                                    </h3>
                                                </div>
                                                <div className="bg-black/90 p-2">
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