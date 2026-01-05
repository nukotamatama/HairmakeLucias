"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ConceptData = {
    title: string;
    subtitle: string;
    description: string;
};

export function Concept({ data }: { data?: ConceptData }) {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yTitle = useTransform(scrollYProgress, [0, 1], [0, -50]); // Reduced movement on mobile
    const yContent = useTransform(scrollYProgress, [0, 1], [20, -20]); // Reduced gap

    // Default fallback if no data provided
    const title = data?.title ?? "静寂と、美しさ。";
    const subtitle = data?.subtitle ?? "日常に、洗練された余白を。";
    const description = data?.description ?? `都会の喧騒を忘れさせる、静謐な空間。
髪を整えるだけでなく、心まで解きほぐすような特別な時間をご提供します。

一人ひとりの骨格や髪質に合わせた、
再現性の高いナチュラルなスタイル。

「余白」を楽しむ、大人のためのプライベートサロンです。`;

    return (
        <section id="concept" ref={sectionRef} className="py-24 md:py-40 bg-stone-50 overflow-hidden relative">
            {/* Background decoration (Zen circle or subtle shadow) */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-stone-200/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row gap-2 md:gap-24 relative z-10">

                    {/* Left: Sticky/Parallax Title - Mobile: Compact header */}
                    <div className="w-full md:w-1/3 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start md:sticky md:top-32 h-fit mb-8 md:mb-0">
                        <motion.div style={{ y: yTitle }} className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start w-full">
                            <span className="text-[10px] md:text-xs tracking-[0.4em] text-stone-400 uppercase block mb-2 md:mb-0 md:pl-1">
                                Concept
                            </span>
                            <div className="flex gap-4 items-center pl-8 md:pl-0 w-full justify-center md:justify-start">
                                <h2 className="font-serif text-2xl md:text-4xl text-stone-900 leading-relaxed text-center md:text-left tracking-widest mb-4">
                                    {title.replace(/\n/g, '')}
                                </h2>
                                <p className="font-sans text-sm md:text-base text-stone-500 tracking-widest leading-loose">
                                    {subtitle.replace(/\n/g, '')}
                                </p>
                            </div>
                            <div className="w-12 h-[1px] bg-stone-300 hidden md:block" />
                        </motion.div>
                    </div>

                    {/* Right: Content with Broken Grid feel */}
                    <motion.div style={{ y: yContent }} className="w-full md:w-1/2 md:mt-24 space-y-12 pl-4 md:pl-0">
                        {/* Vertical Text for decorative feel */}
                        <div className="absolute -right-4 top-0 text-stone-100 text-8xl font-serif opacity-40 select-none pointer-events-none writing-vertical-rl hidden md:block z-0">
                            美学
                        </div>

                        <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)] rounded-sm border-t border-stone-100">
                            <p className="text-sm md:text-base text-stone-600 leading-loose font-light whitespace-pre-wrap">
                                {description}
                            </p>

                            <div className="mt-12 flex justify-between items-end border-b border-stone-200 pb-2">
                                <span className="text-[10px] text-stone-400 tracking-widest uppercase">Philosophy</span>
                                <span className="font-serif italic text-stone-300 text-xl">
                                    Salon Website
                                </span>
                            </div>
                        </div>

                        {/* Image decoration placeholder */}
                        <div className="w-2/3 ml-auto h-px bg-stone-200" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
