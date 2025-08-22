"use client"

import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Clock, BookOpen, PlayCircle } from "lucide-react";
import { easeOut, motion } from "motion/react";

const quizzesData = [
  {
    id: 1,
    title: "Dasar-Dasar Batik: Uji Pengetahuan Fondasi Anda",
    description: "Sempurna untuk pemula! Uji pemahaman Anda tentang konsep dan sejarah dasar Batik.",
    questions: 10,
    duration: "5 menit",
    taken: 1247,
    rating: 4.8,
    tags: ["Fundamental"],
    level: "Pemula",
  },
  {
    id: 2,
    title: "Tantangan Pengenalan Pola Regional",
    description: "Bisakah Anda mengidentifikasi pola Batik dari berbagai daerah Indonesia? Uji kemampuan Anda!",
    questions: 15,
    duration: "8 menit",
    taken: 892,
    rating: 4.6,
    tags: ["Regional"],
    level: "Menengah",
  },
  {
    id: 3,
    title: "Mendalami Simbolisme Budaya",
    description: "Kuis lanjutan tentang makna budaya dan simbolisme di balik motif Batik tradisional.",
    questions: 20,
    duration: "12 menit",
    taken: 456,
    rating: 4.9,
    tags: ["Budaya"],
    level: "Lanjutan",
  },
  {
    id: 4,
    title: "Garis Waktu Sejarah Batik",
    description: "Perjalanan melalui perkembangan historis seni Batik di berbagai periode waktu.",
    questions: 12,
    duration: "7 menit",
    taken: 678,
    rating: 4.7,
    tags: ["Sejarah"],
    level: "Menengah",
  },
];

interface QuizProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, ease: easeOut },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Quiz: React.FC<QuizProps> = ({ selectedLevel, setSelectedLevel }) => {
  const filterByLevel = (items: typeof quizzesData, level: string) => {
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
          className={`${selectedLevel === "Semua Level"
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
              className={`${selectedLevel === level
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
        {filterByLevel(quizzesData, selectedLevel).map((quiz, index) => (
          <motion.div
            key={quiz.id}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: index * 0.2 }}
            className="h-full"
          >
            <Card className="bg-black border border-gray-700 hover:border-gray-500 transition-all duration-200 h-full">
              <CardBody className="p-6 text-white flex flex-col h-full">
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
                  {quiz.tags.map((tag) => (
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
                    className={`${getLevelColor(quiz.level)} px-2`}
                  >
                    {quiz.level}
                  </Chip>
                </motion.div>
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-semibold mb-3 min-h-[3.5rem] line-clamp-2"
                >
                  {quiz.title}
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-400 text-sm mb-6 flex-grow min-h-[3rem] line-clamp-3"
                >
                  {quiz.description}
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="gap-3 mb-6 text-sm flex w-full justify-between items-center"
                >
                  <div className="flex items-center gap-2 text-gray-300">
                    <BookOpen size={16} className="text-gray-500 align-middle relative top-[1px]" />
                    <p className="leading-none">{quiz.questions} pertanyaan</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={16} className="text-gray-500 align-middle relative top-[1px]" />
                    <span className="leading-none">{quiz.duration}</span>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium flex items-center justify-center gap-2" size="md">
                    <PlayCircle size={18} />
                    Mulai Kuis
                  </Button>
                </motion.div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
