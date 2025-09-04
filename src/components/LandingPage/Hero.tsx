"use client"

import React from 'react';
import { Camera, ArrowRight, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  const stats = [
    { number: '900+', label: 'Motif Batik', icon: Award },
    { number: '500+', label: 'Kreator Aktif', icon: Users },
    { number: '25K+', label: 'Pengguna', icon: TrendingUp },
    { number: '98.5%', label: 'Akurasi AI', icon: Sparkles }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-38">

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <h1 className="relative z-10 mx-auto max-w-2xl text-center text-5xl md:text-7xl px-2 md:px-0   font-semibold text-white bg-clip-text leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
          {"Temukan Keindahan Budaya Batik Indonesia"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Jelajahi warisan budaya Indonesia melalui teknologi{' '}
          AI terdepan, marketplace digital eksklusif,
          dan edukasi yang menyediakan artikel dan quiz interaktif.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button as={Link} href={'/detection'} className="group flex items-center py-6 bg-white text-black px-8 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300 mt" />
              Mulai Deteksi AI
            </Button>
            <Button as={Link} href={'/marketplace'} className="group flex items-center space-x-1 text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300">
              Jelajahi Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 mt-0.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-2xl md:text-3xl text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider text-center">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Hero;