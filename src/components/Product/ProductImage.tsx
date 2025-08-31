'use client'

import { useState } from 'react';
import { Image } from '@heroui/react';
import { ChevronRight, Store, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductDetail from './ProductDetail';

interface Thumbnail {
    thumbnail_url: string;
}

interface DigitalFile {
    file_url: string;
    description: string;
    extension: string;
}

interface Product {
    uuid: string;
    seller_uuid: string;
    product_type: 'digital' | 'physical';
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
    thumbnails: Thumbnail[];
    digital_files: DigitalFile[];
}

interface ProductImageProps {
    product: Product;
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
    product,
    isLoggedIn,
    onLoginRequired
}) => {
    // State management
    const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
    const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    /**
     * Handle sharing product
     */
    const handleShare = async (): Promise<void> => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
                console.log('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                console.log('Link copied to clipboard');
            } catch (clipboardError) {
                console.error('Failed to copy to clipboard:', clipboardError);
            }
        }
    };

    /**
     * Handle thumbnail selection
     */
    const handleThumbnailSelect = (index: number): void => {
        setSelectedThumbnail(index);
    };

    /**
     * Navigate to previous image in zoom modal
     */
    const navigateToPreviousImage = (): void => {
        setSelectedThumbnail(
            selectedThumbnail > 0
                ? selectedThumbnail - 1
                : product.thumbnails.length - 1
        );
    };

    /**
     * Navigate to next image in zoom modal
     */
    const navigateToNextImage = (): void => {
        setSelectedThumbnail(
            selectedThumbnail < product.thumbnails.length - 1
                ? selectedThumbnail + 1
                : 0
        );
    };

    return (
        <>
            {/* Breadcrumb Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-12"
            >
                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
                    <Link
                        href="/marketplace"
                        className="flex items-center text-xs md:text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                        <Store size={18} className="mr-2" />
                        Marketplace
                    </Link>
                    <ChevronRight size={16} className="mx-3 text-gray-500" />
                    <span className="text-white text-xs md:text-sm truncate max-w-48">
                        {product.name}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`p-3 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 ${isFavorite
                            ? 'bg-red-500/20 text-red-400 border-red-400/30'
                            : 'bg-white/5 text-gray-400 hover:text-red-400 hover:border-red-400/30'
                            }`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300"
                        aria-label="Share product"
                    >
                        <Share2 size={20} />
                    </motion.button>
                </div>
            </motion.nav>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                        <motion.div
                            className="aspect-square cursor-zoom-in"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsImageZoomed(true)}
                        >
                            <Image
                                src={product.thumbnails[selectedThumbnail]?.thumbnail_url}
                                alt={`${product.name} - Motif ${selectedThumbnail + 1}`}
                                className="w-full h-full object-cover"
                                width={620}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    </div>
                    {product.thumbnails.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.thumbnails.map((thumbnail, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleThumbnailSelect(index)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedThumbnail === index
                                        ? 'border-white shadow-lg shadow-white/20'
                                        : 'border-white/20 hover:border-white/40'
                                        }`}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <Image
                                        src={thumbnail.thumbnail_url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        width={150}
                                        height={150}
                                    />
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>
                <ProductDetail
                    product={product}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={onLoginRequired}
                />
            </div>
            <AnimatePresence>
                {isImageZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsImageZoomed(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999
                        }}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsImageZoomed(false);
                            }}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 z-10"
                            aria-label="Close image zoom"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </motion.button>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={product.thumbnails[selectedThumbnail]?.thumbnail_url}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                                    width={1200}
                                    height={1200}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                            {product.thumbnails.length > 1 && (
                                <>
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToPreviousImage();
                                        }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300"
                                        aria-label="Previous image"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <polyline points="15,18 9,12 15,6"></polyline>
                                        </svg>
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToNextImage();
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300"
                                        aria-label="Next image"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </motion.button>
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
                                        <span className="text-white text-sm font-medium">
                                            {selectedThumbnail + 1} / {product.thumbnails.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductImage;