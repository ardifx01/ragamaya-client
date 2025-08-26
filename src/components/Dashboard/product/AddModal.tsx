"use client";

import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button, Textarea, Card, CardBody } from '@heroui/react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import MyModal from "@/components/ui/modal/MyModal";

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import RequestAPI from '@/helper/http';
import Cookies from "js-cookie";
import {ProcessServerConfigFunction, ServerUrl} from 'filepond';

// Register the plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

// --- Types ---
interface UploadedFile {
    url: string;      // Ini akan menyimpan public_url
    filename: string;
    serverId: string; // Ini juga akan menyimpan public_url sebagai ID unik
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
}

interface AddProductModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    onSubmitSuccess?: () => void;
}

// --- Validation Schema ---
const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    price: z.preprocess((val: number) => {
        if (typeof val === 'string') return parseFloat(val);
        return val;
    }, z.number().min(1, "Harga harus diisi")),
    stock: z.preprocess((val: number) => {
        if (typeof val === 'string') return parseInt(val);
        return val;
    }, z.number().min(0, "Stok tidak boleh negatif")),
    keywords: z.string().min(3, "Keywords harus diisi"),
});


// --- Main Component ---
const AddProductModal: React.FC<AddProductModalProps> = ({
 isOpen,
 onOpen,
 onOpenChange,
 onSubmitSuccess
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    const thumbnailsPond = useRef<FilePond>(null);
    const digitalFilesPond = useRef<FilePond>(null);

    const [uploadedThumbnails, setUploadedThumbnails] = useState<UploadedFile[]>([]);
    const [uploadedDigitalFiles, setUploadedDigitalFiles] = useState<UploadedFile[]>([]);

    const onSubmit = async (data: ProductFormData) => {
        // ... (Fungsi onSubmit tidak perlu diubah)
        try {
            if (uploadedThumbnails.length === 0) {
                alert("Harap upload minimal satu thumbnail.");
                return;
            }

            const productData = {
                ...data,
                product_type: 'digital',
                thumbnails: uploadedThumbnails.map(file => ({
                    thumbnail_url: file.url,
                })),
                digital_files: uploadedDigitalFiles.map(file => ({
                    file_url: file.url,
                    description: `File ${file.filename}`,
                    extension: file.filename.split('.').pop() || ''
                }))
            };

            console.log("Data siap dikirim ke API:", productData);
            const response = await RequestAPI('/product/register', 'post', productData);

            if (response.status === 201) {
                alert("Produk berhasil ditambahkan!");
                reset();
                setUploadedThumbnails([]);
                setUploadedDigitalFiles([]);
                thumbnailsPond.current?.removeFiles();
                digitalFilesPond.current?.removeFiles();
                onOpenChange(false);
                onSubmitSuccess?.();
            } else {
                throw new Error(response.message || 'Gagal membuat produk');
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(error.message || 'Terjadi kesalahan saat menyimpan produk');
        }
    };

    // --- PENYESUAIAN UTAMA ADA DI SINI ---
    const filePondServerConfig = {
        process: {
            url: `${process.env.NEXT_PUBLIC_BASE_API}/storage/image/upload`,
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
            onload: (response: any): string | ServerUrl | ProcessServerConfigFunction | null | undefined => {
                try {
                    const res = JSON.parse(response);
                    if (res.status === 200 && res.body && res.body.length > 0) {
                        const fileResult = res.body[0];
                        if (fileResult.status === "success" && fileResult.result?.public_url) {
                            // Kembalikan public_url sebagai ID unik untuk file ini
                            return fileResult.result.public_url;
                        }
                    }
                    console.error("Struktur respons API upload tidak sesuai:", res);
                    return null;
                } catch (e) {
                    console.error("Gagal mem-parsing respons server:", e);
                    return null;
                }
            },
        },
        revert: (uniqueFileId: string, load: () => void, error: (e: Error) => void) => {
            console.log("Reverting file:", uniqueFileId);
            // Anda bisa memanggil API delete di sini menggunakan uniqueFileId (yaitu public_url)
            load();
        },
    };

    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            setUploadedThumbnails([]);
            setUploadedDigitalFiles([]);
        }
        onOpenChange(isOpen);
    };

    const inputWrapperClassNames = "bg-zinc-900/50 hover:bg-zinc-900/50 border border-zinc-800 rounded-lg data-[hover=true]:border-zinc-700 group-data-[focus=true]:border-blue-500";

    return (
        <MyModal
            onOpen={onOpen}
            size="4xl"
            title="Tambah Produk Baru"
            isOpen={isOpen}
            onOpenChange={handleModalClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ... Input fields tidak berubah ... */}
                <Input {...register("name")} label="Nama Produk" placeholder="Contoh: Desain Batik Modern" isInvalid={!!errors.name} errorMessage={errors.name?.message} isDisabled={isSubmitting} fullWidth classNames={{ inputWrapper: inputWrapperClassNames }}/>
                <Textarea {...register("description")} label="Deskripsi Produk" placeholder="Jelaskan tentang produk Anda..." isInvalid={!!errors.description} errorMessage={errors.description?.message} isDisabled={isSubmitting} fullWidth minRows={3} classNames={{ inputWrapper: inputWrapperClassNames }} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input {...register("price")} type="number" label="Harga (Rp)" placeholder="Contoh: 70000" startContent={<span className="text-zinc-500">Rp</span>} isInvalid={!!errors.price} errorMessage={errors.price?.message} isDisabled={isSubmitting} fullWidth classNames={{ inputWrapper: inputWrapperClassNames }} />
                    <Input {...register("stock")} type="number" label="Stok" placeholder="Contoh: 99" isInvalid={!!errors.stock} errorMessage={errors.stock?.message} isDisabled={isSubmitting} fullWidth classNames={{ inputWrapper: inputWrapperClassNames }} />
                </div>
                <Input {...register("keywords")} label="Keywords" placeholder="batik, design, modern (pisahkan dengan koma)" description="Kata kunci akan membantu produk Anda ditemukan lebih mudah" isInvalid={!!errors.keywords} errorMessage={errors.keywords?.message} isDisabled={isSubmitting} fullWidth classNames={{ inputWrapper: inputWrapperClassNames }} />

                <div className="space-y-6">
                    {/* --- INSTANCE FILEPOND UNTUK THUMBNAILS --- */}
                    <Card className="bg-zinc-900/50 border border-zinc-800">
                        <CardBody className="space-y-3">
                            <h4 className="text-sm font-medium text-zinc-300">Thumbnail Produk</h4>
                            <FilePond
                                ref={thumbnailsPond}
                                allowMultiple={true}
                                maxFiles={5}
                                acceptedFileTypes={['image/*']}
                                server={filePondServerConfig}
                                name="files"
                                labelIdle='Drag & Drop gambar atau <span class="filepond--label-action">Browse</span>'
                                onprocessfile={(error, file) => {
                                    if (error) { console.error('Upload thumbnail error:', error); return; }
                                    const serverId = file.serverId; // Ini adalah public_url
                                    if (serverId) {
                                        setUploadedThumbnails(prev => [
                                            ...prev,
                                            { url: serverId, filename: file.filename, serverId: serverId }
                                        ]);
                                    }
                                }}
                                onremovefile={(error, file) => {
                                    const serverId = file.serverId;
                                    setUploadedThumbnails(prev => prev.filter(f => f.serverId !== serverId));
                                }}
                                disabled={isSubmitting}
                                className="filepond-dark"
                            />
                        </CardBody>
                    </Card>

                    {/* --- INSTANCE FILEPOND UNTUK DIGITAL FILES --- */}
                    <Card className="bg-zinc-900/50 border border-zinc-800">
                        <CardBody className="space-y-3">
                            <h4 className="text-sm font-medium text-zinc-300">File Digital</h4>
                            <FilePond
                                ref={digitalFilesPond}
                                allowMultiple={true}
                                maxFiles={5}
                                server={filePondServerConfig}
                                name="files"
                                labelIdle='Drag & Drop file digital atau <span class="filepond--label-action">Browse</span>'
                                onprocessfile={(error, file) => {
                                    if (error) { console.error('Upload file digital error:', error); return; }
                                    const serverId = file.serverId; // Ini adalah public_url
                                    if (serverId) {
                                        setUploadedDigitalFiles(prev => [
                                            ...prev,
                                            { url: serverId, filename: file.filename, serverId: serverId }
                                        ]);
                                    }
                                }}
                                onremovefile={(error, file) => {
                                    const serverId = file.serverId;
                                    setUploadedDigitalFiles(prev => prev.filter(f => f.serverId !== serverId));
                                }}
                                disabled={isSubmitting}
                                className="filepond-dark"
                            />
                        </CardBody>
                    </Card>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <Button variant="bordered" onPress={() => handleModalClose(false)} isDisabled={isSubmitting}>Batal</Button>
                    <Button type="submit" color="primary" isLoading={isSubmitting}>Simpan Produk</Button>
                </div>
            </form>
            <style jsx global>{`
                /* ... Custom FilePond Styles tidak berubah ... */
            `}</style>
        </MyModal>
    );
};

export default AddProductModal;