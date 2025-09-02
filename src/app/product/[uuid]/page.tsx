'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Store } from 'lucide-react';
import { motion } from 'framer-motion';
import RequestAPI from '@/helper/http';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import Loading from '@/components/Loading';
import ProductImage from '@/components/Product/ProductImage';
import { LoginModal } from '@/components/LoginModal';
import { isUserLoggedIn } from '@/lib/GetUserData';

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
    product_type: 'digital' | 'physical';
    name: string;
    description: string;
    price: number;
    stock: number;
    keywords: string;
    thumbnails: Thumbnail[];
    digital_files: DigitalFile[];
}

interface ProductApiResponse {
    status: number;
    message: string;
    body: Product;
}

const Page: React.FC = () => {
    const params = useParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    useEffect(() => {
        initializeOrder();
        checkLoginStatus();
    }, [params.uuid]);

    const checkLoginStatus = (): void => {
        try {
            const loggedIn = isUserLoggedIn();
            setIsLoggedIn(loggedIn);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const initializeOrder = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError('');

            if (!params.uuid) {
                router.push('/');
                return;
            }

            await fetchProductDetails(params.uuid as string);
        } catch (error) {
            console.error('Error initializing order:', error);
            setError('Terjadi kesalahan saat memuat data produk');
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProductDetails = async (productUuid: string): Promise<void> => {
        try {
            const response: ProductApiResponse = await RequestAPI(`/product/${productUuid}`, 'get');

            if (response.status === 200) {
                setProduct(response.body);
            } else {
                throw new Error(response.message || 'Failed to fetch product details');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Gagal memuat detail produk');
            router.push('/');
        }
    };

    const handleLoginRequired = (): void => {
        setIsLoginModalOpen(true);
    };

    const handleLoginSuccess = (): void => {
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        checkLoginStatus();
    };
    const handleCloseLoginModal = (): void => {
        setIsLoginModalOpen(false);
    };
    if (isLoading) {
        return <Loading />;
    }
    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto px-6"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <Store size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Produk Tidak Ditemukan
                    </h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Produk yang Anda cari mungkin sudah tidak tersedia atau telah dihapus
                    </p>
                    <HoverBorderGradient
                        containerClassName="rounded-xl"
                        as="button"
                        className="bg-black text-white px-8 py-4 font-medium"
                        onClick={() => router.push('/')}
                    >
                        Kembali ke Beranda
                    </HoverBorderGradient>
                </motion.div>
            </div>
        );
    }
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                <div className="relative z-10 pt-32 pb-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-0">
                        <ProductImage
                            product={product}
                            isLoggedIn={isLoggedIn}
                            onLoginRequired={handleLoginRequired}
                        />
                    </div>
                </div>
            </div>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseLoginModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
};

export default Page;