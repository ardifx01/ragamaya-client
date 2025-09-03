'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToast } from '@heroui/react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Loading from '@/components/Loading';
import RequestAPI from '@/helper/http';
import CountdownTimer from '@/components/CountdownTimer';
import PaymentDetailSection from '@/components/Payments/PaymentDetailSection';
import PaymentProgressBar from '@/components/Payments/PaymentProgressBar';
import PaymentStatusBanner from '@/components/Payments/PaymentStatusBanner';
import { BASE_API } from '@/lib/environtment';

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const isLoggedIn = Cookies.get('access_token');

    const [orderData, setOrderData] = useState(null);
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const orderResponse = await RequestAPI(`/order/${params.uuid}`, 'get');
            setOrderData(orderResponse.body);

            if (orderResponse.body?.product_uuid) {
                const productResponse = await RequestAPI(`/product/${orderResponse.body.product_uuid}`, 'get');
                setProductData(productResponse.body);
                
                setOrderData(prev => ({
                    ...prev,
                    product: productResponse.body
                }));
            }
        } catch (error) {
            console.error(error);
            addToast({
                title: "Gagal memuat data",
                description: error.message || "Terjadi kesalahan saat memuat data pembayaran.",
                color: "danger"
            });
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSSEInfo = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "info") {
            setOrderData(prev => ({
                ...prev,
                ...data.body,
                product: prev?.product || productData
            }));
        }
    };

    const streamInfo = () => {
        try {
            const eventSource = new EventSource(
                BASE_API + `/order/stream?id=${params.uuid}&authorization=${Cookies.get('access_token')}`
            );
            eventSource.onmessage = (event) => {
                handleSSEInfo(event);
            };
            eventSource.onerror = () => {
                console.log("SSE connection error");
            };
            return eventSource;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
            return;
        }

        fetchData();
        const eventSource = streamInfo();

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("SSE disconnected");
            }
        };
    }, [params.uuid, isLoggedIn]);

    if (isLoading) {
        return <Loading />;
    }

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto px-6"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <AlertCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Data Pembayaran Tidak Ditemukan</h2>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                        Terjadi kesalahan saat memuat data pembayaran Anda
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300"
                    >
                        Kembali ke Beranda
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <PaymentStatusBanner status={orderData.status} />
            <div className="relative z-10 pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <PaymentProgressBar status={orderData.status} />
                        </motion.div>
                        {(orderData.transaction_status === "pending" || orderData.status === "pending") && orderData.expiry_time && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="lg:block"
                            >
                                <CountdownTimer expiryTime={orderData.expiry_time} />
                            </motion.div>
                        )}
                        <PaymentDetailSection data={orderData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;