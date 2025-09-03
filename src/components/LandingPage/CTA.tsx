"use client"

import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Star, Users, TrendingUp } from 'lucide-react';
import { Button, Link } from '@heroui/react';

const Avatar = ({ src, alt, className, showFallback, name }) => {
    const [imageError, setImageError] = useState(false);
    
    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    if (imageError || !src) {
        return (
            <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`${className} rounded-full object-cover shadow-lg`}
            onError={() => setImageError(true)}
        />
    );
};

const CTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const testimonials = [
        {
            name: "Sari Wijaya",
            role: "Batik Designer",
            content: "Platform yang luar biasa untuk belajar dan berbagi tentang batik!",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?u=sari"
        },
        {
            name: "Ahmad Santoso",
            role: "Mahasiswa",
            content: "AI detection sangat akurat dan membantu penelitian saya.",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?u=ahmad"
        },
        {
            name: "Maya Indira",
            role: "Pengusaha",
            content: "Marketplace-nya sangat membantu untuk mendapatkan inspirasi desain.",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?u=maya"
        }
    ];

    return (
        <div className="relative py-20 px-6">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Apa Kata <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Pengguna</span>
                        </h3>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Testimoni dari para pengguna yang telah merasakan manfaat platform RagaMaya
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                                <p className="text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                    "{testimonial.content}"
                                </p>

                                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                    <Avatar
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        name={testimonial.name}
                                        className="w-12 h-12"
                                        showFallback
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Siap untuk Memulai?
                        </h3>
                        
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Coba fitur deteksi AI kami yang canggih dan pelajari budaya batik sekarang juga!
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                            <Button as={Link} href="/detection" className="group px-10 py-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center justify-center space-x-4">
                                    <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                                    <span>Coba Deteksi AI</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTA;