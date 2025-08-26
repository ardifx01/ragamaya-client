"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import {Button, Image, useDisclosure} from '@heroui/react';
import {IconCancel, IconEdit, IconTrash} from "@tabler/icons-react";
import RequestAPI from '@/helper/http';
import MyModal from "@/components/ui/modal/MyModal";
import AddProductModal from "@/components/Dashboard/product/AddModal";
import {GetUserData} from "@/lib/GetUserData";

// --- PENYESUAIAN INTERFACE ---
interface Thumbnail { thumbnail_url: string; }
interface DigitalFile { file_url: string; description: string; extension: string; }
interface Product {
    uuid: string;
    name: string;
    description: string;
    product_type: 'digital' | 'physical';
    price: number;
    stock: number;
    keywords: string;
    thumbnails: Thumbnail[];
    digital_files: DigitalFile[];
}
// BARU: Menambahkan `size` (total item) di Pagination
interface Pagination {
    size: number;
}
interface ApiResponse {
    status: number;
    message: string;
    body: Product[];
    pagination?: Pagination;
}

// PENYESUAIAN: fetchData tetap sama, hanya endpoint yang dipanggil
const fetchData = async (page: number = 1, pageSize: number = 10): Promise<ApiResponse> => {
    const userData = GetUserData()
    console.log(`Fetching real data for page: ${page}`);
    const params = { page, page_size: pageSize, seller_uuid: userData.seller_profile?.uuid};
    try {
        return await RequestAPI('/product/search', 'get', params);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { status: 500, message: "Failed to fetch data", body: [], pagination: { size: 0 } };
    }
};

const columnHelper = createColumnHelper<Product>();

const ProductTable: React.FC = () => {
    const [originalData, setOriginalData] = useState<Product[]>([]);
    const [filteredData, setFilteredData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // --- PENYESUAIAN STATE PAGINASI ---
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0); // BARU: State untuk total halaman

    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize] = useState<number>(10);

    // ModalSetting
    const addModal = useDisclosure()
    const deleteModal = useDisclosure()

    // Get ID's
    const [deleteProductID, setDeleteProductID] = useState<string>('')

    // useEffect untuk filter client-side (tidak berubah)
    useEffect(() => {
        if (!searchQuery) {
            setFilteredData(originalData);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = originalData.filter(product =>
                product.name.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, originalData]);

    const columns = useMemo(() => [
        // Definisi kolom tidak berubah...
        columnHelper.accessor(row => ({ name: row.name, description: row.description, thumbnail: row.thumbnails[0]?.thumbnail_url }), {
            id: 'product',
            header: 'Produk',
            cell: info => {
                const { name, description, thumbnail } = info.getValue();
                return (
                    <div className="flex items-center gap-4">
                        <Image src={thumbnail} alt={name} className="h-11 w-11 rounded-lg object-cover bg-zinc-800 flex-shrink-0" />
                        <div>
                            <div className="font-semibold text-white">{name}</div>
                            <div className="text-xs text-zinc-400 mt-1 truncate max-w-xs">{description}</div>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor(row => ({ stock: row.stock, type: row.product_type }), {
            id: 'status',
            header: 'Status',
            cell: info => {
                const { stock, type } = info.getValue();
                const stockColor = stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400';
                const typeColor = type === 'digital' ? 'bg-purple-500/10 text-purple-400' : 'bg-sky-500/10 text-sky-400';
                return (
                    <div className="flex flex-col gap-1.5 items-start">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${stockColor} ring-1 ring-inset ring-green-500/20`}>
                            {stock > 0 ? `${stock} in Stock` : 'Out of Stock'}
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeColor} ring-1 ring-inset ring-purple-500/20`}>{type}</div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('price', {
            header: 'Harga',
            cell: info => <div className="font-semibold text-emerald-400">Rp {info.getValue().toLocaleString('id-ID')}</div>,
        }),
        columnHelper.accessor('keywords', {
            header: 'Keywords',
            cell: info => (
                <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {info.getValue().split(', ').map(keyword => (<span key={keyword} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded">{keyword}</span>))}
                </div>
            )
        }),
        columnHelper.accessor(row => ({ ID: row.uuid }), {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: (info) => (
                <div className="text-right flex justify-end gap-2">
                    <Button color="warning" variant="ghost" size="sm" isIconOnly><IconEdit size={18} /></Button>
                    <Button
                        onPress={() => {
                            setDeleteProductID(info.getValue().ID);
                            deleteModal.onOpen()
                        }}
                        color="danger"
                        variant="ghost"
                        size="sm"
                        isIconOnly
                    >
                        <IconTrash size={18} />
                    </Button>
                </div>
            )
        })
    ], []);

    const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel(), manualPagination: true });

    // --- PENYESUAIAN: loadData sekarang menghitung total halaman ---
    const loadData = async (page: number) => {
        setLoading(true);
        try {
            const result = await fetchData(page, pageSize);
            setOriginalData(result.body || []);

            // Hitung total halaman berdasarkan `size` dari API
            const totalData = result.pagination?.size || 0;
            setTotalPages(Math.ceil(totalData / pageSize));

        } catch (error) {
            console.error('Error in loadData:', error);
            setOriginalData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(currentPage);
    }, [currentPage]);

    // --- PENYESUAIAN: Handler paginasi berdasarkan total halaman ---
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const deleteProduct = async () => {
        try {
            setLoading(true);
            const response = await RequestAPI('/product/delete/' + deleteProductID, 'delete');

            if (response.status === 200) {
                setLoading(false)
                deleteModal.onClose()
                await loadData(currentPage)
            } else {
                throw new Error(response.message || 'Gagal menghapus produk');
            }

            setLoading(false);
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(error.message || 'Terjadi kesalahan saat menghapus produk');
        }
    }

    const handleCallbackAddProduct = React.useCallback(async () => {
        await loadData(currentPage);
    }, [currentPage, loadData]);

    return (
        <div className="min-h-screen bg-black text-zinc-300 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manajemen Produk</h1>
                        <p className="text-zinc-400 mt-1">Cari, kelola, dan lihat produk anda.</p>
                    </div>
                    <Button onPress={addModal.onOpen} variant="solid" color="primary" className="rounded-sm">Tambah Produk</Button>
                </header>
                <div className="bg-transparent rounded-lg border border-zinc-900">
                    <div className="p-4 border-b border-zinc-900">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari berdasarkan nama produk..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            {/* ... thead ... */}
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
                                <tr><td colSpan={columns.length} className="text-center p-16"><h3 className="text-lg font-semibold text-zinc-400">Produk Tidak Ditemukan</h3><p className="text-zinc-500 mt-1 text-sm">{searchQuery ? 'Hasil filter tidak ditemukan.' : 'Tidak ada data untuk ditampilkan.'}</p></td></tr>
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
                    <div className="p-4 flex items-center justify-between border-t border-zinc-900">
                        <div className="text-sm text-zinc-500">
                            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                        </div>
                        {/* --- PENYESUAIAN: Tombol disable berdasarkan currentPage dan totalPages --- */}
                        <div className="flex items-center gap-2">
                            <Button size="sm" isIconOnly variant="solid" onPress={handlePrevious} disabled={currentPage <= 1 || loading}>
                                <ChevronLeft className="text-gray-700" />
                            </Button>
                            <span className="text-sm font-medium text-zinc-400">
                                {currentPage}
                             </span>
                            <Button size="sm" isIconOnly onPress={handleNext} disabled={currentPage >= totalPages || loading}>
                                <ChevronRight className="text-gray-700" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductModal isOpen={addModal.isOpen} onOpen={addModal.onOpen} onOpenChange={addModal.onOpenChange} onClose={addModal.onClose} onSubmitSuccess={handleCallbackAddProduct} />
            <MyModal title="Hapus Produk" onOpen={deleteModal.onOpen} isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange}>
                <div className="flex gap-1">
                    <Button
                        onPress={deleteProduct}
                        isLoading={loading}
                        color="default" className="text-white hover:text-black w-6/12" variant="ghost">
                        <IconTrash /> Hapus
                    </Button>
                    <Button isLoading={loading} color="danger" className="w-6/12" variant="solid">
                        <IconCancel /> Batal
                    </Button>
                </div>
            </MyModal>
        </div>
    );
};

export default ProductTable;