'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import ImagePreview from './ImagePreview';
import CameraCapture from './CameraCaptute';
import { Sparkles, Target, Upload } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RequestAPI from '@/helper/http';
import AnalysisResults from './AnalyzeResult';
import { set } from 'zod';

gsap.registerPlugin(ScrollTrigger);

interface AlternativePattern {
  pattern: string;
  code: string;
  score: number;
  match: "high" | "medium" | "low";
}

interface AnalyzeResponse {
  pattern: string;
  origin: string;
  description: string;
  history: string;
  score: number;
  match: "high" | "medium" | "low";
  alternative: AlternativePattern[];
}

interface ApiResponse {
  status: number;
  message: string;
  body: AnalyzeResponse;
}


const MainContent = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalyzeResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const cameraSectionRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      alert("Harap pilih file gambar yang valid (JPG, PNG, WebP)");
    }
  }, []);


  const features = [
    {
      icon: Upload,
      gradient: 'from-blue-500 to-purple-600',
      title: '1. Upload Gambar',
      description: 'Upload foto yang jelas dari Batik atau motif kain tradisional Anda'
    },
    {
      icon: Sparkles,
      gradient: 'from-green-500 to-teal-600',
      title: '2. AI Analysis',
      description: 'AI kami menganalisis pola, motif, dan karakteristik budaya dari gambar Anda'
    },
    {
      icon: Target,
      gradient: 'from-yellow-500 to-orange-600',
      title: '3. Dapatkan Hasil',
      description: 'Terima informasi detail tentang asal daerah, sejarah, dan makna dari Batik Anda'
    }
  ];

  const openCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });

      setStream(mediaStream);
      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);

    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setSelectedImage(file);
          }
        }, "image/jpeg", 0.8);

        closeCamera();
      }
    }
  }, [closeCamera]);

  const fetchAnalyze = async () => {
    if (!selectedImage) {
      return { status: 400, message: "No image selected", body: {} as AnalyzeResponse };
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    setIsAnalyzing(true)
    const res: ApiResponse = await RequestAPI('/predict/analyze', 'post', formData);
    if (res.body) {
      setAnalysisResults(res.body);
    } else {
      alert(res.message);
      setAnalysisResults(null);
    }
    setIsAnalyzing(false)
  };

  const resetDetection = useCallback(() => {
    setSelectedImage(null);
    setAnalysisResults(null);
    setIsAnalyzing(false);

    if (isCameraOpen) {
      closeCamera();
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [isCameraOpen, closeCamera]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');

      gsap.fromTo(featureCards,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      featureCards.forEach((card) => {
        const icon = card.querySelector('.feature-icon');
        if (icon) {
          card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              rotation: 360,
              scale: 1.2,
              duration: 0.6,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              rotation: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out"
            });
          });
        }
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [stream]);

  useEffect(() => {
    if (selectedImage && previewSectionRef.current) {
      gsap.fromTo(previewSectionRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        }
      );
    }

    if (!selectedImage && uploadSectionRef.current) {
      gsap.fromTo(uploadSectionRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        }
      );
    }
  }, [selectedImage]);

  useEffect(() => {
    if (isCameraOpen && cameraSectionRef.current) {
      gsap.fromTo(cameraSectionRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 10
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: "power3.out"
        }
      );
    }
  }, [isCameraOpen]);

  return (
    <div>
      <div
        ref={containerRef}
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {!selectedImage && !isCameraOpen && (
          <div ref={uploadSectionRef}>
            <ImageUpload
              onFileSelect={handleFileSelect}
              onCameraOpen={openCamera}
            />
          </div>
        )}

        {isCameraOpen && (
          <div ref={cameraSectionRef}>
            <CameraCapture
              videoRef={videoRef}
              onCapture={capturePhoto}
              onClose={closeCamera}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {selectedImage && (
          <div ref={previewSectionRef}>
            <ImagePreview
              selectedImage={URL.createObjectURL(selectedImage)}
              onAnalyze={fetchAnalyze}
              onReset={resetDetection}
              isDisabled={analysisResults !== null}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}


        <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 p-8 bg-gray-50">
          {features.map((feature, index) => (
            <div key={index} className="text-center group feature-card cursor-pointer">
              <div className={`bg-gradient-to-br ${feature.gradient} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300`}>
                <feature.icon className="h-8 w-8 text-white feature-icon" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      {analysisResults && (
        <div ref={resultsSectionRef}>
          <AnalysisResults
            results={analysisResults}
            imageUrl={selectedImage ? URL.createObjectURL(selectedImage) : undefined}
            onClose={resetDetection}
          />
        </div>
      )}
    </div>
  );
};

export default MainContent;