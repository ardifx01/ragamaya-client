'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, CheckCircle, XCircle, Clock, CreditCard, Calendar, Package, ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import RequestAPI from '@/helper/http';
import { PaymentStatusType } from '@/types/payment_history_type';
import { useRouter } from 'next/navigation';
import { Image } from '@heroui/react';
import { TransactionCardSkeleton } from './PaymentSkeleton';

export type PaymentAction = {
    name: string;
    method: string;
    url: string;
};

export type ProductThumbnail = {
    thumbnail_url: string;
};

export type Product = {
    uuid: string;
    seller_uuid: string;
    product_type: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
    thumbnails: ProductThumbnail[];
};

export type TransactionResponse = {
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
    expiry_time: string;
    created_at: string;
    updated_at: string;
    payment_actions: PaymentAction[];
    product: Product;
};

interface ApiResponse {
    status: number;
    message: string;
    body: TransactionResponse[];
    size: number;
}

const fetchPayments = async (status: PaymentStatusType): Promise<ApiResponse> => {
    return await RequestAPI('/payment/' + status, 'get');
};

const getTransactionStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower === 'settlement') {
        return {
            type: 'success',
            label: 'Berhasil',
            icon: CheckCircle,
            bgColor: 'from-emerald-500/20 to-green-500/20',
            borderColor: 'border-emerald-500/40',
            textColor: 'text-emerald-400'
        };
    }

    if (['deny', 'cancel', 'failure', 'expire'].includes(statusLower)) {
        return {
            type: 'failed',
            label: statusLower === 'deny' ? 'Ditolak' :
                statusLower === 'cancel' ? 'Dibatalkan' :
                    statusLower === 'expire' ? 'Kedaluwarsa' : 'Gagal',
            icon: XCircle,
            bgColor: 'from-red-500/20 to-rose-500/20',
            borderColor: 'border-red-500/40',
            textColor: 'text-red-400'
        };
    }

    return {
        type: 'pending',
        label: 'Menunggu',
        icon: Clock,
        bgColor: 'from-amber-500/20 to-yellow-500/20',
        borderColor: 'border-amber-500/40',
        textColor: 'text-amber-400'
    };
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
};

const Payments = ({ StatusType }: { StatusType: PaymentStatusType }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const router = useRouter();

    const loadTransactions = async (status: PaymentStatusType) => {
        setIsLoading(true);

        try {
            const response = await fetchPayments(status);

            if (response.status === 200) {
                setTransactions(response.body || []);
            } else {
                console.error('Failed to fetch transactions:', response.message);
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionClick = (transaction: TransactionResponse) => {
        const statusInfo = getTransactionStatusInfo(transaction.transaction_status);

        if (statusInfo.type === 'success') {
            router.push('/product/owned');
        } else if (statusInfo.type === 'failed') {
            router.push(`/product/${transaction.product.uuid}`);
        } else if (statusInfo.type === 'pending') {
            router.push(`/payment/${transaction.uuid}`);
        }
    };

    const getActionButtonText = (transaction: TransactionResponse) => {
        const statusInfo = getTransactionStatusInfo(transaction.transaction_status);

        if (statusInfo.type === 'success') {
            return 'Lihat Produk';
        } else if (statusInfo.type === 'failed') {
            return 'Beli Ulang';
        } else if (statusInfo.type === 'pending') {
            return 'Lanjut Bayar';
        }
        return 'Lihat Detail';
    };

    useEffect(() => {
        loadTransactions(StatusType);
    }, [StatusType]);

    return (
        <section className="mt-12 pb-20" aria-label="Riwayat transaksi">
            <div className="max-w-7xl mx-auto px-4">
                {isLoading ? (
                    <TransactionCardSkeleton />
                ) : !transactions || transactions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32"
                    >
                        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                            <SearchX size={60} className="text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Transaksi Tidak Ditemukan</h3>
                        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                            Tidak ada riwayat transaksi yang ditemukan.
                        </p>
                    </motion.div>
                ) : (
                    <div>
                        <div
                            className="grid grid-cols-1 gap-6"
                            role="grid"
                            aria-label="Grid riwayat transaksi"
                        >
                            <AnimatePresence>
                                {transactions.map((transaction, index) => {
                                    const statusInfo = getTransactionStatusInfo(transaction.transaction_status);
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <motion.div
                                            key={transaction.uuid}
                                            layout
                                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                                ease: [0.22, 1, 0.36, 1]
                                            }}
                                            whileHover={{
                                                y: -8,
                                                transition: { duration: 0.3, ease: "easeOut" }
                                            }}
                                            className="group relative"
                                        >
                                            <div
                                                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-500 cursor-pointer group-hover:shadow-2xl group-hover:shadow-white/10"
                                                role="gridcell"
                                                tabIndex={0}
                                            >
                                                <article className="flex flex-col sm:flex-row">
                                                    {/* Product Image */}
                                                    <div className="relative overflow-hidden sm:w-64 flex-shrink-0">
                                                        <div className="aspect-[4/3] sm:aspect-square relative bg-gradient-to-br from-gray-800 to-gray-900">
                                                            <Image
                                                                src={transaction.product.thumbnails[0]?.thumbnail_url}
                                                                alt={`Thumbnail dari ${transaction.product.name}`}
                                                                className="object-cover w-full h-full"
                                                                width={400}
                                                                height={400}
                                                            />

                                                            {/* Status Badge */}
                                                            <div className={`absolute top-4 left-4 z-10 bg-gradient-to-r ${statusInfo.bgColor} backdrop-blur-sm border ${statusInfo.borderColor} rounded-full px-3 py-1.5 flex items-center gap-2`}>
                                                                <StatusIcon size={14} className={statusInfo.textColor} />
                                                                <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                                                                    {statusInfo.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Transaction Details */}
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex-1">
                                                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                                                        {transaction.product.name}
                                                                    </h3>

                                                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                                                                        {transaction.product.description}
                                                                    </p>
                                                                </div>

                                                                <div className="text-right ml-4">
                                                                    <p className="text-2xl font-bold text-white mb-1">
                                                                        {formatCurrency(transaction.gross_amount)}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                                                                        {transaction.currency}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Transaction Info */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                                                <div className="flex items-center gap-3 text-gray-300">
                                                                    <CreditCard size={16} className="text-gray-400" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Metode Pembayaran</p>
                                                                        <p className="text-sm font-medium capitalize">{transaction.payment_type}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 text-gray-300">
                                                                    <Calendar size={16} className="text-gray-400" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tanggal Transaksi</p>
                                                                        <p className="text-sm font-medium">{formatDate(transaction.transaction_time)}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 text-gray-300">
                                                                    <Package size={16} className="text-gray-400" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">ID Transaksi</p>
                                                                        <p className="text-sm font-medium font-mono">{transaction.uuid.slice(0, 8)}...</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 text-gray-300">
                                                                    <div className={`w-4 h-4 rounded-full ${statusInfo.type === 'success' ? 'bg-emerald-500' :
                                                                        statusInfo.type === 'failed' ? 'bg-red-500' :
                                                                            'bg-amber-500'
                                                                        }`} />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                                                        <p className={`text-sm font-medium ${statusInfo.textColor}`}>{statusInfo.label}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="flex justify-end">
                                                            <HoverBorderGradient
                                                                containerClassName="rounded-xl"
                                                                as="button"
                                                                className="bg-black text-white flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm border border-white/20 hover:border-white/40 transition-all duration-300"
                                                                onClick={() => handleActionClick(transaction)}
                                                                aria-label={`${getActionButtonText(transaction)} untuk transaksi ${transaction.product.name}`}
                                                            >
                                                                <span>{getActionButtonText(transaction)}</span>
                                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                                            </HoverBorderGradient>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Payments