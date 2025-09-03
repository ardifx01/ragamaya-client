'use client';

import { Brain, Sparkles, Shield, Zap } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current && titleRef.current && subtitleRef.current && iconRef.current) {
      gsap.set([titleRef.current, subtitleRef.current, iconRef.current, badgeRef.current, statsRef.current], {
        opacity: 0,
        y: 30,
        scale: 0.9
      });

      const tl = gsap.timeline();

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      })
        .to([iconRef.current, titleRef.current], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.3")
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4")
        .to(statsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.2");

      gsap.to(iconRef.current, {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, []);

  const stats = [
    { label: "Akurasi", value: "98.5%", icon: Shield },
    { label: "Pola Batik", value: "900+", icon: Sparkles },
    { label: "Deteksi", value: "1 Detik", icon: Zap }
  ];

  return (
    <div className="text-center mb-16 mt-32">
      <div ref={headerRef} className="relative">  
        <div ref={iconRef} className="mb-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="relative w-16 h-16  bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-slate-700/50 flex items-center justify-center shadow-white">
              <Brain className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </div>

        <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
            Batik
          </span>
          <span className="text-amber-400 ml-3">Recognition</span>
        </h1>

        <p ref={subtitleRef} className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          Teknologi AI terdepan untuk mengidentifikasi dan menganalisis motif batik tradisional Indonesia
          dengan akurasi tinggi dan informasi budaya yang mendalam
        </p>

        <div ref={statsRef} className="flex flex-wrap justify-center gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="flex w-35 h-17 justify-center items-center gap-3 px-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-lg backdrop-blur-sm hover:scale-[102%] hover:bg-slate-800/60 transition-all duration-300 hover:border-slate-600/50">
                <div className="w-8 h-8 bg-gradient-to-r from-white/10 to-white/5 rounded-lg flex items-center justify-center hover:scale-[102%] transition-all duration-300">
                  <stat.icon className="w-4 h-4 text-white transition-colors duration-300" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold text-base">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;