"use client";

import React, { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input, Button, Select, SelectItem, addToast} from '@heroui/react';
import MyModal from "@/components/ui/modal/MyModal";
import RequestAPI from '@/helper/http';

// --- Interface & Tipe Data ---
interface WithdrawFormData {
    amount: number | unknown;
    bank_name: 'bca' | 'bni'| 'bri' | 'mandiri';
    bank_account: string; // ✅ Diubah menjadi string untuk keamanan & fungsionalitas
    bank_account_name: string;
}

interface WithdrawModalProps {
    isOpen: boolean;
    isSubmitted: () => void;
    totalBalance: number; // ✅ Prop untuk menerima total saldo
    onOpen: () => void;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

// --- Opsi Bank ---
const banks = [
    { key: 'bca', label: 'BCA' },
    { key: 'bni', label: 'BNI' },
    { key: 'mandiri', label: 'Mandiri' },
    { key: 'bri', label: 'BRI' },
];

// --- Komponen Utama ---
const WithdrawModal: React.FC<WithdrawModalProps> = ({
    isSubmitted,
    isOpen,
    onClose,
    onOpen,
    onOpenChange,
    onSubmitSuccess,
    totalBalance // ✅ Prop totalBalance diterima di sini
}) => {

    // ✅ Skema validasi dibuat di dalam komponen untuk mengakses totalBalance
    const withdrawSchema = useMemo(() => z.object({
        amount: z.preprocess(
            (val) => (typeof val === 'string' ? parseFloat(val.replace(/[^0-9]/g, '')) : val),
            z.number()
                .min(50000, "Jumlah penarikan minimal Rp 50.000")
                // ✅ Aturan ini yang menyebabkan error
                .max(totalBalance, `Jumlah penarikan melebihi saldo Anda`)
        ),
        bank_name: z.enum(['bca', 'bni', 'bri', 'mandiri']),
        bank_account: z.string()
            .min(5, "Nomor rekening minimal 5 digit")
            .regex(/^\d+$/, "Nomor rekening hanya boleh berisi angka"),
        bank_account_name: z.string().min(2, "Nama pemilik rekening harus diisi"),
    }), [totalBalance]); // Skema akan diperbarui jika totalBalance berubah

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
    });

    const onSubmit = async (data: WithdrawFormData) => {
        try {
            console.log("Data siap dikirim ke API:", data);
            // ✅ Endpoint API diubah sesuai permintaan
            const response = await RequestAPI('/wallet/payout', 'post', data);

            if (response.status === 200) {
                isSubmitted()
                addToast({
                    title: 'Berhasil',
                    description: 'Pengajuan penarikan dana berhasil dikirim.',
                    color: 'success',
                });
                reset();
                onClose();
                onSubmitSuccess?.();
            } else {
                addToast({
                    title: 'Gagal',
                    description: response.message || 'Gagal mengajukan penarikan.',
                    color: 'danger',
                });
            }
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: 'Terjadi kesalahan pada server.',
                color: 'danger',
            });
            console.error('Submit error:', error);
        }
    };

    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
        }
        onClose();
    };

    const inputWrapperClassNames = "bg-zinc-900/50 hover:bg-zinc-900/50 border border-zinc-800 rounded-lg data-[hover=true]:border-zinc-700 group-data-[focus=true]:border-blue-500";

    return (
        <MyModal
            size="2xl"
            title="Ajukan Penarikan Dana"
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={handleModalClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    {...register("amount")}
                    label="Jumlah Penarikan"
                    placeholder="Contoh: 50000"
                    type="number"
                    startContent={<span className="text-zinc-500">Rp</span>}
                    isInvalid={!!errors.amount}
                    errorMessage={errors.amount?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <Select
                    {...register("bank_name")}
                    label="Pilih Bank Tujuan"
                    placeholder="Pilih salah satu bank"
                    isInvalid={!!errors.bank_name}
                    errorMessage={errors.bank_name?.message}
                    isDisabled={isSubmitting}
                    classNames={{
                        trigger: inputWrapperClassNames,
                        popoverContent: "bg-zinc-900 border border-zinc-800 text-zinc-300"
                    }}
                    items={banks}
                >
                    {(bank) => <SelectItem>{bank.label}</SelectItem>}
                </Select>

                <Input
                    {...register("bank_account")}
                    label="Nomor Rekening"
                    placeholder="Masukkan nomor rekening bank"
                    type="text" // ✅ Diubah menjadi text
                    inputMode="numeric"
                    isInvalid={!!errors.bank_account}
                    errorMessage={errors.bank_account?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <Input
                    {...register("bank_account_name")}
                    label="Nama Pemilik Rekening"
                    placeholder="Sesuai dengan nama di buku tabungan"
                    isInvalid={!!errors.bank_account_name}
                    errorMessage={errors.bank_account_name?.message}
                    isDisabled={isSubmitting}
                    fullWidth
                    classNames={{ inputWrapper: inputWrapperClassNames }}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <Button variant="bordered" onPress={onClose} isDisabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" color="primary" isLoading={isSubmitting}>
                        Ajukan Penarikan
                    </Button>
                </div>
            </form>
        </MyModal>
    );
};

export default WithdrawModal;