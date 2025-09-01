"use client";

import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input, Button, Textarea, Card, CardBody, addToast} from '@heroui/react';
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
    url: string;
    filename: string;
    serverId: string;
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
    onClose: () => void;
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
 onClose,
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

            if (response.status === 200) {
                addToast({
                    title: 'Success',
                    description: 'Berhasil Menambahkan Produk',
                    color: 'success',
                })
                reset();
                setUploadedThumbnails([]);
                setUploadedDigitalFiles([]);
                thumbnailsPond.current?.removeFiles();
                digitalFilesPond.current?.removeFiles();
                onClose()
                onSubmitSuccess?.();
            } else {
                addToast({
                    title: 'Error',
                    description: response.message,
                    color: 'danger',
                })
                throw new Error(response.message || 'Gagal membuat produk');
            }
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: 'Gagal menambahkan produk',
                color: 'danger',
            })
            console.error('Submit error:', error);
            alert(error.message || 'Terjadi kesalahan saat menyimpan produk');
        }
    };

    const filePondServerConfig = (type: 'thumbnail' | 'digitalFile') => {
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/storage/${type === 'thumbnail' ? 'image' : 'general'}/upload`;

        return {
            process: {
                url: url,
                headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
                onload: (response: any): string => {
                    try {
                        const res = JSON.parse(response);

                        if (type === 'digitalFile') {
                            const fileResult = res.body;
                            // SOLUSI: Cukup periksa apakah `public_url` ada.
                            if (fileResult?.public_url) {
                                return fileResult.public_url;
                            }
                        } else { // Logika untuk thumbnail sudah benar
                            const fileResult = res.body[0];
                            if (fileResult.status === "success" && fileResult.result?.public_url) {
                                return fileResult.result.public_url;
                            }
                        }

                        // Jika gagal pada salah satu kondisi di atas, log error
                        console.error(`Gagal mendapatkan public_url untuk tipe '${type}':`, res);
                        return '';

                    } catch (e) {
                        console.error("Gagal mem-parsing JSON dari server:", e);
                        return '';
                    }
                },
            },
            revert: null,
        };
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
                                server={filePondServerConfig('thumbnail')}
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
                                server={filePondServerConfig('digitalFile')}
                                name="file"
                                labelIdle='Drag & Drop file digital atau <span class="filepond--label-action">Browse</span>'
                                onprocessfile={(error, file) => {
                                    if (error) { console.error('Upload thumbnail error:', error); return; }
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
            `}</style>
        </MyModal>
    );
};

export default AddProductModal;