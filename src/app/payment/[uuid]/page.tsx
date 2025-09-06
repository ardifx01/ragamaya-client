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
    const [sseRetryCount, setSseRetryCount] = useState(0);
    const [pollingInterval, setPollingInterval] = useState(null);
    const MAX_RETRY_COUNT = 3;

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

    const checkPaymentStatus = async () => {
        try {
            console.log('Polling payment status...');
            const orderResponse = await RequestAPI(`/order/${params.uuid}`, 'get');
            const currentStatus = orderResponse.body.status;
            
            console.log('Polling result - status:', currentStatus);
    
            if (orderResponse.body?.product_uuid) {
                const productResponse = await RequestAPI(`/product/${orderResponse.body.product_uuid}`, 'get');
                setProductData(productResponse.body);
                
                setOrderData(prev => ({
                    ...prev,
                    ...orderResponse.body,
                    product: productResponse.body
                }));
            } else {
                setOrderData(orderResponse.body);
            }

            if (currentStatus === 'settlement' || currentStatus === 'expire') {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                    console.log('Polling stopped - status:', currentStatus);
                }
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    };

    const handleSSEInfo = (event) => {
        const data = JSON.parse(event.data);
        console.log('SSE Data received:', data);
        
        if (data.type === "info") {
            setOrderData(prev => {
                let updatedPayments = prev?.payments || [];
                
                if (data.body.status && updatedPayments.length > 0) {
                    updatedPayments = updatedPayments.map(payment => ({
                        ...payment,
                        transaction_status: data.body.status === 'settlement' ? 'settlement' : 
                                          data.body.status === 'expire' ? 'expire' : 
                                          payment.transaction_status
                    }));
                }

                const updated = {
                    ...prev,
                    ...data.body,
                    payments: updatedPayments,
                    product: prev?.product || productData
                };
                
                console.log('Order data updated via SSE:', updated);
                console.log('New status:', updated.status);
                
                if ((updated.status === 'settlement' || updated.status === 'expire') && pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                    console.log('Polling stopped due to SSE update');
                }
                
                return updated;
            });
        }
    };

    const streamInfo = () => {
        try {
            const eventSource = new EventSource(
                BASE_API + `/order/stream?id=${params.uuid}&authorization=${Cookies.get('access_token')}`
            );
            
            eventSource.onopen = () => {
                console.log("SSE connection opened");
                setSseRetryCount(0);
            };
            
            eventSource.onmessage = (event) => {
                handleSSEInfo(event);
            };
            
            eventSource.onerror = (error) => {
                console.log("SSE connection error:", error);
                eventSource.close();
                
                if (sseRetryCount < MAX_RETRY_COUNT) {
                    setTimeout(() => {
                        console.log(`Retrying SSE connection (${sseRetryCount + 1}/${MAX_RETRY_COUNT})`);
                        setSseRetryCount(prev => prev + 1);
                        streamInfo();
                    }, 2000 * (sseRetryCount + 1));
                } else {
                    console.log("Max SSE retry count reached, using polling only");
                    if (!pollingInterval) {
                        const interval = setInterval(checkPaymentStatus, 5000);
                        setPollingInterval(interval);
                    }
                }
            };
            
            return eventSource;
        } catch (err) {
            console.error("Failed to create SSE connection:", err);
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

        const startPolling = () => {
            if (!pollingInterval) {
                const interval = setInterval(checkPaymentStatus, 10000); // Every 10 seconds
                setPollingInterval(interval);
                console.log('Polling started as safety measure');
            }
        };

        const pollingTimeout = setTimeout(startPolling, 3000);

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("SSE disconnected");
            }
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
            if (pollingTimeout) {
                clearTimeout(pollingTimeout);
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
                        {(orderData.status === "pending") && orderData.expiry_time && (
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