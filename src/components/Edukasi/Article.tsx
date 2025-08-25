"use client"

import { Card, CardBody, Button, Chip, Image } from "@heroui/react";
import { Clock, MoveRight } from "lucide-react";
import { easeOut, motion } from "motion/react";

const articlesData = [
  {
    id: 1,
    title: "Seni Kuno Batik: Perjalanan Melalui Waktu",
    description: "Temukan sejarah kaya Batik, dari asal-usulnya di Jawa kuno hingga pengakuannya sebagai Warisan Dunia UNESCO.",
    author: "Dr. Sari Kusuma",
    readTime: "8 menit baca",
    likes: 156,
    tags: ["Sejarah"],
    image: "/assets/fitur1.jpg",
    level: "Pemula",
  },
  {
    id: 2,
    title: "Memahami Simbolisme Batik: Membaca Cerita dalam Pola",
    description: "Pelajari cara memecahkan kode makna tersembunyi di balik motif Batik tradisional dan memahami signifikansi budayanya.",
    author: "Prof. Ahmad Wijaya",
    readTime: "12 menit baca",
    likes: 203,
    tags: ["Budaya"],
    image: "/assets/fitur1.jpg",
    level: "Menengah",
  },
  {
    id: 3,
    title: "Gaya Batik Regional: Dari Solo hingga Pekalongan",
    description: "Jelajahi karakteristik khas Batik dari berbagai daerah di seluruh Indonesia dan keunikan masing-masing wilayah.",
    author: "Dr. Ratna Sari",
    readTime: "15 menit baca",
    likes: 189,
    tags: ["Regional"],
    image: "/assets/fitur1.jpg",
    level: "Lanjutan",
  },
  {
    id: 4,
    title: "Seni Membuat Batik: Teknik Tradisional",
    description: "Panduan langkah demi langkah untuk proses pembuatan Batik tradisional termasuk aplikasi lilin dan pencelupan warna.",
    author: "Master Sutejo",
    readTime: "20 menit baca",
    likes: 267,
    tags: ["Teknik"],
    image: "/assets/fitur1.jpg",
    level: "Lanjutan",
  },
];

interface ArticleProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      ease: easeOut,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Article: React.FC<ArticleProps> = ({ selectedLevel, setSelectedLevel }) => {
  const filterByLevel = (items: typeof articlesData, level: string) => {
    if (level === "Semua Level") return items;
    return items.filter((item) => item.level === level);
  };

  const getLevelColor = (level: string) => {
    const levelColors: Record<string, string> = {
      Pemula: "bg-green-100 text-green-800",
      Menengah: "bg-yellow-100 text-yellow-800",
      Lanjutan: "bg-red-100 text-red-800",
    };
    return levelColors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mt-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-8 md:flex-row md:flex-wrap md:justify-center">
        <Button
          variant={selectedLevel === "Semua Level" ? "solid" : "bordered"}
          color={selectedLevel === "Semua Level" ? "primary" : "default"}
          onPress={() => setSelectedLevel("Semua Level")}
          className={`${
            selectedLevel === "Semua Level"
              ? "bg-gray-700 text-white border-gray-500"
              : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
          }`}
        >
          Semua Level
        </Button>
        <div className="flex flex-wrap justify-center gap-3">
          {["Pemula", "Menengah", "Lanjutan"].map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "solid" : "bordered"}
              color={selectedLevel === level ? "primary" : "default"}
              onPress={() => setSelectedLevel(level)}
              className={`${
                selectedLevel === level
                  ? "bg-gray-700 text-white border-gray-500"
                  : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
              }`}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filterByLevel(articlesData, selectedLevel).map((article, index) => (
          <motion.div
            key={article.id}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: index * 0.2 }}
            className="h-full"
          >
            <Card className="bg-black border-2 border-gray-700 hover:border-gray-500 transition-all duration-200 h-full">
              <CardBody className="p-0 flex flex-col h-full">
                <motion.div variants={itemVariants}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={700}
                    height={250}
                    className="object-cover"
                  />
                </motion.div>

                <div className="p-6 text-white flex flex-col flex-grow">
                  <motion.div variants={itemVariants} className="flex gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        className="bg-gray-800 text-gray-300 px-2"
                      >
                        {tag}
                      </Chip>
                    ))}
                    <Chip
                      size="sm"
                      variant="flat"
                      className={`${getLevelColor(article.level)} px-2`}
                    >
                      {article.level}
                    </Chip>
                  </motion.div>
                  
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold line-clamp-2 mb-3"
                  >
                    {article.title}
                  </motion.h3>

                  <motion.p
                    variants={itemVariants}
                    className="text-gray-400 text-sm mb-10 line-clamp-3 flex-grow"
                  >
                    {article.description}
                  </motion.p>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-400 mb-4"
                  >
                    <span>Oleh {article.author}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="align-middle relative top-[1px]" />
                        <span className="leading-none">{article.readTime}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-auto">
                    <Button
                      className="w-full bg-white text-black hover:bg-gray-100 font-medium flex items-center justify-center gap-2"
                      size="md"
                      endContent={
                        <MoveRight
                          size={18}
                          strokeWidth={2.5}
                          className="align-middle relative top-[1px]"
                        />
                      }
                    >
                      Baca Artikel
                    </Button>
                  </motion.div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Article;
