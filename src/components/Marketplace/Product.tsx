import { Star, Download, ChevronLeft, ChevronRight, SearchX, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import RequestAPI from "@/helper/http";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { Image, Link } from "@heroui/react";
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
              <SearchX size={60} className="text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Produk Tidak Ditemukan</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              {searchKeyword
                ? `Maaf, tidak ada hasil yang cocok dengan pencarian "${searchKeyword}". Coba kata kunci lain.`
                : 'Tidak ada produk tersedia saat ini. Silakan periksa kembali nanti.'
              }
            </p>
          </motion.div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-400 text-sm">
                  Menampilkan {(products || []).length} dari {totalItems} produk
                  {searchKeyword && (
                    <span>
                      untuk <span className="text-white">{`"${searchKeyword}"`}</span>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400">
                  Halaman {currentPage} dari {Math.max(1, totalPages)}
                </div>
              </div>
            </motion.div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="grid"
              aria-label="Grid produk batik"
            >
              <AnimatePresence>
                {(products || []).map((product, index) => (
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
                    <Link
                      href={`/product/${product.uuid}`}
                      className="block h-full"
                      aria-label={`Lihat detail produk ${product.name}`}
                    >
                      <div
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-500 cursor-pointer h-full group-hover:shadow-2xl group-hover:shadow-white/10"
                        role="gridcell"
                        tabIndex={0}
                        aria-label={`Produk batik ${product.name}, kategori ${product.product_type}, harga Rp${product.price.toLocaleString('id-ID')}`}
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

                              <div className="absolute top-4 left-4 z-50 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                                <p>{product.product_type}</p>
                              </div>

                              {product.stock <= 5 && (
                                <div className="absolute bottom-4 left-4">
                                  <span className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                                    Stok Terbatas: {product.stock}
                                  </span>
                                </div>
                              )}
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

                              <div className="flex items-center gap-1 text-gray-400" role="group" aria-label={`${Math.floor(Math.random() * 1000) + 100} unduhan`}>
                                <Download size={14} aria-hidden="true" />
                                <span className="text-sm">{Math.floor(Math.random() * 1000) + 100}</span>
                              </div>
                            </div>

                            <div className="flex items-end justify-between mt-auto">
                              <div>
                                <div className="text-2xl font-bold text-white" aria-label={`Harga: Rp${product.price.toLocaleString('id-ID')}`}>
                                  Rp{product.price.toLocaleString('id-ID')}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  Stock: {product.stock} tersisa
                                </p>
                              </div>
                              <HoverBorderGradient
                                containerClassName="rounded-xl"
                                as="button"
                                className="bg-black text-white flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm border border-white"
                                aria-label="Beli produk sekarang"
                              >
                                <ShoppingCart size={16} />
                                Beli Sekarang
                              </HoverBorderGradient>
                            </div>
                          </div>
                        </article>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalItems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex items-center justify-center gap-8"
                role="navigation"
                aria-label="Navigasi halaman"
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, start + 4);
                        pageNum = start + i;
                        if (pageNum > end) return null;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 ${currentPage === pageNum
                            ? 'bg-white text-black border-2 border-white shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                            }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || totalPages <= 1 || loading}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;