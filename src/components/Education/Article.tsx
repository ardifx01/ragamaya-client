"use client"

import {  Button, Chip, Image } from "@heroui/react";
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

const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit baca`;
};

const getExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
};

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
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 h-full">
                <div className="p-0">
                  <div className="w-full h-[250px] bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"></div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-16 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"></div>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl mb-3 w-3/4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-2/3"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-1/3"></div>
                      <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-1/4"></div>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 max-w-7xl mx-auto text-center">
        <div className="bg-red-900/20 backdrop-blur-sm border-2 border-red-700 rounded-2xl p-1">
          <div className="p-6">
            <p className="text-red-400">Error loading articles: {error}</p>
            <Button 
              className="mt-4 bg-red-700 hover:bg-red-600 text-white rounded-2xl"
              onPress={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mt-8 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-1">
          <div className="p-6">
            <p className="text-gray-400">Tidak ada artikel yang ditemukan.</p>
          </div>
        </div>
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
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] h-full rounded-2xl shadow-xl">
              <div className="flex flex-col h-full">
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={700}
                    height={250}
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                </motion.div>

                <div className="p-6 text-white flex flex-col flex-grow">
                  <motion.div variants={itemVariants} className="flex gap-2 mb-3">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full border border-white/20"
                    >
                      {article.category.name}
                    </Chip>
                  </motion.div>

                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold line-clamp-2 mb-3 hover:text-gray-300 transition-colors"
                  >
                    {article.title}
                  </motion.h3>

                  <motion.p
                    variants={itemVariants}
                    className="text-gray-300 text-sm mb-10 line-clamp-3 flex-grow leading-relaxed"
                  >
                    {getExcerpt(article.content)}
                  </motion.p>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-300 mb-4"
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
                        className="w-full text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                        size="md"
                        endContent={
                          <MoveRight
                            size={18}
                            strokeWidth={2.5}
                            className="align-middle relative top-[1px] group-hover:translate-x-1 transition-transform duration-300"
                          />
                        }
                      >
                        Baca Artikel
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Article;