import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@heroui/react';

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCapture: () => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ videoRef, onCapture, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="p-8 text-center border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
        <Camera className="h-6 w-6 mt-0.5" />
        Ambil Foto Batik
      </h3>
      <div className="flex justify-center mb-6">
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl max-w-md w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto block"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.error);
              }
            }}
          />
          <div className="absolute inset-0 border-2 border-white/30 rounded-xl pointer-events-none"></div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onPress={onCapture}
          className="flex text-md items-center justify-center gap-2 bg-black/30 hover:bg-white/20 text-white  font-semibold border border-white hover:border-white/40 py-6 px-8 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Camera size={20} className="mt-0.5" />
          Ambil Foto
        </Button>
        <Button
          onPress={onClose}
          className="flex text-md items-center justify-center gap-2 bg-black/30 hover:bg-white/20 text-white  font-semibold border border-white hover:border-white/40 py-6 px-5 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <X size={20} className="mt-0.5" />
          Tutup Kamera
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;