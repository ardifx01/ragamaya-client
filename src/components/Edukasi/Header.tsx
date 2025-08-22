"use client"

import { motion } from "motion/react";


const Header = () => {
    return (
        <div className="max-w-7xl mx-auto pt-13 pb-10">
            <motion.div
                initial={{ opacity: 0, x: -0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-white space-y-4 text-center lg:text-left"
            >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center">
                    {"Pusat Edukasi Batik"
                        .split(" ")
                        .map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.15,
                                    ease: "easeInOut",
                                }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                </h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                    className="text-gray-400 text-base md:text-lg text-center"
                >
                    Pelajari sejarah, makna, dan teknik batik Indonesia melalui artikel mendalam dan kuis interaktif
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Header