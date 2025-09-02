'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Image, addToast } from '@heroui/react';
import {
    ShoppingCart,
    FileImage,
    Download,
    Shield,
    Clock,
    Palette,
    Star,
    CheckCircle,
    Store,
    ChevronRight,
    AlertCircle,
    Zap,
    Award,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import Loading from '@/components/Loading';
import RequestAPI from '@/helper/http';
import PaymentOptions from '@/components/Payments/PaymentOptions';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import Link from 'next/link';

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

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isLoggedIn = Cookies.get('access_token');

    const [prevData, setPrevData] = useState<OrderData | null>(null);
    const [product, setProduct] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrdering, setIsOrdering] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);

    const secdat = searchParams.get('secdat');

    const parseSecdat = async () => {
        try {
            if (!secdat) {
                router.push(`/product/${params.uuid}`);
                return;
            }

            const jsonString = atob(secdat);
            const data = JSON.parse(jsonString);
            if (data) {
                setPrevData(data);
            }
        } catch (err) {
            addToast({
                title: "Terjadi kesalahan",
                description: "Data pesanan tidak valid, silakan coba lagi.",
                color: "danger"
            });
            console.error(err);
            router.push(`/product/${params.uuid}`);
        }
    };

    const fetchData = async () => {
        try {
            const data = await RequestAPI(`/product/${params.uuid}`, 'get');
            setProduct(data.body);
        } catch (error) {
            console.error(error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
            return;
        }

        parseSecdat();
        fetchData();
    }, [params.uuid, secdat, isLoggedIn]);

    useEffect(() => {
        if (timeLeft <= 0) {
            addToast({
                title: "Waktu Habis",
                description: "Waktu pembayaran telah berakhir, silakan ulangi proses pemesanan.",
                color: "danger"
            });
            router.push(`/product/${params.uuid}`);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, params.uuid, router]);

    const handleOrder = async () => {
        if (!prevData) {
            addToast({
                title: "Data tidak valid",
                description: "Data pesanan tidak valid, silakan coba lagi.",
                color: "danger"
            });
            return;
        }
        if (!selectedPayment) {
            addToast({
                title: "Pilih metode pembayaran terlebih dahulu",
                description: "Data pesanan tidak valid, silakan coba lagi.",
                color: "danger"
            });
            return;
        }

        try {
            setIsOrdering(true);

            const payload = {
                product_uuid: prevData.product_uuid,
                quantity: prevData.quantity,
            };

            const response = await RequestAPI(`/order/create/${selectedPayment}`, 'post', payload);

            if (response) {
                addToast({
                    title: "Pesanan berhasil dibuat!",
                    description: "Anda akan dialihkan ke halaman pembayaran.",
                    color: "success"
                });
                router.push(`/payment/${response.body.uuid}`);
            }
        } catch (error) {
            console.error(error);
            addToast({
                title: "Gagal membuat pesanan",
                description: error.message || "Terjadi kesalahan saat membuat pesanan, silakan coba lagi.",
                color: "danger"
            });
        } finally {
            setIsOrdering(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!prevData || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto px-6"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <Store size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Data Pesanan Tidak Valid</h2>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                        Terjadi kesalahan saat memuat data pesanan Anda
                    </p>
                    <div className='flex justify-center'>
                        <HoverBorderGradient
                            containerClassName="rounded-xl"
                            as="button"
                            className="bg-black text-white px-8 py-4 font-medium text-center"
                            onClick={() => router.push('/')}
                        >
                            Kembali ke Beranda
                        </HoverBorderGradient>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border-b border-white/10"
            >
                <div className="flex items-center justify-between px-6 py-7">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                scale: timeLeft <= 60 ? [1, 1.1, 1] : 1,
                                color: timeLeft <= 60 ? '#ef4444' : '#f59e0b'
                            }}
                            transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                        >
                            <Clock size={20} />
                        </motion.div>
                        <span className="text-sm font-medium text-gray-300">Waktu Tersisa:</span>
                    </div>
                    <motion.span
                        className={`text-lg font-bold ${timeLeft <= 60 ? 'text-red-400' : 'text-orange-400'}`}
                        animate={{ scale: timeLeft <= 60 ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                    >
                        {formatTime(timeLeft)}
                    </motion.span>
                </div>
            </motion.div>

            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-0">
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mb-8"
                    >
                        <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
                            <Link
                                href="/"
                                className="flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                            >
                                <Store size={18} className="mr-2" />
                                Marketplace
                            </Link>
                            <ChevronRight size={16} className="mx-3 text-gray-500" />
                            <a
                                href={`/product/${params.uuid}`}
                                className="text-sm text-gray-300 hover:text-white transition-colors duration-300 max-w-32 lg:max-w-48 truncate"
                            >
                                {prevData.product_name}
                            </a>
                            <ChevronRight size={16} className="mx-3 text-gray-500" />
                            <span className="text-white text-sm font-medium">Checkout</span>
                        </div>
                    </motion.nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                                src={prevData.thumbnails[0]?.thumbnail_url}
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
                                            <h2 className="text-2xl font-bold text-white mb-3">{prevData.product_name}</h2>
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
                                                        {prevData.product_type === 'digital' ? 'Desain Digital' : 'Produk Fisik'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <Download className="w-5 h-5 text-green-400" />
                                                    <span className="text-gray-300 text-sm">
                                                        {prevData.digital_files.length} File Digital
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <ShoppingCart className="w-5 h-5 text-purple-400" />
                                                    <span className="text-gray-300 text-sm">
                                                        Jumlah: {prevData.quantity} item
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
                                                        Rp {prevData.product_price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Jumlah</span>
                                                    <span className="text-white font-semibold">x{prevData.quantity}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-white/20 pt-3">
                                                    <span className="text-gray-400">Subtotal</span>
                                                    <span className="text-white font-bold text-lg">
                                                        Rp {prevData.total_price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {prevData.digital_files.length > 0 && (
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
                                            {prevData.digital_files.map((file, index) => (
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
                                <PaymentOptions basePrice={prevData.total_price} value={selectedPayment} onChange={setSelectedPayment} />
                            </motion.div>
                        </div>

                        <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
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
                                            Rp {(prevData.product_price * prevData.quantity).toLocaleString('id-ID')}
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
                                            Rp {prevData.total_price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <HoverBorderGradient
                                        containerClassName="rounded-xl w-full"
                                        as="button"
                                        className="bg-black text-white w-full py-4 px-6 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-300"
                                        onClick={handleOrder}
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
                                        onClick={() => router.back()}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;