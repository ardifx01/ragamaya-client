'use client'

import { Star, Download, Package, Calendar, FileCheck, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import RequestAPI from "@/helper/http";
import { Image, Link, ScrollShadow } from "@heroui/react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { ProductGridSkeleton } from "../Marketplace/ProductSkeleton";

interface Thumbnail {
    thumbnail_url: string;
}

interface DigitalFile {
    file_url: string;
    description: string;
    extension: string;
}

interface Product {
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

interface ApiResponse {
    status: number;
    message: string;
    body: Product[];
    size: number;
}

interface OwnedProductsProps {
    onLoadingChange?: (loading: boolean) => void;
}

const fetchOwnedProducts = async (): Promise<ApiResponse> => {
    return await RequestAPI('/product/owned', 'get');
};

const OwnedProducts: React.FC<OwnedProductsProps> = ({ onLoadingChange }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadOwnedProducts = async () => {
        setLoading(true);
        onLoadingChange?.(true);

        try {
            const response = await fetchOwnedProducts();

            if (response.status === 200) {
                setProducts(response.body || []);
            } else {
                console.error('Failed to fetch owned products:', response.message);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching owned products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
            onLoadingChange?.(false);
        }
    };

    useEffect(() => {
        loadOwnedProducts();
    }, []);

    const handleDownload = async (file: DigitalFile, productName: string) => {
        try {
            const link = document.createElement('a');
            link.href = file.file_url;
            link.download = `${productName}.${file.extension}`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <section className="mt-12 pb-20" aria-label="Produk yang Anda miliki">
            <div className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <ProductGridSkeleton count={3} />
                ) : !products || products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32"
                    >
                        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                            <ShoppingBag size={60} className="text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Belum Ada Produk</h3>
                        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed mb-8">
                            Anda belum memiliki produk apapun. Mulai jelajahi koleksi batik digital kami untuk menambah ke library Anda.
                        </p>
                        <Link href="/products">
                            <HoverBorderGradient
                                containerClassName="rounded-xl"
                                as="button"
                                className="bg-black text-white flex items-center justify-center gap-2 px-6 py-3 font-semibold"
                            >
                                <ShoppingBag size={18} />
                                Jelajahi Produk
                            </HoverBorderGradient>
                        </Link>
                    </motion.div>
                ) : (
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className="flex items-center gap-3">
                                <FileCheck size={20} className="text-green-400" />
                                <p className="text-gray-400 text-sm">
                                    Anda memiliki {products.length} produk digital
                                </p>
                            </div>
                        </motion.div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            role="grid"
                            aria-label="Grid produk yang dimiliki"
                        >
                            <AnimatePresence>
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.uuid}
                                        layout
                                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        whileHover={{
                                            y: -12,
                                            transition: { duration: 0.3, ease: "easeOut" }
                                        }}
                                        className="group relative"
                                    >
                                        <div
                                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-500 h-full group-hover:shadow-2xl group-hover:shadow-white/10"
                                            role="gridcell"
                                        >
                                            <article className="h-full flex flex-col">
                                                <div className="relative overflow-hidden">
                                                    <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-800 to-gray-900">
                                                        <Image
                                                            src={product.thumbnails[0]?.thumbnail_url}
                                                            alt={`Motif batik ${product.name} - ${product.description}`}
                                                            className="object-cover"
                                                            width={500}
                                                            height={300}
                                                        />

                                                        {/* Owned Badge */}
                                                        <div className="absolute top-4 left-4 z-50 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                                                            <div className="flex items-center gap-1">
                                                                <FileCheck size={12} />
                                                                <span>Dimiliki</span>
                                                            </div>
                                                        </div>

                                                        {/* Product Type Badge */}
                                                        <div className="absolute top-4 right-4 z-50 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                                                            <p>{product.product_type}</p>
                                                        </div>

                                                        {/* Download Count */}
                                                        <div className="absolute bottom-4 right-4">
                                                            <div className="flex items-center gap-1 text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                                                                <Download size={12} />
                                                                <span>{product.digital_files.length} file</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                        {product.name}
                                                    </h3>

                                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                        {product.description}
                                                    </p>

                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-1" role="group" aria-label="Rating 4.5 dari 5 bintang">
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                                        aria-hidden="true"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-300 ml-1">4.5</span>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-green-400" role="group">
                                                            <Calendar size={14} aria-hidden="true" />
                                                            <span className="text-sm">Dibeli</span>
                                                        </div>
                                                    </div>

                                                    {/* Digital Files */}
                                                    {product.digital_files && product.digital_files.length > 0 && (
                                                        <div className="mb-6">
                                                            <h4 className="text-sm font-medium text-gray-300 mb-3">File Digital:</h4>
                                                            <ScrollShadow className="w-full max-h-[200px]" orientation="vertical" hideScrollBar>
                                                                <div className="space-y-2">
                                                                    {product.digital_files.map((file, fileIndex) => (
                                                                        <motion.button
                                                                            key={fileIndex}
                                                                            whileTap={{ scale: 0.98 }}
                                                                            onClick={() => handleDownload(file, product.name)}
                                                                            className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 group/file hover:scale-102"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                                                                                    <FileCheck size={12} className="text-blue-400" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <p className="text-xs text-white font-medium truncate max-w-[150px]">
                                                                                        {file.description || `File ${fileIndex + 1}`}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 uppercase">
                                                                                        .{file.extension}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Download size={14} className="text-gray-400 group-hover/file:text-blue-400 transition-colors" />
                                                                        </motion.button>
                                                                    ))}
                                                                </div>
                                                            </ScrollShadow>
                                                        </div>
                                                    )}

                                                    <div className="flex items-end justify-between mt-auto">
                                                        <div>
                                                            <div className="text-2xl font-bold text-white" aria-label={`Harga: Rp${product.price.toLocaleString('id-ID')}`}>
                                                                Rp{product.price.toLocaleString('id-ID')}
                                                            </div>
                                                            <p className="text-xs text-green-400 mt-1">
                                                                ✓ Sudah dibeli
                                                            </p>
                                                        </div>

                                                        <Link href={`/product/${product.uuid}`}>
                                                            <HoverBorderGradient
                                                                containerClassName="rounded-xl"
                                                                as="button"
                                                                className="bg-black text-white flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm border border-white"
                                                                aria-label="Lihat detail produk"
                                                            >
                                                                <Package size={16} />
                                                                Lihat Detail
                                                            </HoverBorderGradient>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OwnedProducts;