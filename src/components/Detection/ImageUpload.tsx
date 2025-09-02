import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@heroui/react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onCameraOpen: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, onCameraOpen }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0); // penting untuk cegah flicker

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // opsional, biar cursor menunjukkan copy
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      setIsDragging(false);
      dragDepth.current = 0;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="p-8">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group select-none
        ${isDragging ? 'border-black bg-white' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* IKON dropzone ikut state */}
        <Upload
          className={`mx-auto h-16 w-16 mb-4 transition-colors
          ${isDragging ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}
        />

        {/* Teks juga ikut state agar kontras */}
        <h3 className={`text-xl font-semibold mb-2 ${isDragging ? 'text-black' : 'text-gray-700'}`}>
          Upload Gambar Batik Anda
        </h3>
        <p className={`mb-4 transition-colors ${isDragging ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
          Drag dan drop gambar Batik di sini, atau klik untuk memilih file
        </p>
        <p className={`text-sm transition-colors ${isDragging ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
          Mendukung JPG, PNG, WebP hingga 10MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button
          onPress={() => fileInputRef.current?.click()}
          className="flex text-md items-center justify-center gap-2 bg-black text-white font-semibold py-6 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          {/* ikon di tombol (opsional saja) */}
          <Upload className="h-5 w-5" />
          Pilih File
        </Button>

        <Button
          onPress={onCameraOpen}
          className="flex text-md items-center justify-center gap-2 bg-black text-white font-semibold py-6 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Camera className="h-5 w-5" />
          Ambil Foto
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
