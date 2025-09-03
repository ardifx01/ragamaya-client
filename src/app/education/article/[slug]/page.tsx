"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, Button, Chip, Image } from "@heroui/react";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
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

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit baca`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string): string => {
    const formattedContent = content
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6 text-white">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8 text-white">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-200">$1</code>')
      .replace(/\n\n+/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
      .replace(/\n/g, '<br>');

    const lines = formattedContent.split('</p><p class="mb-4 text-gray-300 leading-relaxed">');
    const processedLines = lines.map(line => {
      if (line.includes('* ')) {
        const bulletPoints = line
          .split('<br>')
          .map(item => {
            if (item.trim().startsWith('* ')) {
              return `<li class="ml-6 mb-2 text-gray-300">${item.replace(/^\* /, '')}</li>`;
            }
            return item;
          })
          .join('');

        return bulletPoints.replace(/(<li[^>]*>.*?<\/li>)+/g, match =>
          `<ul class="list-disc space-y-2 mb-4">${match}</ul>`
        );
      }
      return line;
    });

    return processedLines.join('</p><p class="mb-4 text-gray-300 leading-relaxed">');
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: `Baca artikel menarik: ${article.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackCopyToClipboard();
      }
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link artikel telah disalin ke clipboard!'))
        .catch(() => alert('Gagal menyalin link'));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link artikel telah disalin ke clipboard!');
      } catch (err) {
        alert('Gagal menyalin link');
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('Slug artikel tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await RequestAPI("/article/search", 'get');

        if (data.status === 200 && data.body) {
          const foundArticle = data.body.find((article: Article) => article.slug === slug);

          if (foundArticle) {
            setArticle(foundArticle);
            setOtherArticles(data.body.filter((article: Article) => article.uuid !== foundArticle.uuid).slice(0, 5));
          } else {
            setError('Artikel tidak ditemukan');
          }
        } else {
          throw new Error(data.message || 'Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto p-4 pt-20">
          <div className="animate-pulse">
            <div className="h-11 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-76 mb-8 mt-2 border border-white/20"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <div className="h-12 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-3/4 mb-6"></div>
                  <div className="flex gap-4 mb-8">
                    <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-20"></div>
                    <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-24"></div>
                  </div>
                  <div className="w-full h-96 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl mb-8"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                  <div className="h-8 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-32 mb-4"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 p-3 bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                        <div className="w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-full"></div>
                          <div className="h-3 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto p-4 pt-20 text-center">
          <Card className="bg-red-900/20 border-2 border-red-700">
            <CardBody className="p-8">
              <h1 className="text-2xl font-bold text-red-400 mb-4">Artikel Tidak Ditemukan</h1>
              <p className="text-red-300 mb-2">{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
              <p className="text-red-300 mb-6 text-sm">Slug: {slug}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                  onClick={() => router.back()}
                  startContent={<ArrowLeft size={18} />}
                >
                  Kembali
                </Button>
                <Link href="/">
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Ke Beranda
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10">
      <div className="max-w-7xl mx-auto p-4 pt-20">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
            <Link
              href="/education"
              className="flex items-center text-xs md:text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <BookOpen size={18} className="mr-2" />
              Edukasi
            </Link>
            <ChevronRight size={16} className="mx-3 text-gray-500" />
            <span className="text-white text-xs md:text-sm truncate max-w-48">
              {article.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300"
              aria-label="Share product"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </motion.nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <article className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm p-1 border border-white/20 rounded-lg shadow-xl">
              <div className="p-6 border-b border-gray-800">

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 mt-0.5" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 mt-0.5" />
                    <span>{calculateReadingTime(article.content)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 mt-0.5" />
                    <span>{article.category.name}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    className=" object-cover rounded-lg"
                    width={800}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
                </div>
              </div>

              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-gray-300 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{
                      __html: `<div class="article-content"><p class="mb-4 text-gray-300 leading-relaxed">${formatContent(article.content)}</p></div>`
                    }}
                  />
                </div>
              </div>
            </article>
          </div>

          <aside className="lg:w-1/3">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm  border border-white/20 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Artikel Lainnya
              </h2>

              <div className="space-y-4">
                {otherArticles.map((otherArticle) => (
                  <Link key={otherArticle.uuid} href={`/education/article/${otherArticle.slug}`}>
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                      <Image
                        src={otherArticle.thumbnail}
                        alt={otherArticle.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        fallbackSrc="/assets/fitur1.jpg"
                      />
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 hover:text-gray-300 transition-colors">
                          {otherArticle.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(otherArticle.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full border border-white/20 text-xs"
                            >
                              {otherArticle.category.name}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {otherArticles.length === 0 && (
                  <div className="text-gray-400 text-sm text-center py-4">
                    Tidak ada artikel lainnya
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800">
                <Link href="/education">
                  <Button
                    className="w-full text-white border border-white/20 px-5 py-6 rounded-2xl font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                    startContent={<ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />}
                  >
                    Lihat Semua Artikel
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}