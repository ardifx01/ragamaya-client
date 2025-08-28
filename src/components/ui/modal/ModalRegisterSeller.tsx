"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input, Button, Textarea, addToast} from '@heroui/react';
import MyModal from "@/components/ui/modal/MyModal";
import RequestAPI from '@/helper/http';
import {handleLogout} from "@/lib/GetUserData";

// --- Types ---
interface RegisterSellerFormData {
    name: string;
    desc: string;
    address: string;
    whatsapp: string;
}

interface RegisterSellerProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

// --- Validation Schema ---
const storeSchema = z.object({
    name: z.string().min(3, "Nama toko minimal 3 karakter"),
    desc: z.string().min(10, "Deskripsi toko minimal 10 karakter"),
    address: z.string().min(10, "Alamat toko minimal 10 karakter"),
    whatsapp: z.string()
        .min(10, "Nomor WhatsApp tidak valid")
        .regex(/^\+628[1-9][0-9]{7,11}$/, "Format nomor WhatsApp tidak valid. Contoh: +6281234567890"),
});


// --- Main Component ---
const RegisterSeller: React.FC<RegisterSellerProps> = ({
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
    } = useForm<RegisterSellerFormData>({
        resolver: zodResolver(storeSchema),
    });

    const onSubmit = async (data: RegisterSellerFormData) => {
        try {
            console.log("Data siap dikirim ke API:", data);

            // Ganti endpoint API sesuai dengan kebutuhan Anda, misal: '/store/create' atau '/store/update'
            const response = await RequestAPI('/seller/register', 'post', data);

            if (response.status === 200) {
                addToast({
                    title: 'Success',
                    description: 'Berhasil mendaftar menjadi penjual. Silahkan masuk kembali!',
                    color: 'success',
                })
                reset();
                onClose();
                onSubmitSuccess?.();
                handleLogout()
            } else {
                addToast({
                    title: 'Error',
                    description: response.message || 'Gagal mendaftar.',
                    color: 'danger',
                })
                throw new Error(response.message || 'Gagal mendaftar.');
            }
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: 'Terjadi kesalahan pada server',
                color: 'danger',
            })
            console.error('Submit error:', error);
        }
    };

    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
        }
        onOpenChange(isOpen);
    };

    // ClassName untuk styling input field
    const inputWrapperClassNames = "bg-zinc-900/50 hover:bg-zinc-900/50 border border-zinc-800 rounded-lg data-[hover=true]:border-zinc-700 group-data-[focus=true]:border-blue-500";

    return (
        <MyModal
            onOpen={onOpen}
            size="2xl" // Ukuran bisa disesuaikan
            title="Daftar Menjadi Penjual" // Judul diubah
            isOpen={isOpen}
            onOpenChange={handleModalClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <Input
                    {...register("name")}
                    label="Nama Toko"
                    placeholder="Contoh: ABRIM STORE"
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <Textarea
                    {...register("desc")}
                    label="Deskripsi Toko"
                    placeholder="Jelaskan tentang toko Anda..."
                    isInvalid={!!errors.desc}
                    errorMessage={errors.desc?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    minRows={3}
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <Textarea
                    {...register("address")}
                    label="Alamat Toko"
                    placeholder="Masukkan alamat lengkap toko Anda"
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    minRows={2}
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <Input
                    {...register("whatsapp")}
                    label="Nomor WhatsApp"
                    placeholder="+6281234567890"
                    description="Gunakan format internasional (+62)"
                    isInvalid={!!errors.whatsapp}
                    errorMessage={errors.whatsapp?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                    defaultValue="+62"
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <Button variant="bordered" onPress={() => handleModalClose(false)} isDisabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" color="primary" isLoading={isSubmitting}>
                        Kirim
                    </Button>
                </div>
            </form>
        </MyModal>
    );
};

export default RegisterSeller;