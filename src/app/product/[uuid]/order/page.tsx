'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { addToast } from '@heroui/react';
import { Store, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Loading from '@/components/Loading';
import RequestAPI from '@/helper/http';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import OrderDetails from '@/components/Order/OrderDetails';
import OrderSummary from '@/components/Order/OrderSummary';

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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Mobile Timer */}
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
                        <OrderDetails
                            orderData={prevData}
                            selectedPayment={selectedPayment}
                            onPaymentChange={setSelectedPayment}
                        />
                        
                        <OrderSummary
                            orderData={prevData}
                            timeLeft={timeLeft}
                            isOrdering={isOrdering}
                            onOrder={handleOrder}
                            onBack={() => router.back()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;