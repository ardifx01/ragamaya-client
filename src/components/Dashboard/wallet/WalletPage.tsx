"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { Loader2, Search, Filter, RefreshCw, Wallet, ArrowUpRightFromSquare } from 'lucide-react';
import { Button } from '@heroui/react';
import RequestAPI from '@/helper/http';

// --- INTERFACE (Tidak ada perubahan) ---
interface WalletHistoryItem {
    amount: number;
    type: 'debit' | 'credit';
    reference: string;
    note: string;
    created_at: string;
}

interface WalletInfo {
    balance: number;
    currency: string;
}

// ✅ FUNGSI FETCH DISEDERHANAKAN (TIDAK PERLU PARAMETER)
const fetchWalletHistory = async (): Promise<WalletHistoryItem[]> => {
    console.log(`Fetching ALL wallet history from API...`);
    try {
        // Panggil API tanpa parameter untuk mendapatkan semua riwayat
        const response = await RequestAPI('/wallet/history', 'get');
        return response.body || [];
    } catch (error) {
        console.error("Failed to fetch wallet history:", error);
        return [];
    }
};

const fetchWalletInfo = async (): Promise<WalletInfo | null> => {
    console.log(`Fetching wallet info from API...`);
    try {
        const response = await RequestAPI('/wallet/info', 'get');
        return response.body || null;
    } catch (error) {
        console.error("Failed to fetch wallet info:", error);
        return null;
    }
};

const columnHelper = createColumnHelper<WalletHistoryItem>();

const WalletPage: React.FC = () => {
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [walletInfoLoading, setWalletInfoLoading] = useState<boolean>(true);

    const [originalHistory, setOriginalHistory] = useState<WalletHistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<WalletHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState<boolean>(true);

    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = useMemo(() => [
        // ... Definisi kolom tidak berubah ...
        columnHelper.accessor('created_at', {
            header: 'Tanggal',
            cell: info => {
                const date = new Date(info.getValue());
                const formattedDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                return (
                    <div>
                        <div className="font-medium text-white">{formattedDate}</div>
                        <div className="text-xs text-zinc-400">{formattedTime}</div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('type', {
            header: 'Tipe',
            cell: info => {
                const type = info.getValue();
                const isDebit = type === 'debit';
                const colorClass = isDebit
                    ? 'bg-green-500/10 text-green-400 ring-green-500/20'
                    : 'bg-red-500/10 text-red-400 ring-red-500/20';
                return (
                    <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colorClass} ring-1 ring-inset`}>
                        {isDebit ? 'Pemasukan' : 'Penarikan'}
                    </div>
                );
            },
        }),
        columnHelper.accessor('amount', {
            header: 'Jumlah',
            cell: info => {
                const amount = info.getValue();
                const isDebit = info.row.original.type === 'debit';
                const formattedAmount = `Rp ${amount.toLocaleString('id-ID')}`;
                const textColor = isDebit ? 'text-emerald-400' : 'text-red-400';
                return (
                    <div className={`font-semibold ${textColor}`}>
                        {isDebit ? '+' : '-'} {formattedAmount}
                    </div>
                );
            },
        }),
        columnHelper.accessor(row => ({ note: row.note, reference: row.reference }), {
            id: 'details',
            header: 'Keterangan',
            cell: info => {
                const { note, reference } = info.getValue();
                return (
                    <div>
                        <div className="font-medium text-white max-w-xs truncate">{note}</div>
                        <div className="text-xs text-zinc-500 font-mono">{reference}</div>
                    </div>
                );
            },
        }),
    ], []);

    const table = useReactTable({
        data: filteredHistory,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // ✅ useCallback tidak lagi bergantung pada typeFilter
    const loadData = useCallback(async () => {
        setHistoryLoading(true);
        setWalletInfoLoading(true);

        await Promise.all([
            (async () => {
                const info = await fetchWalletInfo();
                setWalletInfo(info);
                setWalletInfoLoading(false);
            })(),
            (async () => {
                const history = await fetchWalletHistory(); // Memanggil fungsi tanpa parameter
                setOriginalHistory(history);
                setHistoryLoading(false);
            })()
        ]);
    }, []); // Dependensi dikosongkan

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ✅ Efek untuk semua filter CLIENT-SIDE (tipe dan pencarian)
    useEffect(() => {
        let processedData = [...originalHistory];

        // Langkah 1: Terapkan filter tipe
        if (typeFilter !== 'all') {
            processedData = processedData.filter(item => item.type === typeFilter);
        }

        // Langkah 2: Terapkan filter pencarian pada data yang sudah difilter tipe
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            processedData = processedData.filter(item =>
                item.note.toLowerCase().includes(lowercasedQuery) ||
                item.reference.toLowerCase().includes(lowercasedQuery)
            );
        }

        setFilteredHistory(processedData);
    }, [originalHistory, typeFilter, searchQuery]); // Dijalankan jika salah satu dari ini berubah

    const handleWithdraw = () => {
        console.log("Tombol Withdraw ditekan.");
    };

    return (
        <div className="min-h-screen bg-black text-zinc-300 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dompet Saya</h1>
                        <p className="text-zinc-400 mt-1">Lihat total saldo dan riwayat transaksi Anda.</p>
                    </div>
                </header>

                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-6 h-6 text-emerald-400"/>
                            <h2 className="text-lg font-semibold text-zinc-300">Total Saldo</h2>
                        </div>
                        <Button
                            color='primary'
                            size='sm'
                            onPress={handleWithdraw}
                        >
                            <ArrowUpRightFromSquare className="w-4 h-4 mr-2" />
                            Withdraw
                        </Button>
                    </div>

                    {walletInfoLoading ? (
                        <div className="mt-4 h-10 w-48 bg-zinc-800 rounded-md animate-pulse"></div>
                    ) : (
                        <p className="text-4xl font-bold text-white mt-3">
                            {walletInfo ? `Rp ${walletInfo.balance.toLocaleString('id-ID')}` : 'Gagal memuat'}
                        </p>
                    )}
                </div>

                <div className="bg-transparent rounded-lg border border-zinc-900">
                    <div className="p-4 border-b border-zinc-900 flex flex-wrap items-center gap-4">
                        <Button
                            variant="light"
                            size="md"
                            onPress={loadData}
                            disabled={historyLoading || walletInfoLoading}
                            isIconOnly
                            className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                        >
                            <RefreshCw className={`w-4 h-4 ${(historyLoading || walletInfoLoading) ? 'animate-spin' : ''}`} />
                        </Button>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                            <select
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                className="w-full sm:w-auto bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                            >
                                <option value="all">Semua Tipe</option>
                                <option value="debit">Pemasukan</option>
                                <option value="credit">Penarikan</option>
                            </select>
                        </div>
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari berdasarkan keterangan atau referensi..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
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
                            {historyLoading ? (
                                <tr><td colSpan={columns.length} className="text-center p-16"><Loader2 className="w-8 h-8 animate-spin text-zinc-500 mx-auto" /></td></tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr><td colSpan={columns.length} className="text-center p-16"><h3 className="text-lg font-semibold text-zinc-400">Riwayat Tidak Ditemukan</h3><p className="text-zinc-500 mt-1 text-sm">{searchQuery || typeFilter !== 'all' ? 'Tidak ada data yang cocok dengan filter Anda.' : 'Belum ada riwayat transaksi.'}</p></td></tr>
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

export default WalletPage;