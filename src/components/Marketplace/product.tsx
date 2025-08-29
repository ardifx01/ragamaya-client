import { Star, Download, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import RequestAPI from "@/helper/http";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { Button, Image, Link } from "@heroui/react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

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

interface ApiResponse {
  status: number;
  message: string;
  body: Product[];
  size: number;
}

interface ProductProps {
  searchKeyword: string;
  onLoadingChange?: (loading: boolean) => void;
  pageSize?: number;
}

const fetchProducts = async (keyword: string = '', page: number = 1, pageSize: number = 9): Promise<ApiResponse> => {
  const params = {
    keyword,
    page: page.toString(),
    page_size: pageSize.toString()
  };

  return await RequestAPI('/product/search', 'get', params);
};

const Product: React.FC<ProductProps> = ({
  searchKeyword,
  onLoadingChange,
  pageSize = 9
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadProducts = async (keyword: string = '', page: number = 1) => {
    setLoading(true);
    onLoadingChange?.(true);

    try {
      const response = await fetchProducts(keyword, page, pageSize);

      if (response.status === 200) {
        setProducts(response.body || []);
        setTotalItems(response.size || 0);

        const calculatedTotalPages = Math.ceil((response.size || 0) / pageSize);
        setTotalPages(calculatedTotalPages);

      } else {
        console.error('Failed to fetch products:', response.message);
        setProducts([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts(searchKeyword, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(searchKeyword, 1);
  }, [searchKeyword]);

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section className="mt-12 pb-20" aria-label="Daftar produk batik">
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 opacity-20">
              <SearchX size={100} className="text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500">
              {searchKeyword ? `Tidak ada hasil untuk "${searchKeyword}"` : 'Tidak ada produk tersedia'}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                Menampilkan {(products || []).length} dari {totalItems} produk
                {searchKeyword && ` untuk "${searchKeyword}"`}
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="grid"
              aria-label="Grid produk batik"
            >
              {(products || []).map((product, index) => (
                <motion.div
                  key={product.uuid}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className="bg-black rounded-xl border-2 border-gray-600 overflow-hidden hover:border-gray-400 transition-all duration-300 cursor-pointer"
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`Produk batik ${product.name}, kategori ${product.product_type}, harga Rp${product.price.toLocaleString('id-ID')}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                >
                  <article className="h-full">
                    <div className="relative p-4 pb-0">
                      <div
                        className="w-full h-48 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 mb-4 overflow-hidden"
                        style={{
                          backgroundImage: "repeating-linear-gradient(45deg, #92400e 0px, #92400e 4px, #f59e0b 4px, #f59e0b 8px)",
                          backgroundSize: "16px 16px"
                        }}
                      >
                        <div className="w-full h-full bg-black bg-opacity-10">
                          <Image
                            src={product.thumbnails[0]?.thumbnail_url}
                            alt={`Motif batik ${product.name} - ${product.description}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEzMCA4MEgxNzBMMTUwIDEwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHN2Zz4K';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold truncate flex-1 mr-2">{product.name}</h3>
                        <span
                          className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full flex-shrink-0"
                          aria-label={`Tipe produk: ${product.product_type}`}
                        >
                          {product.product_type}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1" role="group" aria-label="Rating 4.5 dari 5 bintang">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" aria-hidden="true" />
                          <span className="text-sm font-medium" aria-label="Rating: 4.5">
                            4.5
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400" role="group" aria-label={`${Math.floor(Math.random() * 1000) + 100} unduhan`}>
                          <Download size={16} aria-hidden="true" />
                          <span className="text-sm">{Math.floor(Math.random() * 1000) + 100}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold" aria-label={`Harga: Rp${product.price.toLocaleString('id-ID')}`}>
                            Rp{product.price.toLocaleString('id-ID')}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <Link href="/" aria-label="Button beli produk" className="w-full flex justify-end">
                          <HoverBorderGradient
                            containerClassName="rounded-lg"
                            as="button"
                            className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer px-4 sm:px-5 py-3 w-full sm:w-auto"
                            aria-label="Tombol menuju page deteksi"
                          >
                            <p className="font-bold text-sm md:text-base">Beli Produk</p>
                          </HoverBorderGradient>
                        </Link>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </div>

            {totalItems > 0 && (
              <div className="p-4 flex items-center justify-between border-t border-gray-600 mt-8" role="navigation" aria-label="Navigasi halaman">
                <div className="text-sm text-gray-400">
                  Halaman <strong>{currentPage}</strong> dari <strong>{Math.max(1, totalPages)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium text-gray-400 px-2">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || totalPages <= 1 || loading}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;