import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PaymentActionSection from "./PaymentActionSection";
import { Image } from "@heroui/react";

// Type definitions for batik product data
interface Thumbnail {
    id: number;
    thumbnail_url: string;
}

interface DigitalFile {
    file_url: string;
    description: string;
    extension: string;
}

interface BatikProduct {
    uuid: string;
    seller_uuid: string;
    product_type: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
    thumbnails: Thumbnail[];
    digital_files: DigitalFile[];
}

// Type definitions for payment data
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

// Main order data interface
interface OrderData {
    uuid: string;
    order_payment_type: string;
    order_status: string;
    created_at: string;
    quantity?: number;
    total_price?: number;
    product: BatikProduct;
    payments: Payment[];
}

interface PaymentDetailSectionProps {
    data: OrderData;
}

const PaymentDetailSection: React.FC<PaymentDetailSectionProps> = ({ data }) => {
    return (
        <div className=''>
            {/* <p className='pb-4 text-gray-600'>
                {TimeStampConvert(data.created_at)}
            </p> */}
            <div className='flex flex-col sm:flex-row gap-8'>
                {/* Batik Product Information Card */}
                <div className='basis-1/3 rounded-xl border-2 border-neutral-300 p-4 w-full flex flex-col gap-4 h-max bg-white shadow-lg'>
                    <Image
                        className="rounded-lg object-cover object-center w-full aspect-[800/375] sm:aspect-[1600/751] h-max"
                        src={data.product.thumbnails[0]?.thumbnail_url}
                        alt={data.product.name || 'Batik Product Image'}
                    />
                    <div className=''>
                        <p className='font-semibold mb-2 text-gray-800'>
                            Informasi Produk Batik
                        </p>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className='align-top text-sm opacity-90 pr-4 text-gray-700'>Nama Produk</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>{`: `}</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>
                                        {data.product.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='align-top text-sm opacity-90 pr-4 text-gray-700'>Tipe Produk</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>{`: `}</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700 capitalize'>
                                        {data.product.product_type}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='align-top text-sm opacity-90 pr-4 text-gray-700'>Harga</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>{`: `}</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700 font-semibold'>
                                        Rp {data.product.price.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='align-top text-sm opacity-90 pr-4 text-gray-700'>Stok</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>{`: `}</td>
                                    <td className='align-top text-sm opacity-90 text-gray-700'>
                                        {data.product.stock} tersedia
                                    </td>
                                </tr>
                                {data.product.keywords && (
                                    <tr>
                                        <td className='align-top text-sm opacity-90 pr-4 text-gray-700'>Kata Kunci</td>
                                        <td className='align-top text-sm opacity-90 text-gray-700'>{`: `}</td>
                                        <td className='align-top text-sm opacity-90 text-gray-700'>
                                            {data.product.keywords}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Product Description */}
                        {data.product.description && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {data.product.description}
                                </p>
                            </div>
                        )}

                        {/* Digital Files Info */}
                        {data.product.digital_files.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    File Digital Tersedia:
                                </p>
                                <div className="space-y-2">
                                    {data.product.digital_files.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                            <span>{file.description}</span>
                                            <span className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                                                {file.extension.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Information Section */}
                <div className='basis-2/3'>
                    <p className='text-gray-700 mb-2'>
                        Metode Pembayaran
                    </p>
                    <p className='font-semibold uppercase mb-4 text-purple-700 text-lg'>
                        {data.order_payment_type}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className='text-sm opacity-90 pr-4 py-2 text-gray-700'>
                                        Nomor Pemesanan
                                    </td>
                                    <td className='text-sm opacity-90 uppercase py-2 text-gray-800 font-mono'>{`: `}
                                        {data.uuid}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-sm opacity-90 pr-4 py-2 text-gray-700'>
                                        Status Pemesanan
                                    </td>
                                    <td className='text-sm opacity-90 capitalize py-2'>{`: `}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.order_status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : data.order_status === 'settlement'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {data.order_status}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-sm opacity-90 pr-4 py-2 text-gray-700'>
                                        Status Transaksi
                                    </td>
                                    <td className='text-sm opacity-90 capitalize py-2'>{`: `}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${data?.payments[0]?.transaction_status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : data?.payments[0]?.transaction_status === 'settlement'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {data?.payments[0]?.transaction_status || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Actions for pending orders */}
                    {data.order_status === "pending" && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Lakukan Pembayaran
                            </h3>
                            <PaymentActionSection data={data} />
                        </div>
                    )}

                    {/* Link to tickets for completed orders */}
                    {data.order_status === "settlement" && (
                        <div className="border-t border-gray-200 pt-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <p className="text-green-800 text-sm font-medium">
                                    🎉 Pembayaran berhasil! Tiket batik Anda sudah siap.
                                </p>
                            </div>
                            <Link
                                href={`/tickets`}
                                className="text-white bg-purple-700 hover:bg-purple-800 disabled:hover:bg-purple-700 disabled:opacity-70 font-medium rounded-xl text-sm px-5 py-3 flex flex-row gap-2 items-center justify-center text-center mt-6 w-max transition-all duration-200 hover:shadow-lg"
                            >
                                <p>Tiket Saya</p>
                                <ArrowUpRight size={24} />
                            </Link>
                        </div>
                    )}

                    {/* Additional payment info for batik marketplace */}
                    {data.order_status === "pending" && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm">
                                💡 <strong>Tips:</strong> Untuk pembayaran QRIS dan e-wallet, transaksi biasanya dikonfirmasi dalam 1-2 menit.
                                Untuk transfer bank, konfirmasi dapat memakan waktu hingga 15 menit.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailSection;