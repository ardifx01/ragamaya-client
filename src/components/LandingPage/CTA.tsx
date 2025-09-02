"use client"

import React, { useEffect, useRef } from 'react';
import { Camera, BookOpen, ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FiturUnggulan = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const router = useRouter()

    useEffect(() => {

        if (heroRef.current) {
            const title = heroRef.current.querySelector('.hero-title');
            const subtitle = heroRef.current.querySelector('.hero-subtitle');

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

    const handleRedirect = (page) => {
        router.push(`/${page}`);
    };

    const features = [
        {
            icon: Camera,
            title: 'Detection Motif AI',
            description: 'Unggah foto batik dan dapatkan informasi detail tentang motif, asal daerah, dan maknanya',
            page: 'detection'
        },
        {
            icon: BookOpen,
            title: 'Edukasi',
            description: 'Artikel batik dan quiz interaktif untuk memperdalam pengetahuan budaya batik',
            page: 'edukasi'
        },
        {
            icon: ShoppingBag,
            title: 'Marketplace',
            description: 'Jual beli desain batik digital, template, dan karya seni dari kreator lokal',
            page: 'marketplace'
        },
        {
            icon: MessageCircle,
            title: 'Forum Komunitas',
            description: 'Diskusi, berbagi pengalaman, dan belajar bersama komunitas pecinta budaya Indonesia',
            page: 'forum'
        }
    ];

    return (
        <div ref={containerRef} className="pt-70">
            <div ref={heroRef} className="flex items-center justify-center px-4">
                <div className="text-center max-w-7xl mx-auto pb-15">
                    <h1 className="hero-title text-3xl md:text-6xl font-bold text-white mb-6">
                        Coba Fitur RagaMaya Sekarang
                    </h1>
                    <p className="hero-subtitle text-md md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Eksplorasi lengkap dunia batik dalam satu platform
                    </p>
                </div>
            </div>

            <div ref={featuresRef} className="px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 cursor-pointer group relative"
                                onClick={() => handleRedirect(feature.page)}
                            >
                                <div className="absolute top-4 right-4">
                                    <ExternalLink
                                        className="redirect-icon w-5 h-5 text-gray-400 opacity-70 hover:text-white transition-all duration-300"
                                    />
                                </div>

                                <div className="mb-4">
                                    <feature.icon
                                        className="feature-icon w-10 h-10 text-white"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-gray-200 transition-colors duration-300">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiturUnggulan;