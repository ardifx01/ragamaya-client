"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

// --- Types ---
interface UploadedFile {
    url: string;
    filename: string;
    serverId: string;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number | unknown;
    stock: number | unknown;
    keywords: string;
}

interface ExistingFile {
    source: string;
    options: {
        type: "local";
        metadata: { id: number; product_uuid: string; };
    };
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

    const [uploadedThumbnails, setUploadedThumbnails] = useState<UploadedFile[]>([]);
    const [initialThumbnails, setInitialThumbnails] = useState<ExistingFile[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Ref untuk menyimpan state `uploadedThumbnails` agar tidak stale
    const uploadedThumbnailsRef = useRef(uploadedThumbnails);

    // Efek untuk menjaga ref tetap sinkron dengan state
    useEffect(() => {
        uploadedThumbnailsRef.current = uploadedThumbnails;
    }, [uploadedThumbnails]);

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

                    if (product.thumbnails) {
                        const existingThumbnails = product.thumbnails.map((thumb: any) => ({
                            source: thumb.thumbnail_url,
                            options: { type: 'local' as const, metadata: { id: thumb.id, product_uuid: product.uuid } },
                        }));
                        setInitialThumbnails(existingThumbnails);
                    }
                }
            } catch (error) {
                console.error("Fetch product error:", error);
                addToast({ title: 'Error', description: 'Gagal memuat data produk', color: 'danger' });
            } finally {
                setIsLoadingData(false);
            }
        };

        if (isOpen) {
            fetchProductDetails();
        } else {
            setInitialThumbnails([]);
            setUploadedThumbnails([]);
        }
    }, [isOpen, productID, reset]);

    // Menggabungkan file lama dan baru untuk ditampilkan di FilePond
    const allThumbnails = useMemo(() => {
        const newlyUploadedFiles = uploadedThumbnails.map(file => ({
            source: file.url,
            options: {
                type: 'local' as const,
            }
        }));
        return [...initialThumbnails, ...newlyUploadedFiles];
    }, [initialThumbnails, uploadedThumbnails]);

    // Handler untuk submit form
    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData = {
                ...data,
                thumbnails: uploadedThumbnails.map(file => ({ thumbnail_url: file.url })),
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
            addToast({ title: 'Error', description: error.message || 'Gagal mengubah produk', color: 'danger' });
        }
    };

    // Konfigurasi server FilePond
    const filePondServerConfig = (type: 'thumbnail' | 'digitalFile') => ({
        process: {
            url: `${process.env.NEXT_PUBLIC_BASE_API}/storage/${type === 'thumbnail' ? 'image' : 'general'}/upload`,
            headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
            onload: (response: any): string => {
                try {
                    const res = JSON.parse(response);
                    const fileResult = res.body[0];
                    return fileResult.status === "success" ? fileResult.result.public_url : '';
                } catch (e) { return ''; }
            },
        },
        revert: null,
    });

    // Handler untuk menghapus thumbnail
    const handleRemoveThumbnail = useCallback(async (error: any, file: any) => {
        const metadata = file.getMetadata();
        if (metadata?.id) { // File lama
            try {
                const response = await RequestAPI(`/product/delete/thumbnail?product_uuid=${metadata.product_uuid}&id=${metadata.id}`, 'delete');
                if (response.status === 200) {
                    addToast({ title: 'Success', description: 'Thumbnail berhasil dihapus', color: 'success'});
                    setInitialThumbnails(prev => prev.filter(f => f.options.metadata.id !== metadata.id));
                } else {
                    throw new Error('Gagal menghapus thumbnail dari server');
                }
            } catch (err) {
                addToast({ title: 'Error', description: 'Gagal menghapus thumbnail', color: 'danger'});
            }
        } else { // File baru
            setUploadedThumbnails(prev => prev.filter(f => f.serverId !== file.serverId));
        }
    }, []);

    // Handler untuk menutup modal
    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            setUploadedThumbnails([]);
            setInitialThumbnails([]);
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
                                <FilePond
                                    key={productID || 'new-product'}
                                    ref={thumbnailsPond}
                                    files={allThumbnails}
                                    allowMultiple={true}
                                    maxFiles={5}
                                    acceptedFileTypes={['image/*']}
                                    server={filePondServerConfig('thumbnail')}
                                    name="files"
                                    instantUpload={true}
                                    labelIdle='Drag & Drop gambar atau <span class="filepond--label-action">Browse</span>'
                                    onprocessfile={(error, file) => {
                                        if (error) { console.error('Upload file error:', error); return; }
                                        const serverId = file.serverId;
                                        if (serverId) {
                                            const currentFiles = uploadedThumbnailsRef.current;
                                            setUploadedThumbnails([
                                                ...currentFiles,
                                                { url: serverId, filename: file.filename, serverId: serverId }
                                            ]);
                                        }
                                    }}
                                    onremovefile={handleRemoveThumbnail}
                                    disabled={isSubmitting}
                                    className="filepond-dark"
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <Button variant="bordered" onPress={() => handleModalClose(false)} isDisabled={isSubmitting}>Batal</Button>
                        <Button type="submit" color="primary" isLoading={isSubmitting}>Simpan Perubahan</Button>
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