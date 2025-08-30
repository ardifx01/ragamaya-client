"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { Loader2, Search, Filter, RefreshCw, Wallet, ArrowUpRightFromSquare } from 'lucide-react';
import {Button, useDisclosure} from '@heroui/react';
import RequestAPI from '@/helper/http';
import MyModal from "@/components/ui/modal/MyModal";
import WithdraModal from "@/components/Dashboard/wallet/WithdraModal";

// --- INTERFACES ---
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

interface PayoutHistoryItem {
    uuid: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    bank_name: string;
    bank_account: string;
    bank_account_name: string;
    created_at: string;
}


// --- FUNGSI FETCH DATA ---
const fetchWalletHistory = async (): Promise<WalletHistoryItem[]> => {
    try {
        const response = await RequestAPI('/wallet/history', 'get');
        return response.body || [];
    } catch (error) {
        console.error("Failed to fetch wallet history:", error);
        return [];
    }
};

const fetchWalletInfo = async (): Promise<WalletInfo | null> => {
    try {
        const response = await RequestAPI('/wallet/info', 'get');
        return response.body || null;
    } catch (error) {
        console.error("Failed to fetch wallet info:", error);
        return null;
    }
};

const fetchPayoutHistory = async (): Promise<PayoutHistoryItem[]> => {
    try {
        const response = await RequestAPI('/wallet/payout/history', 'get');
        return response.body || [];
    } catch (error) {
        console.error("Failed to fetch payout history:", error);
        return [];
    }
};


// --- DEFINISI COLUMN HELPER ---
const walletColumnHelper = createColumnHelper<WalletHistoryItem>();
const payoutColumnHelper = createColumnHelper<PayoutHistoryItem>();


const WalletPage: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState<'wallet' | 'payout'>('wallet');
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [walletInfoLoading, setWalletInfoLoading] = useState(true);
    const [originalHistory, setOriginalHistory] = useState<WalletHistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<WalletHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
    const [filteredPayoutHistory, setFilteredPayoutHistory] = useState<PayoutHistoryItem[]>([]);
    const [payoutLoading, setPayoutLoading] = useState(true);
    const [payoutStatusFilter, setPayoutStatusFilter] = useState('all');
    const [payoutSearchQuery, setPayoutSearchQuery] = useState('');

    // Modal
    const modalRequestPayout = useDisclosure()


    // --- DEFINISI KOLOM TABEL ---
    const walletColumns = useMemo(() => [
        walletColumnHelper.accessor('created_at', {
            header: 'Tanggal',
            cell: info => {
                const date = new Date(info.getValue());
                return (
                    <div>
                        <div className="font-medium text-white">{date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        <div className="text-xs text-zinc-400">{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                );
            },
        }),
        walletColumnHelper.accessor('type', {
            header: 'Tipe',
            cell: info => {
                const type = info.getValue();
                const isDebit = type === 'debit';
                const style = isDebit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400';
                return <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>{isDebit ? 'Pemasukan' : 'Penarikan'}</div>;
            },
        }),
        walletColumnHelper.accessor('amount', {
            header: 'Jumlah',
            cell: info => {
                const isDebit = info.row.original.type === 'debit';
                return <div className={`font-semibold ${isDebit ? 'text-emerald-400' : 'text-red-400'}`}>{isDebit ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(info.getValue())}</div>;
            },
        }),
        walletColumnHelper.accessor(row => ({ note: row.note, reference: row.reference }), {
            id: 'details',
            header: 'Keterangan',
            cell: info => (
                <div>
                    <div className="font-medium text-white max-w-xs truncate">{info.getValue().note}</div>
                    <div className="text-xs text-zinc-500 font-mono">{info.getValue().reference}</div>
                </div>
            ),
        }),
    ], []);

    const payoutColumns = useMemo(() => [
        payoutColumnHelper.accessor('created_at', {
            header: 'Tanggal Pengajuan',
            cell: info => {
                const date = new Date(info.getValue());
                return (
                    <div>
                        <div className="font-medium text-white">{date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        <div className="text-xs text-zinc-400">{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                );
            }
        }),
        payoutColumnHelper.accessor('amount', {
            header: 'Jumlah Penarikan',
            cell: info => <div className="font-semibold text-red-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(info.getValue())}</div>
        }),
        payoutColumnHelper.accessor('status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                let style = '';
                switch(status) {
                    case 'success': style = 'bg-green-500/10 text-green-400'; break;
                    case 'pending': style = 'bg-yellow-500/10 text-yellow-400'; break;
                    case 'failed': style = 'bg-red-500/10 text-red-400'; break;
                }
                return <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>{status}</div>;
            }
        }),
        payoutColumnHelper.accessor(row => ({ name: row.bank_account_name, bank: row.bank_name, account: row.bank_account }), {
            id: 'bankInfo',
            header: 'Info Bank',
            cell: info => (
                <div>
                    <div className="font-medium text-white">{info.getValue().name}</div>
                    <div className="text-xs text-zinc-400 uppercase">{info.getValue().bank} - {info.getValue().account}</div>
                </div>
            )
        })
    ], []);


    // --- INSTANCE TABEL ---
    const walletTable = useReactTable({ data: filteredHistory, columns: walletColumns, getCoreRowModel: getCoreRowModel() });
    const payoutTable = useReactTable({ data: filteredPayoutHistory, columns: payoutColumns, getCoreRowModel: getCoreRowModel() });


    // --- LOGIKA DATA FETCHING & FILTER ---
    const loadInitialData = useCallback(async () => {
        setWalletInfoLoading(true);
        setHistoryLoading(true);
        await Promise.all([
            fetchWalletInfo().then(data => setWalletInfo(data)),
            fetchWalletHistory().then(data => setOriginalHistory(data))
        ]);
        setWalletInfoLoading(false);
        setHistoryLoading(false);
    }, []);

    // ✅ PERBAIKAN: Fungsi loadPayoutData diubah agar selalu fetch data baru
    const loadPayoutData = useCallback(async () => {
        setPayoutLoading(true);
        const data = await fetchPayoutHistory();
        setPayoutHistory(data);
        setPayoutLoading(false);
    }, []); // Dependensi dikosongkan agar fungsi tidak dibuat ulang

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        // Hanya panggil saat tab diaktifkan PERTAMA KALI
        if (activeTab === 'payout' && payoutHistory.length === 0) {
            loadPayoutData();
        }
    }, [activeTab, loadPayoutData, payoutHistory.length]);

    // Filter untuk Riwayat Saldo
    useEffect(() => {
        let data = [...originalHistory];
        if (typeFilter !== 'all') data = data.filter(item => item.type === typeFilter);
        if (searchQuery) data = data.filter(item => item.note.toLowerCase().includes(searchQuery.toLowerCase()) || item.reference.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredHistory(data);
    }, [originalHistory, typeFilter, searchQuery]);

    // Filter untuk Riwayat Penarikan
    useEffect(() => {
        let data = [...payoutHistory];
        if (payoutStatusFilter !== 'all') data = data.filter(item => item.status === payoutStatusFilter);
        if (payoutSearchQuery) data = data.filter(item => item.bank_account_name.toLowerCase().includes(payoutSearchQuery.toLowerCase()) || item.bank_account.includes(payoutSearchQuery));
        setFilteredPayoutHistory(data);
    }, [payoutHistory, payoutStatusFilter, payoutSearchQuery]);


    const handleWithdraw = () => {
        modalRequestPayout.onOpen()
    };

    // ✅ Perbaikan dasar
    const handleIsSubmittedPayout = React.useCallback(() => {
        setActiveTab('payout');
        loadInitialData();
        loadPayoutData();
    }, [fetchWalletInfo, fetchWalletHistory, fetchPayoutHistory]);


    // --- RENDER ---
    return <>
        <div className="min-h-screen bg-black text-zinc-300 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Dompet Saya</h1>
                    <p className="text-zinc-400 mt-1">Lihat total saldo dan riwayat transaksi Anda.</p>
                </header>

                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3"><Wallet className="w-6 h-6 text-emerald-400"/><h2 className="text-lg font-semibold text-zinc-300">Total Saldo</h2></div>
                        <Button color='primary' size='sm' onPress={handleWithdraw}><ArrowUpRightFromSquare className="w-4 h-4 mr-2" />Withdraw</Button>
                    </div>
                    {walletInfoLoading ? <div className="mt-4 h-10 w-48 bg-zinc-800 rounded-md animate-pulse"></div> : <p className="text-4xl font-bold text-white mt-3">{walletInfo ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(walletInfo.balance) : 'Gagal memuat'}</p>}
                </div>

                <div className="border-b border-zinc-800 mb-4">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('wallet')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'wallet' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'}`}>Riwayat Saldo</button>
                        <button onClick={() => setActiveTab('payout')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'payout' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'}`}>Riwayat Penarikan</button>
                    </nav>
                </div>

                {activeTab === 'wallet' && (
                    <div className="bg-transparent rounded-lg border border-zinc-900">
                        <div className="p-4 border-b border-zinc-900 flex flex-wrap items-center gap-4">
                            <Button variant="light" size="md" onPress={loadInitialData} disabled={historyLoading} isIconOnly className="border-zinc-800 text-zinc-400 hover:text-white"><RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} /></Button>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full sm:w-auto bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="all">Semua Tipe</option><option value="debit">Pemasukan</option><option value="credit">Penarikan</option>
                                </select>
                            </div>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari berdasarkan keterangan..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
                            </div>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead>{walletTable.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead><tbody>{historyLoading ? (<tr><td colSpan={walletColumns.length} className="text-center p-16"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></td></tr>) : walletTable.getRowModel().rows.length === 0 ? (<tr><td colSpan={walletColumns.length} className="text-center p-16"><h3 className="text-lg font-semibold">Riwayat Tidak Ditemukan</h3></td></tr>) : (walletTable.getRowModel().rows.map(row => <tr key={row.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">{row.getVisibleCells().map(cell => <td key={cell.id} className="px-6 py-4 whitespace-nowrap align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>))}</tbody></table></div>
                    </div>
                )}

                {activeTab === 'payout' && (
                    <div className="bg-transparent rounded-lg border border-zinc-900">
                        <div className="p-4 border-b border-zinc-900 flex flex-wrap items-center gap-4">
                            <Button variant="light" size="md" onPress={loadPayoutData} disabled={payoutLoading} isIconOnly className="border-zinc-800 text-zinc-400 hover:text-white"><RefreshCw className={`w-4 h-4 ${payoutLoading ? 'animate-spin' : ''}`} /></Button>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <select value={payoutStatusFilter} onChange={e => setPayoutStatusFilter(e.target.value)} className="w-full sm:w-auto bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="all">Semua Status</option><option value="pending">Pending</option><option value="success">Success</option><option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input type="text" value={payoutSearchQuery} onChange={e => setPayoutSearchQuery(e.target.value)} placeholder="Cari nama atau nomor rekening..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
                            </div>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead>{payoutTable.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead><tbody>{payoutLoading ? (<tr><td colSpan={payoutColumns.length} className="text-center p-16"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></td></tr>) : payoutTable.getRowModel().rows.length === 0 ? (<tr><td colSpan={payoutColumns.length} className="text-center p-16"><h3 className="text-lg font-semibold">Riwayat Penarikan Tidak Ditemukan</h3></td></tr>) : (payoutTable.getRowModel().rows.map(row => <tr key={row.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">{row.getVisibleCells().map(cell => <td key={cell.id} className="px-6 py-4 whitespace-nowrap align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>))}</tbody></table></div>
                    </div>
                )}

            </div>
        </div>
        <WithdraModal
            isSubmitted={handleIsSubmittedPayout}
            totalBalance={walletInfo?.balance ?? 0}
            isOpen={modalRequestPayout.isOpen}
            onOpen={modalRequestPayout.onOpen}
            onOpenChange={modalRequestPayout.onOpen}
            onClose={modalRequestPayout.onClose}
        />
    </>;
};

export default WalletPage;