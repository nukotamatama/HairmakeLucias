"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type SalonSpaceData = {
    title: string;
    description: string;
    images: { src: string; alt: string }[];
};

export function SalonSpace({ data }: { data?: SalonSpaceData }) {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [50, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100]);

    // Fallbacks
    const title = data?.title ?? "Healing Moment";
    const description = data?.description ?? "日常の喧騒を忘れさせる、落ち着いた空間。\n周りを気にせず、\n心からくつろげるひとときをお過ごしいただけます。\n\n木の温もりと柔らかな自然光に包まれた\n癒やしの時間をご提供します。";
    const images = data?.images || [
        { src: "/images/salon_interior_1.jpg", alt: "Main Cutting Area" },
        { src: "/images/salon_interior_2.jpg", alt: "Shampoo Station" },
        { src: "/images/salon_interior_3.jpg", alt: "Waiting Area" },
    ];

    // Ensure we have at least 3 images for the layout
    const img1 = images[0] || { src: "", alt: "" };
    const img2 = images[1] || { src: "", alt: "" };
    const img3 = images[2] || { src: "", alt: "" };

    return (
        <section id="space" ref={sectionRef} className="py-24 md:py-40 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">

                <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">

                    {/* Left: Text Content */}
                    <div className="w-full md:w-1/3 space-y-8 text-center md:text-left z-10">
                        <div className="space-y-4">
                            <h2 className="font-serif text-3xl md:text-4xl text-stone-800 leading-tight">
                                {title}
                            </h2>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                                空間について
                            </p>
                        </div>
                        <p className="text-sm md:text-base text-stone-600 leading-loose font-light whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>

                    {/* Right: Modern Image Collage */}
                    <div className="w-full md:w-2/3 relative h-[500px] md:h-[600px]">
                        {/* Decorative circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-3xl opacity-60 pointer-events-none" />

                        {/* Image 1: Top Left (Vertical) */}
                        <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-5/12 aspect-[3/4] shadow-lg bg-stone-200 overflow-hidden">
                            {img1.src && (
                                <img
                                    src={img1.src}
                                    alt={img1.alt}
                                    className="object-cover transition-transform duration-700 w-full h-full hover:scale-105"
                                />
                            )}
                        </motion.div>

                        {/* Image 2: Middle Right (Horizontal) */}
                        <motion.div style={{ y: y2 }} className="absolute top-[20%] right-0 w-6/12 aspect-[4/3] shadow-xl z-10 bg-stone-300 overflow-hidden">
                            {img2.src && (
                                <img
                                    src={img2.src}
                                    alt={img2.alt}
                                    className="object-cover transition-transform duration-700 w-full h-full hover:scale-105"
                                />
                            )}
                        </motion.div>

                        {/* Image 3: Bottom Center (Vertical) */}
                        <motion.div style={{ y: y3 }} className="absolute bottom-0 left-[20%] w-5/12 aspect-[3/4] shadow-lg bg-stone-200 z-20 overflow-hidden">
                            {img3.src && (
                                <img
                                    src={img3.src}
                                    alt={img3.alt}
                                    className="object-cover transition-transform duration-700 w-full h-full hover:scale-105"
                                />
                            )}
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
