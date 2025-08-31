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

    // Single state to track all thumbnails that should be submitted
    const [allThumbnailUrls, setAllThumbnailUrls] = useState<string[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pondKey, setPondKey] = useState(0);

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

                    // Set initial thumbnail URLs
                    if (product.thumbnails && product.thumbnails.length > 0) {
                        const thumbnailUrls = product.thumbnails.map((thumb: any) => thumb.thumbnail_url);
                        setAllThumbnailUrls(thumbnailUrls);
                        debugLog("Initial thumbnails loaded:", thumbnailUrls);
                    } else {
                        setAllThumbnailUrls([]);
                    }

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
            setAllThumbnailUrls([]);
            setPondKey(prev => prev + 1);
        }
    }, [isOpen, productID, reset]);

    // Convert URLs to FilePond format
    const getFilePondFiles = useCallback(() => {
        return allThumbnailUrls.map((url, index) => ({
            source: url,
            options: {
                type: 'local' as const,
                metadata: { url, index }
            }
        }));
    }, [allThumbnailUrls]);

    // Handler untuk submit form
    const onSubmit = async (data: ProductFormData) => {
        try {
            debugLog("=== SUBMIT DEBUG ===");
            debugLog("All thumbnails to submit:", allThumbnailUrls);

            const finalThumbnails = allThumbnailUrls.map(url => ({
                thumbnail_url: url
            }));

            debugLog("Final thumbnails payload:", finalThumbnails);

            const productData = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock),
                thumbnails: finalThumbnails,
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

                        // Add to thumbnails list
                        setAllThumbnailUrls(prev => {
                            const updated = [...prev, newUrl];
                            debugLog("Updated allThumbnailUrls after upload:", updated);
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

    // Handler untuk file yang dihapus
    const handleRemoveFile = useCallback((error: any, file: any) => {
        if (error) {
            console.error("Remove file error:", error);
            return;
        }

        // Skip if file just finished processing (to prevent auto-removal after upload)
        if (file.status === 5) {
            debugLog("File just completed upload, skipping removal");
            return;
        }

        const metadata = file.getMetadata();
        const fileUrl = metadata?.url || file.serverId || file.source;

        debugLog("Removing file with URL:", fileUrl);

        // Remove from thumbnails list
        setAllThumbnailUrls(prev => {
            const updated = prev.filter(url => url !== fileUrl);
            debugLog("Updated allThumbnailUrls after removal:", updated);
            return updated;
        });

    }, []);

    // Handler untuk menutup modal
    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            setAllThumbnailUrls([]);
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
                        <Card className="bg-zinc-900/50 border border-zinc-800">
                            <CardBody className="space-y-3">
                                <h4 className="text-sm font-medium text-zinc-300">Thumbnail Produk</h4>
                                {process.env.NODE_ENV !== 'production' && (
                                    <div className="text-xs text-zinc-400 bg-zinc-800/50 p-2 rounded">
                                        <div>Debug Info:</div>
                                        <div>Total thumbnails: {allThumbnailUrls.length}</div>
                                        <div>URLs: {allThumbnailUrls.join(', ')}</div>
                                    </div>
                                )}
                                <FilePond
                                    key={pondKey}
                                    ref={thumbnailsPond}
                                    files={getFilePondFiles()}
                                    allowReorder={true}
                                    allowMultiple={true}
                                    maxFiles={5}
                                    server={filePondServerConfig()}
                                    name="files"
                                    instantUpload={true}
                                    onremovefile={handleRemoveFile}
                                    labelIdle='Drag & Drop gambar atau <span class="filepond--label-action">Browse</span>'
                                    disabled={isSubmitting}
                                    className="filepond-dark"
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <Button variant="bordered" onPress={() => handleModalClose(false)} isDisabled={isSubmitting}>Batal</Button>
                        <Button type="submit" color="primary" isLoading={isSubmitting}>
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            )}
            <style jsx global>{`
                .filepond-dark .filepond--root { background: rgba(39, 39, 42, 0.5); border: 1px solid rgb(39, 39, 42); border-radius: 8px; }
                .filepond-dark .filepond--panel-root { background: rgba(39, 39, 42, 0.3); }
                .filepond-dark .filepond--drop-label { color: rgb(161, 161, 170); }
                .filepond-dark .filepond--label-action { color: rgb(59, 130, 246); text-decoration: underline; }
                .filepond-dark .filepond--item { background: rgba(24, 24, 27, 0.8); }
                .filepond-dark .filepond--file-info-main { color: rgb(228, 228, 231); }
                .filepond-dark .filepond--file-info-sub { color: rgb(161, 161, 170); }
            `}</style>
        </MyModal>
    );
};

export default EditProductModal;