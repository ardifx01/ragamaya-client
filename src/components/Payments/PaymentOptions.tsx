import { Accordion, AccordionItem } from "@heroui/react";
import Image from 'next/image'
import React from 'react'

interface PaymentOptionsProps {
    basePrice?: number
    value: string | null
    onChange: (value: string | null) => void
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ basePrice, value, onChange }) => {
    const handleSelect = (param: string) => {
        if (value !== param) {
            onChange(param);
        } else {
            onChange(null)
        }
    }

    return (
        <div className='w-full'>
            <Accordion
                variant="bordered"
                className="border border-white/30 rounded-lg"
                classNames={{
                    title: "text-white",
                }}
            >
                <AccordionItem
                    key="qris"
                    aria-label="QRIS Payment"
                    title="QRIS (Semua pembayaran)"
                    classNames={{
                        base: "border-b border-white/30",
                        title: "text-white font-medium",
                        content: "text-white"
                    }}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'qris' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("qris")}
                        >
                            <Image src="/payments/qris.svg" alt="qris" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'gopay' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("gopay")}
                        >
                            <Image src="/payments/gopay.svg" alt="gopay" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'shopeepay' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("shopeepay")}
                        >
                            <Image src="/payments/shopeepay.svg" alt="shopeepay" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="virtual-account"
                    aria-label="Virtual Account"
                    title="Virtual Account (Bank Transfer)"
                    classNames={{
                        base: "border-b border-white/30", // supaya tiap item ada garis bawah
                        title: "text-white font-medium",
                        content: "text-white"
                    }}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'bca' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("bca")}
                        >
                            <Image src="/payments/bca.svg" alt="bca" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'bri' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("bri")}
                        >
                            <Image src="/payments/bri.svg" alt="bri" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'bni' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("bni")}
                        >
                            <Image src="/payments/bni.svg" alt="bni" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'cimb' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("cimb")}
                        >
                            <Image src="/payments/cimb.svg" alt="cimb" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'maybank' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("maybank")}
                        >
                            <Image src="/payments/maybank.png" alt="maybank" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'permata' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("permata")}
                        >
                            <Image src="/payments/permata.svg" alt="permata" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'mega' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("mega")}
                        >
                            <Image src="/payments/mega.svg" alt="mega" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="minimarket"
                    aria-label="Minimarket"
                    title="Minimarket (Indomaret/Alfamart)"
                    classNames={{
                        base: "border-b border-white/30", // supaya tiap item ada garis bawah
                        title: "text-white font-medium",
                        content: "text-white"
                    }}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'indomaret' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("indomaret")}
                        >
                            <Image src="/payments/indomaret.png" alt="indomaret" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                        <div
                            className={`mx-auto sm:mx-none rounded-lg bg-gradient-to-br from-purple-300 to-pink-300 p-4 select-none cursor-pointer transition-all duration-300 ${value === 'alfamart' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 brightness-110' : ''}`}
                            onClick={() => handleSelect("alfamart")}
                        >
                            <Image src="/payments/alfamart.svg" alt="alfamart" width={200} height={50} className='h-[50px] w-[200px] mb-2 object-contain' />
                            <p className='text-sm text-left border-b border-black/50 pb-1'>Rp {basePrice?.toLocaleString('id-ID') || 0}</p>
                            <p className='text-left text-xs pt-2 italic opacity-70'>Biaya Admin +0%</p>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default PaymentOptions