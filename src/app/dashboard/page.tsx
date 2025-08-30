"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { DollarSign, ShoppingCart, Package, Loader2, AlertCircle } from 'lucide-react';
// Impor helper API Anda
import RequestAPI from '@/helper/http';
import Sidebar from "@/components/ui/sidebar/Sidebar";

// Registrasi komponen Chart.js yang akan digunakan
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Tipe data untuk Analytics
interface MonthlyRevenue {
    month: string;
    revenue: number;
    currency: string;
}

interface MonthlyOrders {
    month: string;
    total_orders: number;
}

interface AnalyticsData {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    total_revenue_currency: string;
    monthly_revenue: MonthlyRevenue[];
    monthly_orders: MonthlyOrders[];
}

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ Mengambil data dari API /seller/analytics
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await RequestAPI('/seller/analytics', 'get');
                if (response && response.body) {
                    setAnalyticsData(response.body);
                } else {
                    throw new Error("Data analitik tidak ditemukan");
                }
            } catch (err: any) {
                console.error("Gagal mengambil data analitik:", err);
                setError("Tidak dapat memuat data. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mengolah data untuk chart pendapatan bulanan
    const revenueChartData = useMemo(() => {
        if (!analyticsData) return { labels: [], datasets: [] };

        const labels = analyticsData.monthly_revenue.map(item =>
            new Date(item.month).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        );
        const data = analyticsData.monthly_revenue.map(item => item.revenue);

        return {
            labels,
            datasets: [{
                label: 'Pendapatan',
                data,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }]
        };
    }, [analyticsData]);

    // Mengolah data untuk chart pesanan bulanan
    const ordersChartData = useMemo(() => {
        if (!analyticsData) return { labels: [], datasets: [] };

        const labels = analyticsData.monthly_orders.map(item =>
            new Date(item.month).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        );
        const data = analyticsData.monthly_orders.map(item => item.total_orders);

        return {
            labels,
            datasets: [{
                label: 'Total Pesanan',
                data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            }]
        };
    }, [analyticsData]);

    // Opsi konfigurasi untuk chart
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#e5e7eb' }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    // Tampilan saat loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-zinc-300">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    // Tampilan saat terjadi error
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-zinc-300 text-white">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h2>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <Sidebar activeLink="Dashboard">
                <div className="bg-black text-zinc-300 p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold">Dashboard Analitik Toko</h1>
                            <p className="text-gray-400 mt-1">Ringkasan performa toko Anda.</p>
                        </header>

                        {/* Kartu Statistik */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total Pendapatan */}
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-lg"><DollarSign
                                    className="w-6 h-6 text-green-400"/></div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Pendapatan</p>
                                    <p className="text-2xl font-bold">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0
                                        }).format(analyticsData?.total_revenue || 0)}
                                    </p>
                                </div>
                            </div>
                            {/* Total Pesanan */}
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex items-start gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-lg"><ShoppingCart
                                    className="w-6 h-6 text-blue-400"/></div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Pesanan</p>
                                    <p className="text-2xl font-bold">{analyticsData?.total_orders.toLocaleString('id-ID')} Pesanan</p>
                                </div>
                            </div>
                            {/* Total Produk */}
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex items-start gap-4">
                                <div className="bg-yellow-500/10 p-3 rounded-lg"><Package
                                    className="w-6 h-6 text-yellow-400"/></div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Produk</p>
                                    <p className="text-2xl font-bold">{analyticsData?.total_products.toLocaleString('id-ID')} Produk</p>
                                </div>
                            </div>
                        </div>

                        {/* Grafik Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Grafik Pendapatan Bulanan */}
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold mb-4">Pendapatan Bulanan</h2>
                                <Line options={chartOptions} data={revenueChartData}/>
                            </div>

                            {/* Grafik Pesanan Bulanan */}
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold mb-4">Pesanan Bulanan</h2>
                                <Line options={chartOptions} data={ordersChartData}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
};

export default AnalyticsDashboard;