'use client'

import { Image } from '@heroui/react';
import {
    Download,
    Shield,
    Clock,
    Palette,
    Star,
    CheckCircle,
    Zap,
    Award,
    AlertCircle,
    FileImage,
    ShoppingCart,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentOptions from '@/components/Payments/PaymentOptions';

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

interface OrderDetailsProps {
    orderData: OrderData;
    selectedPayment: string | null;
    onPaymentChange: (payment: string) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
    orderData, 
    selectedPayment, 
    onPaymentChange 
}) => {
    return (
        <div className="lg:col-span-2 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    Detail Pemesanan
                </h1>
                <p className="text-gray-400">Periksa detail produk dan lakukan pembayaran</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="aspect-video lg:aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden group">
                            <Image
                                src={orderData.thumbnails[0]?.thumbnail_url}
                                alt="Product Image"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy='no-referrer'
                                width={320}
                                height={320}
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-3">{orderData.product_name}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-400 text-sm">(4.8/5)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Palette className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-300 text-sm">
                                        {orderData.product_type === 'digital' ? 'Desain Digital' : 'Produk Fisik'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Download className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 text-sm">
                                        {orderData.digital_files?.length} File Digital
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <ShoppingCart className="w-5 h-5 text-purple-400" />
                                    <span className="text-gray-300 text-sm">
                                        Jumlah: {orderData.quantity} item
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Award className="w-5 h-5 text-orange-400" />
                                    <span className="text-gray-300 text-sm">
                                        Premium Quality
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden border-t border-white/20 pt-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Harga per item</span>
                                    <span className="text-white font-semibold">
                                        Rp {orderData.product_price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Jumlah</span>
                                    <span className="text-white font-semibold">x{orderData.quantity}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/20 pt-3">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white font-bold text-lg">
                                        Rp {orderData.total_price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {orderData.digital_files?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Download size={24} className="mr-3 text-blue-400" />
                        File Digital Tersedia
                    </h3>
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="grid gap-4">
                            {orderData.digital_files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <FileImage size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{file.description}</p>
                                        <p className="text-sm text-gray-400">Format: {file.extension.toUpperCase()}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle size={18} className="text-green-400" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4"
            >
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <Shield size={24} className="mx-auto mb-2 text-green-400" />
                    <p className="text-xs text-gray-300">Garansi Kualitas</p>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <Zap size={24} className="mx-auto mb-2 text-blue-400" />
                    <p className="text-xs text-gray-300">Download Instan</p>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <Clock size={24} className="mx-auto mb-2 text-purple-400" />
                    <p className="text-xs text-gray-300">Akses Selamanya</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/20 flex items-start gap-4"
            >
                <AlertCircle size={24} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-white font-semibold mb-2">Informasi Penting</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        File digital akan tersedia untuk diunduh setelah pembayaran berhasil diverifikasi.
                        Anda akan mendapatkan akses download selamanya.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <CreditCard size={24} className="mr-3 text-green-400" />
                    Pilih Pembayaran
                </h3>
                <PaymentOptions 
                    basePrice={orderData.total_price} 
                    value={selectedPayment} 
                    onChange={onPaymentChange} 
                />
            </motion.div>
        </div>
    );
};

export default OrderDetails;