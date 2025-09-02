'use client'

import { ShoppingCart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

interface OrderData {
    product_uuid: string;
    product_name: string;
    product_price: number;
    product_type: string;
    quantity: number;
    total_price: number;
    thumbnails: Array<{ thumbnail_url: string }>;
    digital_files: Array<{ file_url: string; description: string; extension: string }>;
    seller_uuid: string;
}

interface OrderSummaryProps {
    orderData: OrderData;
    timeLeft: number;
    isOrdering: boolean;
    onOrder: () => void;
    onBack: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    orderData,
    timeLeft,
    isOrdering,
    onOrder,
    onBack
}) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };

    return (
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
            {/* Desktop Timer */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                scale: timeLeft <= 60 ? [1, 1.1, 1] : 1,
                                color: timeLeft <= 60 ? '#ef4444' : '#f59e0b'
                            }}
                            transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                        >
                            <Clock size={24} />
                        </motion.div>
                        <span className="text-gray-300 font-medium">Waktu Tersisa:</span>
                    </div>
                    <motion.span
                        className={`text-2xl font-bold ${timeLeft <= 60 ? 'text-red-400' : 'text-orange-400'}`}
                        animate={{ scale: timeLeft <= 60 ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                    >
                        {formatTime(timeLeft)}
                    </motion.span>
                </div>
            </motion.div>

            {/* Price Summary */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
            >
                <h3 className="text-xl font-bold text-white mb-6">Detail Harga</h3>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Harga Produk</span>
                        <span className="text-white font-semibold">
                            Rp {(orderData.product_price * orderData.quantity).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Biaya Layanan</span>
                        <span className="text-green-400 font-semibold">Gratis</span>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-6 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-300 font-medium">Total Bayar</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Rp {orderData.total_price.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <HoverBorderGradient
                        containerClassName="rounded-xl w-full"
                        as="button"
                        className="bg-black text-white w-full py-4 px-6 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-300"
                        onClick={onOrder}
                        disabled={isOrdering}
                    >
                        {isOrdering ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                <span>Konfirmasi & Bayar</span>
                            </>
                        )}
                    </HoverBorderGradient>

                    <button
                        onClick={onBack}
                        className="w-full py-4 px-6 text-gray-400 hover:text-white border border-white/20 hover:border-white/40 rounded-xl font-medium transition-all duration-300 hover:bg-white/5"
                        disabled={isOrdering}
                    >
                        Kembali
                    </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                    🔒 Transaksi aman dan terpercaya. File digital akan tersedia setelah pembayaran berhasil
                </p>
            </motion.div>
        </div>
    );
};

export default OrderSummary;