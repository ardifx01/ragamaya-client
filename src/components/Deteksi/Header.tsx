import { Brain } from 'lucide-react';
import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-12 mt-30">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/2">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
          <Brain className="inline-block mr-3 mb-3 top-[1px]" size={40} />
          Deteksi Batik
        </h1>
        <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
          Upload gambar Batik dan temukan asal daerah, sejarah budaya, dan maknanya menggunakan teknologi AI canggih
        </p>
      </div>
    </div>
  );
};

export default Header;