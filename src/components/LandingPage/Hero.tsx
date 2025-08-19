import { Button } from "@heroui/react"
import { Camera } from "lucide-react";
import { motion } from "motion/react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import Link from "next/link";

const Hero = () => {
  const handleMarketplace = () => {
    console.log("Marketplace clicked");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 md:pt-32">
      <div className="text-center w-full max-w-7xl mx-auto">
        <div className="px-4 py-10 sm:py-12 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-7xl text-center text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white dark:text-slate-300 leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
            {"Temukan Keindahan Budaya Batik Indonesia"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-sm sm:text-base md:text-lg lg:text-xl font-normal text-gray-300 px-2"
          >
            Jelajahi pola batik tradisional dengan pengenalan berbasis AI, belanja desain digital, dan pelajari warisan budaya batik Indonesia.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
          >
            <Link href="#" className="w-full sm:w-auto">
              <HoverBorderGradient
                containerClassName="rounded-lg w-full sm:w-auto"
                as="button"
                className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer w-full sm:w-auto px-4 py-2"
              >
                <Camera size={18} className="sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Pengenalan AI</span>
              </HoverBorderGradient>
            </Link>

            <Button as={Link} href="/marketplace"
              className="font-bold text-black bg-white text-sm sm:text-base w-full sm:w-auto"
              onPress={handleMarketplace}
            >
              Jelajahi Marketplace
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero;