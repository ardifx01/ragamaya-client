'use client'

import { useState } from "react";
import { Copy } from "lucide-react";
import { Image, addToast } from "@heroui/react";

// Type definitions for payment data structure
interface PaymentAction {
    url: string;
    method?: string;
}

interface PaymentVANumber {
    va_number: string;
    bank?: string;
}

interface Payment {
    payment_actions: PaymentAction[];
    qr_string?: string;
    payment_va_numbers?: PaymentVANumber[];
    permata_va_number?: string;
    payment_code?: string;
    expiry_time?: string;
    transaction_status?: string;
}

interface PaymentData {
    uuid: string;
    order_payment_type: string;
    order_status: string;
    payments: Payment[];
}

interface PaymentActionSectionProps {
    data: PaymentData;
}

const PaymentActionSection: React.FC<PaymentActionSectionProps> = ({ data }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = (url: string, filename?: string): void => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "downloaded-file";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderQRISPayment = () => (
        <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 w-max h-max mt-6 mx-auto sm:mx-0">
            <div className="bg-white rounded-lg p-1">
                <Image
                    src={data?.payments[0]?.payment_actions[0]?.url}
                    alt={data?.payments[0]?.qr_string || "QRIS Code"}
                    className='w-52'
                />
                <div className='px-4 pb-4'>
                    <button
                        type="button"
                        className="text-white bg-purple-700 hover:bg-purple-800 disabled:hover:bg-purple-700 disabled:opacity-70 font-medium rounded-xl text-sm px-5 py-3 inline-flex flex-1 justify-center w-full text-center"
                        onClick={() => handleDownload(
                            data.payments[0].payment_actions[0].url,
                            data.payments[0].qr_string
                        )}
                    >
                        Download QRIS
                    </button>
                </div>
            </div>
        </div>
    );

    const renderShopeepayPayment = () => (
        <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 w-max h-max mt-6 mx-auto sm:mx-0">
            <div className="bg-white rounded-lg p-1">
                <Image src={`/payments/shopeepay.svg`} className='w-52' alt="ShopeePay" />
                <div className='px-4 pb-4'>
                    <button
                        type="button"
                        className="text-white bg-purple-700 hover:bg-purple-800 disabled:hover:bg-purple-700 disabled:opacity-70 font-medium rounded-xl text-sm px-5 py-3 inline-flex flex-1 justify-center w-full text-center"
                        onClick={() => window.open(data?.payments[0]?.payment_actions[0]?.url, "_blank")}
                    >
                        Open Shopeepay
                    </button>
                </div>
            </div>
        </div>
    );

    const renderGopayPayment = () => (
        <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 w-max h-max mt-6 mx-auto sm:mx-0">
            <div className="bg-white rounded-lg p-1">
                <Image
                    src={data?.payments[0]?.payment_actions[0]?.url}
                    className='w-52'
                    alt="GoPay QR"
                />
                <div className='px-4 pb-4'>
                    <button
                        type="button"
                        className="text-white bg-purple-700 hover:bg-purple-800 disabled:hover:bg-purple-700 disabled:opacity-70 font-medium rounded-xl text-sm px-5 py-3 inline-flex flex-1 justify-center w-full text-center"
                        onClick={() => window.open(data?.payments[0]?.payment_actions[1]?.url, "_blank")}
                    >
                        Open Gopay
                    </button>
                </div>
            </div>
        </div>
    );

    const renderVAPayment = (vaNumber: string, message: string = "Nomor VA berhasil disalin") => (
        <div
            className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 w-max h-max mt-6 mx-auto sm:mx-0 cursor-pointer select-none"
            onClick={() =>
                navigator.clipboard.writeText(vaNumber)
                    .then(() => addToast({
                        title: "Berhasil!",
                        description: message,
                        color: "success"
                    }))
                    .catch(() => addToast({
                        title: "Gagal!",
                        description: "Gagal menyalin nomor",
                        color: "danger"
                    }))
            }
        >
            <div className="bg-white rounded-lg p-4 flex flex-row items-center justify-center gap-2">
                <p className="text-gray-800 font-mono">{vaNumber}</p>
                <Copy size={32} className="text-gray-600" />
            </div>
        </div>
    );

    // Main payment type switch
    switch (data.order_payment_type) {
        case "qris":
            return renderQRISPayment();

        case "shopeepay":
            return renderShopeepayPayment();

        case "gopay":
            return renderGopayPayment();

        case "bni":
        case "mandiri":
        case "cimb":
        case "bca":
        case "bri":
            return renderVAPayment(
                data.payments[0]?.payment_va_numbers?.[0]?.va_number || "",
                "Nomor VA berhasil disalin"
            );

        case "maybank":
        case "permata":
        case "mega":
            return renderVAPayment(
                data.payments[0]?.permata_va_number || "",
                "Nomor VA berhasil disalin"
            );

        case "indomaret":
        case "alfamart":
            return renderVAPayment(
                data.payments[0]?.payment_code || "",
                "Kode pembayaran berhasil disalin"
            );

        default:
            return (
                <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800">
                        Metode pembayaran "{data.order_payment_type}" tidak dikenali.
                    </p>
                </div>
            );
    }
};

export default PaymentActionSection;