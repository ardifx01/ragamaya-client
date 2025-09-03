"use client"

import { Card, CardBody, Button, Chip, Image } from "@heroui/react";
import { Clock, MoveRight } from "lucide-react";
import { easeOut, motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import RequestAPI from "@/helper/http";

interface Category {
  uuid: string;
  name: string;
}

interface Article {
  uuid: string;
  slug: string;
  title: string;
  thumbnail: string;
  content: string;
  created_at: string;
  category: Category;
}

interface ApiResponse {
  status: number;
  message: string;
  body: Article[];
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

// Helper function to calculate reading time
const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit baca`;
};

// Helper function to get excerpt from content
const getExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Article = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await RequestAPI("/article/search", 'get');
      setArticles(data.body || []);
      setError(null);
    } catch (err) {
      setError('Gagal memuat artikel');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  fetchArticles();
}, []);

  if (loading) {
    return (
      <div className="mt-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className="bg-black border-2 border-gray-700 h-full">
                <CardBody className="p-0">
                  <div className="w-full h-[250px] bg-gray-800"></div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-16 bg-gray-800 rounded"></div>
                    </div>
                    <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-800 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                    </div>
                    <div className="h-10 bg-gray-800 rounded"></div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 max-w-7xl mx-auto text-center">
        <Card className="bg-red-900/20 border-2 border-red-700">
          <CardBody className="p-6">
            <p className="text-red-400">Error loading articles: {error}</p>
            <Button 
              className="mt-4 bg-red-700 hover:bg-red-600 text-white"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mt-8 max-w-7xl mx-auto text-center">
        <Card className="bg-black border-2 border-gray-700">
          <CardBody className="p-6">
            <p className="text-gray-400">Tidak ada artikel yang ditemukan.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.uuid}
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
                    src={article.thumbnail}
                    alt={article.title}
                    width={700}
                    height={250}
                    className="object-cover"
                    fallbackSrc="/assets/fitur1.jpg"
                  />
                </motion.div>

                <div className="p-6 text-white flex flex-col flex-grow">
                  <motion.div variants={itemVariants} className="flex gap-2 mb-3">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-gray-800 text-gray-300 px-2"
                    >
                      {article.category.name}
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
                    {getExcerpt(article.content)}
                  </motion.p>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-400 mb-4"
                  >
                    <span>{formatDate(article.created_at)}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="align-middle relative top-[1px]" />
                        <span className="leading-none">{calculateReadingTime(article.content)}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-auto">
                    <Link href={`education/article/${article.slug}`}>
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
                    </Link>
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