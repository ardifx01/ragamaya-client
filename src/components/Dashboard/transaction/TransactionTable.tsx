"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
// --- Impor ikon RefreshCw ---
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { Button, Image } from '@heroui/react';
import RequestAPI from '@/helper/http';

// --- INTERFACE (Tidak ada perubahan) ---
interface User { uuid: string; name: string; avatar_url: string; }
interface Thumbnail { thumbnail_url: string; }
interface Product { uuid: string; name: string; price: number; description: string; thumbnails: Thumbnail[]; }
interface Transaction { uuid: string; price: number; quantity: number; amount: number; status: 'pending' | 'settlement' | 'failed'; product: Product; user: User; }
interface ApiResponse { status: number; message: string; body: Transaction[]; }

const fetchData = async (status: string): Promise<ApiResponse> => {
    console.log(`Fetching transaction data for status: ${status}...`);
    try {
        const params = status === 'all' ? {} : { status };
        return await RequestAPI('/seller/order', 'get', params);
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return { status: 500, message: "Failed to fetch data", body: [] };
    }
};

const columnHelper = createColumnHelper<Transaction>();

const TransactionTable: React.FC = () => {
    const [originalData, setOriginalData] = useState<Transaction[]>([]);
    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = useMemo(() => [
        columnHelper.accessor(
            (row) => ({ user: row.user, uuid: row.uuid }),
            {
                id: 'pembeliInfo',
                header: 'Info Pembeli',

                cell: info => {
                    const { user, uuid } = info.getValue();
                    return (
                        <div className="flex items-center gap-4">
                            <Image
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-10 w-10 flex-shrink-0 rounded-full object-cover bg-zinc-800"
                            />
                            <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-xs text-zinc-400 font-mono mt-1">ID Transaksi: {uuid}</div>
                            </div>
                        </div>
                    );
                },
            }
        ),
        columnHelper.accessor('product', {
            id: 'product', header: 'Produk', cell: info => {
                const product = info.getValue();
                const thumbnail = product.thumbnails[0]?.thumbnail_url || '';
                return (<div className="flex items-center gap-4"><Image src={thumbnail} alt={product.name} className="h-11 w-11 rounded-lg object-cover bg-zinc-800 flex-shrink-0" /><div><div className="font-semibold text-white">{product.name}</div><div className="text-xs text-zinc-400 mt-1 truncate max-w-xs">{product.description}</div></div></div>);
            },
        }),
        columnHelper.accessor(row => row.product.price, {
            id: 'productPrice', header: 'Harga Produk', cell: info => {
                const price = info.getValue() || 0;
                return (<div className="font-semibold text-orange-400">Rp {price.toLocaleString('id-ID')}</div>);
            },
        }),
        columnHelper.accessor('quantity', {header: 'Jumlah', cell: info => <div className="text-center">{info.getValue()}</div> }),
        columnHelper.accessor('amount', { header: 'Total Harga', cell: info => <div className="font-semibold text-emerald-400">Rp {info.getValue().toLocaleString('id-ID')}</div> }),
        columnHelper.accessor('status', {
            id: 'status', header: 'Status', cell: info => {
                const status = info.getValue();
                let statusColor = '', statusText: string = status;
                switch (status) {
                    case 'settlement': statusColor = 'bg-green-500/10 text-green-400 ring-green-500/20'; statusText = 'success'; break;
                    case 'pending': statusColor = 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20'; break;
                    case 'failed': statusColor = 'bg-red-500/10 text-red-400 ring-red-500/20'; break;
                    default: statusColor = 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20';
                }
                return (<div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor} ring-1 ring-inset`}>{statusText}</div>);
            },
        }),
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // --- FUNGSI LOAD DATA DIBUAT DENGAN useCallback ---
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchData(statusFilter);
            setOriginalData(result.body || []);
        } catch (error) {
            console.error('Error in loadData:', error);
            setOriginalData([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]); // Dijalankan ulang jika statusFilter berubah

    // Effect untuk memuat data saat pertama kali atau saat fungsi loadData berubah
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Effect untuk filter client-side (tidak berubah)
    useEffect(() => {
        if (!searchQuery) {
            setFilteredData(originalData);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = originalData.filter(transaction =>
                transaction.product.name.toLowerCase().includes(lowercasedQuery) ||
                transaction.user.name.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, originalData]);


    return (
        <div className="min-h-screen bg-black text-zinc-300 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Daftar Transaksi</h1>
                        <p className="text-zinc-400 mt-1">Lihat dan filter semua transaksi yang masuk.</p>
                    </div>
                </header>
                <div className="bg-transparent rounded-lg border border-zinc-900">
                    <div className="p-4 border-b border-zinc-900 flex flex-wrap items-center gap-4">
                        {/* --- TOMBOL REFRESH BARU --- */}
                        <Button
                            variant="light"
                            size="md"
                            onPress={loadData} // Memanggil fungsi loadData
                            disabled={loading} // Nonaktif saat sedang loading
                            isIconOnly
                            className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        {/* --- FILTER STATUS --- */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={e => {
                                    setStatusFilter(e.target.value);
                                    setSearchQuery('');
                                }}
                                className="w-full sm:w-auto bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">Pending</option>
                                {/* Perbaikan: value harus sesuai data, yaitu 'settlement' */}
                                <option value="settlement">Success</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        {/* --- SEARCH BAR --- */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari nama produk atau pengguna..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            {/* ... sisa kode tabel tidak berubah ... */}
                            <thead className="border-b border-zinc-900">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan={columns.length} className="text-center p-16"><Loader2 className="w-8 h-8 animate-spin text-zinc-500 mx-auto" /></td></tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr><td colSpan={columns.length} className="text-center p-16"><h3 className="text-lg font-semibold text-zinc-400">Transaksi Tidak Ditemukan</h3><p className="text-zinc-500 mt-1 text-sm">{searchQuery ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Tidak ada data untuk filter status yang dipilih.'}</p></td></tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors duration-150">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                        ))}
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;