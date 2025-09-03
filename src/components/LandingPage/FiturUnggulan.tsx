"use client"

import React, { useEffect, useRef } from 'react';
import { Camera, BookOpen, ShoppingBag, ExternalLink, ArrowRight, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FiturUnggulan = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (heroRef.current) {
            const title = heroRef.current.querySelector('.hero-title');
            const subtitle = heroRef.current.querySelector('.hero-subtitle');

            if (title && subtitle) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(50px)';
                subtitle.style.opacity = '0';
                subtitle.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    title.style.transition = 'all 1s ease-out';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, 300);

                setTimeout(() => {
                    subtitle.style.transition = 'all 1s ease-out';
                    subtitle.style.opacity = '1';
                    subtitle.style.transform = 'translateY(0)';
                }, 600);
            }
        }

        if (featuresRef.current) {
            const cards = featuresRef.current.querySelectorAll('.feature-card');

            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(80px) scale(0.9)';

                setTimeout(() => {
                    card.style.transition = 'all 0.8s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 900 + (index * 150));
            });

            cards.forEach((card) => {
                const icon = card.querySelector('.feature-icon');
                const redirectIcon = card.querySelector('.redirect-icon');

                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'all 0.3s ease-out';
                    card.style.transform = 'translateY(-8px) scale(1.02)';

                    if (icon) {
                        icon.style.transition = 'all 0.4s ease-out';
                        icon.style.transform = 'rotate(360deg) scale(1.1)';
                    }

                    if (redirectIcon) {
                        redirectIcon.style.transition = 'all 0.3s ease-out';
                        redirectIcon.style.transform = 'translate(2px, -2px)';
                        redirectIcon.style.opacity = '1';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.3s ease-out';
                    card.style.transform = 'translateY(0) scale(1)';

                    if (icon) {
                        icon.style.transition = 'all 0.4s ease-out';
                        icon.style.transform = 'rotate(0deg) scale(1)';
                    }

                    if (redirectIcon) {
                        redirectIcon.style.transition = 'all 0.3s ease-out';
                        redirectIcon.style.transform = 'translate(0, 0)';
                        redirectIcon.style.opacity = '0.7';
                    }
                });
            });
        }
    }, []);

    const handleCardClick = (link) => {
        router.push(link);
    };

    const features = [
        {
            icon: Camera,
            title: 'Detection Motif AI',
            description: 'Unggah foto batik dan dapatkan informasi detail tentang motif, asal daerah, dan maknanya dengan akurasi tinggi',
            gradient: 'from-blue-500 to-cyan-400',
            stats: '98.5% Akurasi',
            link: '/detection'
        },
        {
            icon: BookOpen,
            title: 'Edukasi',
            description: 'Artikel batik dan quiz interaktif untuk memperdalam pengetahuan budaya batik Indonesia',
            gradient: 'from-emerald-500 to-teal-400',
            stats: 'Artikel & Quiz',
            link: '/education'
        },
        {
            icon: ShoppingBag,
            title: 'Marketplace',
            description: 'Jual beli desain batik digital, template premium, dan karya seni autentik dari kreator lokal terpercaya',
            gradient: 'from-purple-500 to-pink-400',
            stats: 'Desain Eksklusif',
            link: '/marketplace'
        },
    ];

    return (
        <div ref={containerRef} className="relative py-20 px-6">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-40 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>
            <div ref={heroRef} id ="FiturUnggulan" className="flex items-center justify-center mb-16">
                <div className="text-center max-w-6xl mx-auto mt-40">
                    <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Coba Fitur
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
                            RagaMaya
                        </span>
                        <br />
                    </h1>
                    <p className="hero-subtitle text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                        Eksplorasi lengkap dunia batik dalam satu platform terintegrasi dengan teknologi terdepan
                    </p>
                </div>
            </div>
            <div ref={featuresRef} className="relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onClick={() => handleCardClick(feature.link)}
                                className="feature-card relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                                <div className="absolute top-4 right-4 z-10">
                                    <ExternalLink
                                        className="redirect-icon w-5 h-5 text-gray-400 opacity-70 hover:text-white transition-all duration-300"
                                    />
                                </div>
                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                            <feature.icon
                                                className="feature-icon w-7 h-7 text-white"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-gray-200 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                {feature.stats}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <span className={`text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                                Explore
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiturUnggulan;