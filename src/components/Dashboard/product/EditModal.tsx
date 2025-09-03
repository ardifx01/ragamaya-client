"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input, Button, Textarea, Card, CardBody, addToast, Spinner} from '@heroui/react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import RequestAPI from '@/helper/http';
import Cookies from "js-cookie";
import MyModal from "@/components/ui/modal/MyModal";

// Register plugin
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

// Helper function for debug logging
const debugLog = (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args);
    }
};

// --- Types ---
interface ProductFormData {
    name: string;
    description: string;
    price: number | unknown;
    stock: number | unknown;
    keywords: string;
}

interface EditProductModalProps {
    productID: string;
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

interface ExistingThumbnail {
    id: string;
    thumbnail_url: string;
}

// --- Validation Schema ---
const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    price: z.preprocess((val) => (typeof val === 'string' && val !== '' ? parseFloat(val) : val), z.number().min(1, "Harga harus diisi")),
    stock: z.preprocess((val) => (typeof val === 'string' && val !== '' ? parseInt(val) : val), z.number().min(0, "Stok tidak boleh negatif")),
    keywords: z.string().min(3, "Keywords harus diisi"),
});

// --- Main Component ---
const EditProductModal: React.FC<EditProductModalProps> = ({
   productID,
   isOpen,
   onClose,
   onOpen,
   onOpenChange,
   onSubmitSuccess
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    const thumbnailsPond = useRef<FilePond>(null);

    // State untuk gambar yang sudah ada (bisa dihapus)
    const [existingThumbnails, setExistingThumbnails] = useState<ExistingThumbnail[]>([]);
    // State untuk gambar baru yang diupload
    const [newThumbnailUrls, setNewThumbnailUrls] = useState<string[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pondKey, setPondKey] = useState(0);
    // State untuk tracking gambar yang sedang dihapus
    const [deletingThumbnails, setDeletingThumbnails] = useState<Set<string>>(new Set());

    // Efek untuk mengambil data detail produk
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productID) return;
            setIsLoadingData(true);
            try {
                const response = await RequestAPI(`/product/${productID}`, 'get');
                if (response.status === 200) {
                    const product = response.body;
                    reset({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        keywords: product.keywords,
                    });

                    // Set existing thumbnails
                    if (product.thumbnails && product.thumbnails.length > 0) {
                        const thumbnails = product.thumbnails.map((thumb: any) => ({
                            id: thumb.id || Math.random().toString(36),
                            thumbnail_url: thumb.thumbnail_url
                        }));
                        setExistingThumbnails(thumbnails);
                        debugLog("Existing thumbnails loaded:", thumbnails);
                    } else {
                        setExistingThumbnails([]);
                    }

                    // Reset new thumbnails
                    setNewThumbnailUrls([]);
                    setPondKey(prev => prev + 1);
                }
            } catch (error) {
                console.error("Fetch product error:", error);
                addToast({ title: 'Error', description: 'Gagal memuat data produk', color: 'danger' });
            } finally {
                setIsLoadingData(false);
            }
        };

        if (isOpen && productID) {
            fetchProductDetails();
        } else if (!isOpen) {
            setExistingThumbnails([]);
            setNewThumbnailUrls([]);
            setDeletingThumbnails(new Set());
            setPondKey(prev => prev + 1);
        }
    }, [isOpen, productID, reset]);

    // Handler untuk menghapus gambar yang sudah ada
    const handleRemoveExistingThumbnail = async (thumbnailId: string, thumbnailUrl: string) => {
        // Add to deleting state untuk show loading
        setDeletingThumbnails(prev => new Set(prev).add(thumbnailId));

        try {
            debugLog("Deleting thumbnail:", { thumbnailId, thumbnailUrl, productID });

            // Hit API untuk hapus gambar dari server dengan query parameters
            const response = await RequestAPI(`/product/delete/thumbnail?product_uuid=${productID}&id=${thumbnailId}`, 'delete');

            debugLog("Delete API response:", response);

            if (response.status === 200) {
                // Hapus dari state setelah berhasil dihapus dari server
                setExistingThumbnails(prev => {
                    const updated = prev.filter(thumb => thumb.id !== thumbnailId);
                    debugLog("Updated existing thumbnails after removal:", updated);
                    return updated;
                });
                addToast({
                    title: 'Berhasil',
                    description: 'Gambar berhasil dihapus',
                    color: 'success'
                });
            } else {
                throw new Error(response.message || 'Gagal menghapus gambar');
            }
        } catch (error: any) {
            console.error("Delete thumbnail error:", error);
            addToast({
                title: 'Error',
                description: error.message || 'Gagal menghapus gambar',
                color: 'danger'
            });
        } finally {
            // Remove from deleting state
            setDeletingThumbnails(prev => {
                const newSet = new Set(prev);
                newSet.delete(thumbnailId);
                return newSet;
            });
        }
    };

    // Handler untuk submit form
    const onSubmit = async (data: ProductFormData) => {
        try {
            debugLog("=== SUBMIT DEBUG ===");
            debugLog("Existing thumbnails (not sent):", existingThumbnails);
            debugLog("New thumbnails to submit:", newThumbnailUrls);

            // Hanya kirim gambar baru yang diupload
            const newThumbnailsPayload = newThumbnailUrls.map(url => ({
                thumbnail_url: url
            }));

            debugLog("Final thumbnails payload (only new ones):", newThumbnailsPayload);

            const productData = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock),
                thumbnails: newThumbnailsPayload, // Hanya gambar baru
            };

            const response = await RequestAPI(`/product/update/${productID}`, 'put', productData);
            if (response.status === 200) {
                addToast({ title: 'Success', description: 'Berhasil mengubah Produk', color: 'success' });
                handleModalClose(false);
                onSubmitSuccess?.();
            } else {
                throw new Error(response.message || 'Gagal mengubah produk');
            }
        } catch (error: any) {
            console.error("Submit error:", error);
            addToast({ title: 'Error', description: error.message || 'Gagal mengubah produk', color: 'danger' });
        }
    };

    // Konfigurasi server FilePond
    const filePondServerConfig = () => ({
        process: {
            url: `${process.env.NEXT_PUBLIC_BASE_API}/storage/image/upload`,
            headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
            onload: (response: any): string => {
                try {
                    const parsedResponse = JSON.parse(response);
                    const responseBody = parsedResponse.body || parsedResponse;
                    const fileResult = Array.isArray(responseBody) ? responseBody[0] : responseBody;

                    if (fileResult && fileResult.status === "success" && fileResult.result && fileResult.result.public_url) {
                        const newUrl = fileResult.result.public_url;
                        debugLog("Upload successful! New URL:", newUrl);

                        // Add to new thumbnails list
                        setNewThumbnailUrls(prev => {
                            const updated = [...prev, newUrl];
                            debugLog("Updated newThumbnailUrls after upload:", updated);
                            return updated;
                        });

                        return newUrl;
                    } else {
                        console.error("Failed to get public_url from response:", fileResult);
                        return '';
                    }
                } catch (e) {
                    console.error("Failed to parse JSON from server:", e);
                    return '';
                }
            },
            revert: null,
        },
    });

    // Handler untuk file baru yang dihapus dari FilePond
    const handleRemoveNewFile = useCallback((error: any, file: any) => {
        if (error) {
            console.error("Remove new file error:", error);
            return;
        }

        // Skip if file just finished processing (to prevent auto-removal after upload)
        if (file.status === 5) {
            debugLog("File just completed upload, skipping removal");
            return;
        }

        const fileUrl = file.serverId || file.source;
        debugLog("Removing new file with URL:", fileUrl);

        // Remove from new thumbnails list
        setNewThumbnailUrls(prev => {
            const updated = prev.filter(url => url !== fileUrl);
            debugLog("Updated newThumbnailUrls after removal:", updated);
            return updated;
        });
    }, []);

    // Handler untuk menutup modal
    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            setExistingThumbnails([]);
            setNewThumbnailUrls([]);
            setDeletingThumbnails(new Set());
            setPondKey(prev => prev + 1);
            onClose();
        }
        onOpenChange(isOpen);
    };

    const inputWrapperClassNames = "bg-zinc-900/50 hover:bg-zinc-900/50 border border-zinc-800 rounded-lg data-[hover=true]:border-zinc-700 group-data-[focus=true]:border-blue-500";

    return (
        <MyModal size="4xl" title="Edit Produk" isOpen={isOpen} onOpenChange={handleModalClose} onOpen={onOpen}>
            {isLoadingData ? (
                <div className="flex justify-center items-center h-96"><Spinner size="lg"/></div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input {...register("name")} label="Nama Produk" isInvalid={!!errors.name} errorMessage={errors.name?.message} isDisabled={isSubmitting} classNames={{inputWrapper: inputWrapperClassNames}}/>
                    <Textarea {...register("description")} label="Deskripsi Produk" isInvalid={!!errors.description} errorMessage={errors.description?.message} isDisabled={isSubmitting} minRows={3} classNames={{inputWrapper: inputWrapperClassNames}}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input {...register("price")} type="number" label="Harga (Rp)" startContent={<span className="text-zinc-500">Rp</span>} isInvalid={!!errors.price} errorMessage={errors.price?.message} isDisabled={isSubmitting} classNames={{inputWrapper: inputWrapperClassNames}}/>
                        <Input {...register("stock")} type="number" label="Stok" isInvalid={!!errors.stock} errorMessage={errors.stock?.message} isDisabled={isSubmitting} classNames={{inputWrapper: inputWrapperClassNames}}/>
                    </div>
                    <Input {...register("keywords")} label="Keywords" description="Pisahkan dengan koma" isInvalid={!!errors.keywords} errorMessage={errors.keywords?.message} isDisabled={isSubmitting} classNames={{inputWrapper: inputWrapperClassNames}}/>

                    <div className="space-y-6">
                        {/* Existing Thumbnails Section */}
                        {existingThumbnails.length > 0 && (
                            <Card className="bg-zinc-900/50 border border-zinc-800">
                                <CardBody className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-zinc-400" />
                                        <h4 className="text-sm font-medium text-zinc-300">Gambar Saat Ini</h4>
                                        <span className="text-xs text-zinc-500">({existingThumbnails.length} gambar)</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {existingThumbnails.map((thumbnail) => (
                                            <div key={thumbnail.id} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                                                    <img
                                                        src={thumbnail.thumbnail_url}
                                                        alt="Product thumbnail"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                            target.parentElement!.innerHTML = '<div class="text-zinc-500 text-xs">Gagal memuat</div>';
                                                        }}
                                                    />
                                                    {/* Loading overlay ketika sedang hapus */}
                                                    {deletingThumbnails.has(thumbnail.id) && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <Spinner size="sm" color="danger" />
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        debugLog("Delete button clicked for:", thumbnail.id, thumbnail.thumbnail_url);
                                                        handleRemoveExistingThumbnail(thumbnail.id, thumbnail.thumbnail_url);
                                                    }}
                                                    disabled={isSubmitting || deletingThumbnails.has(thumbnail.id)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
                                                    title="Hapus gambar"
                                                >
                                                    {deletingThumbnails.has(thumbnail.id) ? (
                                                        <Spinner size="sm" className="w-3 h-3" />
                                                    ) : (
                                                        <X className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* New Thumbnails Upload Section */}
                        <Card className="bg-zinc-900/50 border border-zinc-800">
                            <CardBody className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-zinc-400" />
                                    <h4 className="text-sm font-medium text-zinc-300">Tambah Gambar Baru</h4>
                                    {newThumbnailUrls.length > 0 && (
                                        <span className="text-xs text-blue-400">({newThumbnailUrls.length} gambar baru)</span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Upload gambar baru untuk ditambahkan ke produk. Maksimal 5 gambar baru.
                                </p>

                                {process.env.NODE_ENV !== 'production' && (
                                    <div className="text-xs text-zinc-400 bg-zinc-800/50 p-2 rounded">
                                        <div>Debug Info:</div>
                                        <div>Existing thumbnails: {existingThumbnails.length}</div>
                                        <div>New thumbnails to submit: {newThumbnailUrls.length}</div>
                                        <div>Note: Only new images will be sent to API</div>
                                    </div>
                                )}

                                <FilePond
                                    key={pondKey}
                                    ref={thumbnailsPond}
                                    allowReorder={true}
                                    allowMultiple={true}
                                    maxFiles={5}
                                    server={filePondServerConfig()}
                                    name="files"
                                    instantUpload={true}
                                    onremovefile={handleRemoveNewFile}
                                    labelIdle='Drag & Drop gambar baru atau <span class="filepond--label-action">Browse</span>'
                                    disabled={isSubmitting}
                                    className="filepond-dark"
                                    acceptedFileTypes={['image/*']}
                                    fileValidateTypeDetectType={(source, type) =>
                                        new Promise((resolve, reject) => {
                                            // Allow only image files
                                            if (type.startsWith('image/')) {
                                                resolve(type);
                                            } else {
                                                reject('Hanya file gambar yang diperbolehkan');
                                            }
                                        })
                                    }
                                />
                            </CardBody>
                        </Card>

                        {/* Summary Section */}
                        {(existingThumbnails.length > 0 || newThumbnailUrls.length > 0) && (
                            <div className="text-xs text-zinc-400 bg-zinc-800/30 p-3 rounded-lg border border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <span>Total gambar setelah update:</span>
                                    <span className="font-medium text-zinc-300">
                                        {existingThumbnails.length + newThumbnailUrls.length} gambar
                                    </span>
                                </div>
                                {existingThumbnails.length > 0 && (
                                    <div className="flex items-center justify-between mt-1">
                                        <span>• Gambar yang dipertahankan:</span>
                                        <span className="text-green-400">{existingThumbnails.length}</span>
                                    </div>
                                )}
                                {newThumbnailUrls.length > 0 && (
                                    <div className="flex items-center justify-between mt-1">
                                        <span>• Gambar baru:</span>
                                        <span className="text-blue-400">{newThumbnailUrls.length}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <Button variant="bordered" onPress={() => handleModalClose(false)} isDisabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" color="primary" isLoading={isSubmitting}>
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            )}
            <style jsx global>{`
                .filepond-dark .filepond--root {
                    background: rgba(39, 39, 42, 0.5);
                    border: 1px solid rgb(39, 39, 42);
                    border-radius: 8px;
                }
                .filepond-dark .filepond--panel-root {
                    background: rgba(39, 39, 42, 0.3);
                }
                .filepond-dark .filepond--drop-label {
                    color: rgb(161, 161, 170);
                }
                .filepond-dark .filepond--label-action {
                    color: rgb(59, 130, 246);
                    text-decoration: underline;
                }
                .filepond-dark .filepond--item {
                    background: rgba(24, 24, 27, 0.8);
                }
                .filepond-dark .filepond--file-info-main {
                    color: rgb(228, 228, 231);
                }
                .filepond-dark .filepond--file-info-sub {
                    color: rgb(161, 161, 170);
                }
                .filepond-dark .filepond--file-status-main {
                    color: rgb(34, 197, 94);
                }
                .filepond-dark .filepond--file-status-sub {
                    color: rgb(161, 161, 170);
                }
            `}</style>
        </MyModal>
    );
};

export default EditProductModal;