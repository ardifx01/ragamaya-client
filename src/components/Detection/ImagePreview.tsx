import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button, Image } from '@heroui/react';

interface ImagePreviewProps {
  selectedImage: string;
  onAnalyze: () => void;
  onReset: () => void;
  isDisabled?: boolean;
  isAnalyzing?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  selectedImage,
  onAnalyze,
  onReset,
  isDisabled = false,
  isAnalyzing = false
}) => {
  return (
    <div className="p-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Hasil Gambar</h3>
      <div className="flex items-center justify-center min-h-[320px] mb-4">
        <Image
          src={selectedImage}
          alt="Preview Batik"
          className="max-w-full max-h-80 rounded-xl shadow-lg object-contain"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button
          onPress={onAnalyze}
          disabled={isAnalyzing || isDisabled}
          className="flex text-md items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-6 px-6 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Sparkles size={20} className="mt-0.5" />
          {isAnalyzing ? 'Menganalisis...' : 'Analisis Batik'}
        </Button>
        <Button
          onPress={onReset}
          className="flex text-md items-center justify-center gap-2 bg-black text-white font-semibold py-6 px-6 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <RotateCcw size={20} className="mt-0.5" />
          Upload Lagi
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;