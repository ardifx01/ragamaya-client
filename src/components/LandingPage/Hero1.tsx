"use client"

import { Button, Image, Link } from "@heroui/react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Camera } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero1 = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();
        const titleWords = titleRef.current?.querySelectorAll('.word');
        if (titleWords) {
            tl.fromTo(titleWords,
                {
                    opacity: 0,
                    filter: "blur(4px)",
                    y: 10
                },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    stagger: 0.1
                }
            );
        }

        if (descriptionRef.current) {
            tl.fromTo(descriptionRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out",
                },
                "-=0.2"
            );
        }

        if (buttonsRef.current) {
            tl.fromTo(buttonsRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                },
                "-=0.1"
            );
        }

        if (imageRef.current) {
            tl.fromTo(imageRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                    x: 50
                },
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                },
                "-=0.4"
            );
        }

    }, []);

    const renderAnimatedTitle = (text: string) => {
        return text.split(" ").map((word: string, index: number) => (
            <span key={index} className="word inline-block mr-2">
                {word}
            </span>
        ));
    };

    return (
        <div className="min-h-screen flex px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-16 sm:pt-24 md:pt-32 flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 xl:gap-16 w-full">
                <div className="w-full lg:basis-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
                    <div className="space-y-4 lg:space-y-5">
                        <h1
                            ref={titleRef}
                            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                        >
                            {renderAnimatedTitle("Jelajahi Budaya Batik Indonesia")}
                        </h1>
                        <p
                            ref={descriptionRef}
                            className="text-white text-sm md:text-lg max-w-full md:max-w-[600px] font-semibold mx-auto md:mx-0"
                        >
                            Platform AI terdepan untuk mengenali motif batik, belajar budaya, berbelanja, dan terhubung dengan komunitas pecinta Batik.
                        </p>
                    </div>
                    <div
                        ref={buttonsRef}
                        className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start"
                    >
                        <Link href="/deteksi" aria-label="MDeteksi Batik" className="w-full sm:w-auto">
                            <HoverBorderGradient
                                containerClassName="rounded-lg w-full sm:w-auto"
                                as="button"
                                className="bg-black text-white flex items-center justify-center space-x-2 border cursor-pointer px-4 sm:px-5 py-3 w-full sm:w-auto"
                                aria-label="Tombol menuju page deteksi"
                            >
                                <Camera size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                                <span className="font-bold text-sm md:text-base">Coba Deteksi Motif</span>
                            </HoverBorderGradient>
                        </Link>
                        <Button as={Link} href="/marketplace"
                            className="font-bold text-black bg-white rounded-lg text-sm sm:text-base w-full sm:w-auto py-3 sm:py-6">
                            Jelajahi Marketplace
                        </Button>
                    </div>
                </div>
                <div className="w-full lg:basis-1/2 flex justify-center lg:justify-end">
                    <div ref={imageRef} className="w-full max-w-md sm:max-w-lg lg:max-w-full">
                        <Image
                            src="/assets/fitur1.jpg"
                            alt="Hero"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero1;