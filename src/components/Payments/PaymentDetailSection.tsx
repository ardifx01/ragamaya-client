'use client'

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Package, Star, Upload, ShoppingCart, AlertCircle, CheckCircle, Zap, Award, CreditCard, Download } from "lucide-react";
import { Image, addToast } from "@heroui/react";
import { motion } from 'framer-motion';

// Type definitions for batik product data
interface Thumbnail {
    id: number;
    thumbnail_url: string;
}

interface DigitalFile {
    file_url: string;
    description: string;
    extension: string;
}

interface BatikProduct {
    uuid: string;
    seller_uuid: string;
    product_type: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
    thumbnails: Thumbnail[];
    digital_files: DigitalFile[];
}

// Type definitions for payment data
interface PaymentAction {
    name: string;
    method: string;
    url: string;
}

interface PaymentVANumber {
    va_number: string;
    bank?: string;
}

// Main order data interface - matching your API response
interface OrderData {
    uuid: string;
    user_uuid: string;
    product_uuid: string;
    order_uuid: string;
    gross_amount: number;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status: string;
    status_code: string;
    status_message: string;
    currency: string;
    acquirer?: string;
    qr_string?: string;
    expiry_time: string;
    created_at: string;
    updated_at: string;
    payment_actions: PaymentAction[];
    payment_va_numbers?: PaymentVANumber[];
    permata_va_number?: string;
    payment_code?: string;
    product: BatikProduct;
    quantity?: number;
    // Legacy support for old structure
    order_payment_type?: string;
    order_status?: string;
    status?: string;
    payments?: any[];
}

interface PaymentDetailSectionProps {
    data: OrderData;
}

const PaymentDetailSection: React.FC<PaymentDetailSectionProps> = ({ data }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = (url: string, filename?: string): void => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "downloaded-file";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderQRISPayment = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center"
        >
            <div className="relative inline-block p-4 bg-white rounded-xl">
                <Image
                    src={data?.payment_actions?.[0]?.url}
                    alt={data?.qr_string || "QRIS Code"}
                    className="w-48 h-48 object-contain"
                />
            </div>
            <button
                type="button"
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                onClick={() => handleDownload(
                    data.payment_actions[0].url,
                    data.qr_string
                )}
            >
                <Download size={20} />
                Download QRIS
            </button>
        </motion.div>
    );

    const renderGopayPayment = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center"
        >
            <div className="relative inline-block p-4 bg-white rounded-xl mb-4">
                <Image
                    src={data?.payment_actions?.find(action => action.name === 'generate-qr-code')?.url}
                    className="w-48 h-48 object-contain"
                    alt="GoPay QR"
                />
            </div>
            <button
                type="button"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                onClick={() => {
                    const deeplink = data?.payment_actions?.find(action => action.name === 'deeplink-redirect');
                    if (deeplink) {
                        window.open(deeplink.url, "_blank");
                    }
                }}
            >
                Buka GoPay
            </button>
        </motion.div>
    );

    const renderShopeepayPayment = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center"
        >
            <div className="relative inline-block p-4 bg-white rounded-xl mb-4">
                <Image src={`/payments/shopeepay.svg`} className="w-48 h-24 object-contain" alt="ShopeePay" />
            </div>
            <button
                type="button"
                className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                onClick={() => {
                    const deeplink = data?.payment_actions?.find(action => action.name === 'deeplink-redirect');
                    if (deeplink) {
                        window.open(deeplink.url, "_blank");
                    }
                }}
            >
                Buka ShopeePay
            </button>
        </motion.div>
    );

    const renderVAPayment = (vaNumber: string, message: string = "Nomor VA berhasil disalin") => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
            <div className="text-center mb-4">
                <h4 className="text-white font-semibold mb-2">Nomor Virtual Account</h4>
                <p className="text-gray-400 text-sm">Klik untuk menyalin nomor</p>
            </div>
            <div
                className="bg-white/10 border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                onClick={() =>
                    navigator.clipboard.writeText(vaNumber)
                        .then(() => addToast({
                            title: "Berhasil!",
                            description: message,
                            color: "success"
                        }))
                        .catch(() => addToast({
                            title: "Gagal!",
                            description: "Gagal menyalin nomor",
                            color: "danger"
                        }))
                }
            >
                <span className="text-white font-mono text-lg">{vaNumber}</span>
                <Copy size={20} className="text-gray-300" />
            </div>
        </motion.div>
    );

    const renderPaymentAction = () => {
        const paymentType = data.payment_type || data.order_payment_type;
        
        switch (paymentType) {
            case "qris":
                return renderQRISPayment();
            case "shopeepay":
                return renderShopeepayPayment();
            case "gopay":
                return renderGopayPayment();
            case "bni":
            case "mandiri":
            case "cimb":
            case "bca":
            case "bri":
                return renderVAPayment(
                    data.payment_va_numbers?.[0]?.va_number || "",
                    "Nomor VA berhasil disalin"
                );
            case "maybank":
            case "permata":
            case "mega":
                return renderVAPayment(
                    data.permata_va_number || "",
                    "Nomor VA berhasil disalin"
                );
            case "indomaret":
            case "alfamart":
                return renderVAPayment(
                    data.payment_code || "",
                    "Kode pembayaran berhasil disalin"
                );
            default:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-yellow-400/20 p-6"
                    >
                        <p className="text-yellow-300 text-center">
                            Metode pembayaran "{paymentType}" tidak dikenali.
                        </p>
                    </motion.div>
                );
        }
    };

    return (
        <div className="space-y-8">
            {/* Product Detail Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
            >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Package size={24} className="mr-3 text-blue-400" />
                    Detail Produk Batik
                </h3>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-32 flex-shrink-0">
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            <Image
                                src={data.product.thumbnails[0]?.thumbnail_url || '/images/placeholder.png'}
                                alt={data.product?.name || 'Product Image'}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-white text-xl font-bold mb-1">{data.product.name}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-sm">(4.8/5)</span>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-5">{data.product.description}</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <CreditCard className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300 text-sm">Rp {data.product.price.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <ShoppingCart className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300 text-sm">Qty: {data.quantity}</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Upload className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300 text-sm">Digital File</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Package className="w-4 h-4 text-orange-400" />
                                    <span className="text-gray-300 text-sm">Stock: {data.product.stock}</span>
                                </div>
                            </div>

                            {/* Digital Files Info */}
                            {data.product.digital_files?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-sm font-medium text-gray-300 mb-2">
                                        File Digital Tersedia:
                                    </p>
                                    <div className="space-y-2">
                                        {data.product.digital_files.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                <span>{file.description}</span>
                                                <span className="px-1 py-0.5 bg-white/10 rounded text-xs">
                                                    {file.extension.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Payment Information Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8"
            >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <CreditCard size={24} className="mr-3 text-green-400" />
                    Informasi Pembayaran
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Metode Pembayaran</span>
                            <span className="text-white font-semibold uppercase">{data.payment_type || data.order_payment_type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Nomor Pesanan</span>
                            <span className="text-white font-mono text-sm">{data.order_uuid || data.uuid}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Pembayaran</span>
                            <span className="text-white font-semibold">Rp {(data.gross_amount || data.total_price || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status Transaksi</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                data.transaction_status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                    : data.transaction_status === 'settlement'
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : data.transaction_status === 'expire'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                                {data.transaction_status || data?.payments?.[0]?.transaction_status || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Waktu Expire</span>
                            <span className="text-white text-sm">
                                {data.expiry_time ? new Date(data.expiry_time).toLocaleString('id-ID') : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Acquirer</span>
                            <span className="text-white text-sm uppercase">{data.acquirer || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Actions for pending orders */}
                {(data.transaction_status === "pending" || data.status === "pending" || data.order_status === "pending") && (
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Zap size={20} className="mr-2 text-yellow-400" />
                            Lakukan Pembayaran
                        </h4>
                        {renderPaymentAction()}
                    </div>
                )}

                {/* Link to tickets for completed orders */}
                {(data.transaction_status === "settlement" || data.status === "settlement" || data.order_status === "settlement") && (
                    <div className="border-t border-white/10 pt-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-400/20 p-4 mb-4 flex items-center gap-3"
                        >
                            <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                            <p className="text-green-300 font-medium">
                                Pembayaran berhasil! File digital Anda sudah siap untuk diunduh.
                            </p>
                        </motion.div>
                        <Link
                            href={`/tickets`}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl px-6 py-3 inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                        >
                            <Award size={20} />
                            Lihat File Digital Saya
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                )}

                {/* Expired payment notice */}
                {data.transaction_status === "expire" && (
                    <div className="border-t border-white/10 pt-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-red-400/20 p-4 mb-4 flex items-center gap-3"
                        >
                            <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                            <p className="text-red-300 font-medium">
                                Pembayaran telah kedaluwarsa. Silakan buat pesanan baru untuk melanjutkan.
                            </p>
                        </motion.div>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/20 flex items-start gap-4"
            >
                <AlertCircle size={24} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-white font-semibold mb-2">Informasi Penting</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        File digital akan tersedia untuk diunduh setelah pembayaran berhasil diverifikasi.
                         Anda akan mendapatkan akses download selamanya.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentDetailSection;