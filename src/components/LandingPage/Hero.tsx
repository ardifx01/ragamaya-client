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
    <div className="flex items-center justify-center px-4 md:pt-32">
      <div className="text-center">
        <div className="px-4 py-10 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-7xl text-center text-3xl font-bold text-white md:text-4xl lg:text-7xl dark:text-slate-300 md:leading-23 leading-10">
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
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-sm md:text-lg font-normal text-gray-300"
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
            className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex justify-center gap-4 items-center">
              <Link href="#">
                <HoverBorderGradient
                  containerClassName="rounded-lg"
                  as="button"
                  className="bg-black text-white flex items-center space-x-2 border cursor-pointer"
                >
                  <Camera size={20} />
                  <span className="font-bold md:text-base text-sm">Pengenalan AI</span>
                </HoverBorderGradient>
              </Link>

              <Button
                className="font-bold text-black bg-white py-5"
                onPress={handleMarketplace}
              >
                Jelajahi Marketplace
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero;