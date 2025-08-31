'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Download, FileImage, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

interface DigitalFile {
    file_url: string;
    description: string;
    extension: string;
}

interface Thumbnail {
    thumbnail_url: string;
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

interface ProductDetailProps {
    product: Product;
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    isLoggedIn,
    onLoginRequired
}) => {
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(1);
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleQuantityChange = (newQuantity: number): void => {
        if (!product) return;

        if (newQuantity < 1) {
            setQuantity(1);
        } else if (newQuantity > product.stock) {
            setQuantity(product.stock);
        } else {
            setQuantity(newQuantity);
        }
        if (error) {
            setError('');
        }
    };

    const handleQuantityInputChange = (value: string): void => {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            handleQuantityChange(numValue);
        } else if (value === '') {
            setQuantity(1);
        }
    };

    const validateOrder = (): boolean => {
        if (!product) {
            setError('Data produk tidak tersedia');
            return false;
        }

        if (quantity > product.stock) {
            setError('Jumlah melebihi stok yang tersedia');
            return false;
        }

        if (quantity < 1) {
            setError('Jumlah harus minimal 1');
            return false;
        }

        if (product.stock < 1) {
            setError('Produk sedang habis stok');
            return false;
        }

        return true;
    };

    const handleSubmitOrder = async (): Promise<void> => {
        try {
            setIsSubmitting(true);
            setError('');
            if (!isLoggedIn) {
                onLoginRequired();
                return;
            }
            if (!validateOrder()) {
                return;
            }

            const orderData = {
                product_uuid: product.uuid,
                product_name: product.name,
                product_price: product.price,
                product_type: product.product_type,
                quantity: quantity,
                total_price: product.price * quantity,
                thumbnails: product.thumbnails,
                digital_files: product.digital_files,
                seller_uuid: product.seller_uuid
            };

            const secdat = btoa(JSON.stringify(orderData));
            router.push(`/produk/${product.uuid}/order?secdat=${secdat}`);

        } catch (error) {
            console.error('Error creating order data:', error);
            setError('Terjadi kesalahan saat memproses data pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStarRating = () => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={18}
                className={`${i < 4
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                    }`}
            />
        ));
    };

    const renderKeywordTags = () => {
        return product.keywords.split(',').map((keyword, index) => (
            <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full text-sm border border-white/20 hover:bg-white/20 transition-colors duration-300"
            >
                #{keyword.trim()}
            </motion.span>
        ));
    };

    const totalPrice = product.price * quantity;

    const isPurchaseDisabled = isSubmitting || product.stock < 1;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        {renderStarRating()}
                    </div>
                    <span className="text-gray-400">(128 ulasan)</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                    {product.name}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                    {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {renderKeywordTags()}
                </div>
            </div>

            {product.digital_files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                        <Download size={24} className="mr-3 text-blue-400" />
                        File Digital Tersedia
                    </h3>
                    <div className="grid gap-3">
                        {product.digital_files.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <FileImage size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-white">{file.description}</p>
                                    <p className="text-sm text-gray-400">Format: {file.extension.toUpperCase()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
                <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Rp {product.price.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <p className="text-gray-400">
                        Stok tersedia: <span className="font-semibold text-white">{product.stock}</span> unit
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-3 text-gray-300">
                        Jumlah
                    </label>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-12 h-12 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300 text-lg font-bold"
                            aria-label="Decrease quantity"
                        >
                            -
                        </motion.button>

                        <div className="relative">
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityInputChange(e.target.value)}
                                className="w-24 h-12 text-center bg-white/10 border border-white/20 rounded-xl text-white font-semibold focus:border-white/40 focus:outline-none transition-colors duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                                max={product.stock}
                                aria-label="Product quantity"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="w-12 h-12 cursor-pointer rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300 text-lg font-bold"
                            aria-label="Increase quantity"
                        >
                            +
                        </motion.button>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-6 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-300">
                            Total ({quantity} item{quantity > 1 ? 's' : ''}):
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur-sm"
                        >
                            <p className="text-red-300 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <HoverBorderGradient
                    containerClassName="rounded-lg w-full"
                    as="button"
                    className="bg-black text-white w-full cursor-pointer py-6 px-8 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-300"
                    onClick={handleSubmitOrder}
                    disabled={isPurchaseDisabled}
                >
                    {isSubmitting ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                        <>
                            <ShoppingCart size={24} />
                            <span>
                                {product.stock < 1
                                    ? 'Stok Habis'
                                    : isLoggedIn
                                        ? 'Beli Sekarang'
                                        : 'Login untuk Membeli'
                                }
                            </span>
                        </>
                    )}
                </HoverBorderGradient>
                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                    🔒 Transaksi aman dan terpercaya. File digital akan tersedia untuk diunduh setelah pembayaran berhasil
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ProductDetail;