import { Star, Download } from "lucide-react";
import { motion } from "motion/react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Kawung",
        category: "Traditional",
        description: "Four-lobed pattern inspired by the kawung fruit",
        rating: 4.7,
        downloads: 1560,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "kawung"
    },
    {
        id: 2,
        name: "Parang",
        category: "Traditional",
        description: "Diagonal knife pattern symbolizing strength",
        rating: 4.8,
        downloads: 2340,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "parang"
    },
    {
        id: 3,
        name: "Mega Mendung",
        category: "Regional",
        description: "Cloud pattern from Cirebon batik tradition",
        rating: 4.6,
        downloads: 890,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "mega-mendung"
    },
    {
        id: 4,
        name: "Truntum",
        category: "Traditional",
        description: "Flower pattern representing eternal love",
        rating: 4.9,
        downloads: 3120,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "truntum"
    },
    {
        id: 5,
        name: "Sido Mukti",
        category: "Wedding",
        description: "Blessing pattern for prosperity and happiness",
        rating: 4.5,
        downloads: 1890,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "sido-mukti"
    },
    {
        id: 6,
        name: "Lereng",
        category: "Regional",
        description: "Diagonal stripes with traditional motifs",
        rating: 4.4,
        downloads: 670,
        price: 219.999,
        image: "/assets/fitur1.jpg",
        pattern: "lereng"
    }
];

const Product = () => {
    const handleCardClick = (product) => {
        console.log(`Clicked on ${product.name}`);
    };

    return (
        <div className="mt-12 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-0 px-4">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
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
                            onClick={() => handleCardClick(product)}
                            className="bg-black rounded-xl border-2 border-gray-600 overflow-hidden hover:border-gray-400 transition-all duration-300 cursor-pointer"
                        >
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
                                            src={product.image}
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0 text-white">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold">{product.name}</h3>
                                    <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">{product.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Download size={16} />
                                        <span className="text-sm">{product.downloads.toLocaleString('en-US')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold">Rp{product.price}</span>
                                        <p className="text-xs text-gray-400 mt-1">SVG License</p>
                                    </div>
                                    <HoverBorderGradient
                                        containerClassName="rounded-lg"
                                        as="button"
                                        className="bg-gray-800 text-white cursor-pointer px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();y
                                            console.log(`Buy license for ${product.name}`);
                                        }}
                                    >
                                        <span className="font-bold text-sm">Buy License</span>
                                    </HoverBorderGradient>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Product