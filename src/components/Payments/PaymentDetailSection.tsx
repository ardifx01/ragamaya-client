'use client'

import { useState } from "react";
import { Copy, Package, Star, Upload, ShoppingCart, AlertCircle, Zap, Award, CreditCard, Download } from "lucide-react";
import { Image, addToast } from "@heroui/react";
import { motion } from 'framer-motion';

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

interface PaymentAction {
    name: string;
    method: string;
    url: string;
}

interface PaymentVANumber {
    va_number: string;
    bank?: string;
}

interface PaymentData {
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
    payment_actions: PaymentAction[];
    payment_va_numbers?: PaymentVANumber[];
    permata_va_number?: string;
    payment_code?: string;
    store?: string;
}

interface OrderData {
    uuid: string;
    user_uuid: string;
    product_uuid: string;
    quantity: number;
    amount: number;
    status: string;
    payments: PaymentData[];
    product?: BatikProduct;
}

interface PaymentDetailSectionProps {
    data: OrderData;
}

const PaymentDetailSection: React.FC<PaymentDetailSectionProps> = ({ data }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentPayment = data.payments?.[0];

    const productData = data.product || {
        uuid: data.product_uuid || '',
        name: 'Produk Batik Digital',
        description: 'Motif batik digital berkualitas tinggi',
        price: data.amount || 0,
        stock: 1,
        thumbnails: [],
        digital_files: []
    } as BatikProduct;

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
                    src={currentPayment?.payment_actions?.[0]?.url}
                    alt={currentPayment?.qr_string || "QRIS Code"}
                    className="w-48 h-48 object-contain"
                />
            </div>
            <button
                type="button"
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                onClick={() => handleDownload(
                    currentPayment?.payment_actions[0]?.url || '',
                    currentPayment?.qr_string
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
                    src={currentPayment?.payment_actions?.find(action => action.name === 'generate-qr-code')?.url}
                    className="w-48 h-48 object-contain"
                    alt="GoPay QR"
                />
            </div>
            <button
                type="button"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-auto block"
                onClick={() => {
                    const deeplink = currentPayment?.payment_actions?.find(action => action.name === 'deeplink-redirect');
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
            <div className="relative inline-block p-4 bg-white rounded-xl mb-6">
                <Image
                    src={`/payments/shopeepay.svg`}
                    className="w-48 h-24 object-contain"
                    alt="ShopeePay"
                    width={192}
                    height={96}
                />
            </div>

            <div className="w-full">
                <button
                    type="button"
                    className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 w-auto mx-auto block"
                    onClick={() => {
                        const deeplink = currentPayment?.payment_actions?.find(action => action.name === 'deeplink-redirect');
                        if (deeplink) {
                            window.open(deeplink.url, "_blank");
                        }
                    }}
                >
                    Buka ShopeePay
                </button>
            </div>
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
                <h4 className="text-white font-semibold mb-2">Kode Pembayaran</h4>
                <p className="text-gray-400 text-sm">Klik untuk menyalin</p>
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
                            description: "Gagal menyalin kode",
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
        const paymentType = currentPayment?.payment_type;

        if (!paymentType) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 backdrop-blur-sm rounded-2xl border border-gray-400/20 p-6"
                >
                    <p className="text-gray-300 text-center">
                        Metode pembayaran tidak tersedia.
                    </p>
                </motion.div>
            );
        }

        switch (paymentType) {
            case "qris":
                return renderQRISPayment();
            case "shopeepay":
                return renderShopeepayPayment();
            case "gopay":
                return renderGopayPayment();
            case "bank_transfer":
                return renderVAPayment(
                    currentPayment?.payment_va_numbers?.[0]?.va_number || currentPayment?.permata_va_number || "",
                    "Nomor VA berhasil disalin"
                );
            case "cstore":
                return renderVAPayment(
                    currentPayment?.payment_code || "",
                    `Kode pembayaran ${currentPayment?.store || ""} berhasil disalin`
                );
            case "maybank":
            case "permata":
            case "mega":
                return renderVAPayment(
                    currentPayment?.permata_va_number || "",
                    "Nomor VA berhasil disalin"
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
                                src={productData.thumbnails?.[0]?.thumbnail_url || '/images/placeholder.png'}
                                alt={productData?.name || 'Product Image'}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-white text-xl font-bold mb-1">{productData.name}</p>
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
                            <p className="text-gray-300 mb-5">{productData.description}</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <CreditCard className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300 text-sm">Rp {(data.amount || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <ShoppingCart className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300 text-sm">Qty: {data.quantity || 1}</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Upload className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300 text-sm">Digital File</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Package className="w-4 h-4 text-orange-400" />
                                    <span className="text-gray-300 text-sm">Stock: {productData.stock || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

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
                            <span className="text-white font-semibold uppercase">{currentPayment?.payment_type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Nomor Pesanan</span>
                            <span className="text-white font-mono text-sm">{data.uuid}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Pembayaran</span>
                            <span className="text-white font-semibold">Rp {(currentPayment?.gross_amount || data.amount || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status Transaksi</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${(currentPayment?.transaction_status || data.status) === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : (currentPayment?.transaction_status || data.status) === 'settlement'
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : (currentPayment?.transaction_status || data.status) === 'expire'
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                }`}>
                                {currentPayment?.transaction_status || data.status || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Waktu Expire</span>
                            <span className="text-white text-sm">
                                {currentPayment?.expiry_time ? new Date(currentPayment.expiry_time).toLocaleString('id-ID') : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Acquirer</span>
                            <span className="text-white text-sm uppercase">{currentPayment?.acquirer || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {((currentPayment?.transaction_status || data.status) === "pending") && (
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Zap size={20} className="mr-2 text-yellow-400" />
                            Lakukan Pembayaran
                        </h4>
                        {renderPaymentAction()}
                    </div>
                )}
            </motion.div>

            {((currentPayment?.transaction_status || data.status) === "settlement") && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-2xl border border-green-400/20 p-6 lg:p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Award size={24} className="mr-3 text-green-400" />
                        Akses File Digital
                    </h3>

                    {productData.digital_files?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {productData.digital_files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="text-center">
                                        <p className="text-white font-medium mb-2">{file.description}</p>
                                        <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-300 mb-3 inline-block">
                                            {file.extension.toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(file.file_url, `${file.description}.${file.extension}`)}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            Tidak ada file digital yang tersedia
                        </div>
                    )}
                </motion.div>

            )}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/20 flex items-start gap-4"
            >
                <AlertCircle size={24} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-white font-semibold mb-2">
                        Informasi Penting
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        File digital akan tersedia untuk diunduh setelah pembayaran berhasil diverifikasi. Anda akan mendapatkan akses download selamanya.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentDetailSection;