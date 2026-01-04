"use client";

import { useState, useRef, useEffect } from "react";
import { MenuItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type MenuListProps = {
    menuItems: MenuItem[];
};

export function MenuList({ menuItems }: MenuListProps) {
    // Fixed category order to match Admin
    const ORDERED_CATEGORIES = ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"];

    // Get unique categories from items
    const availableCategories = Array.from(new Set(menuItems.map((item) => item.category)));

    // Sort available categories based on the fixed order
    const categories = ORDERED_CATEGORIES.filter(cat => availableCategories.includes(cat));

    // Fallback: Append any categories that might be in items but not in fixed list (e.g. legacy data)
    const extraCategories = availableCategories.filter(cat => !ORDERED_CATEGORIES.includes(cat));
    categories.push(...extraCategories);

    // State for mobile tabs
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

    // Scroll detection for gradients
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [categories]);

    return (
        <section id="menu" className="py-20 md:py-32 bg-stone-50 border-t border-stone-100 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 space-y-3">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-800">Menu</h2>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">メニュー</span>
                    </div>
                </div>

                {/* Mobile: Sticky Category Tabs */}
                <div className="md:hidden sticky top-20 z-40 bg-stone-50/95 backdrop-blur-sm -mx-4 mb-8 border-b border-stone-200/50">
                    <div className="relative">
                        {/* Left Scroll Hint */}
                        <div
                            className={cn(
                                "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-50 via-stone-50/90 to-transparent pointer-events-none flex items-center justify-start pl-1 transition-opacity duration-300 z-10",
                                canScrollLeft ? "opacity-100" : "opacity-0"
                            )}
                        >
                            <div className="animate-pulse text-stone-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            onScroll={checkScroll}
                            className="overflow-x-auto scrollbar-hide py-4 px-4"
                        >
                            <div className="flex gap-4 min-w-max">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setActiveCategory(category);
                                        }}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-serif tracking-wider transition-colors whitespace-nowrap",
                                            activeCategory === category ? "text-stone-900 font-medium" : "text-stone-400"
                                        )}
                                    >
                                        {category}
                                        {activeCategory === category && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Scroll Hint */}
                        <div
                            className={cn(
                                "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-50 via-stone-50/90 to-transparent pointer-events-none flex items-center justify-end pr-1 transition-opacity duration-300 z-10",
                                canScrollRight ? "opacity-100" : "opacity-0"
                            )}
                        >
                            <div className="animate-pulse text-stone-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="hidden md:grid md:grid-cols-2 gap-16 md:gap-x-24 items-start">
                    {/* Desktop: Show All in 2 Columns */}
                    {categories.map((category) => (
                        <div key={category} className="space-y-8 break-inside-avoid">
                            <h3 className="text-xl font-serif text-stone-800 border-b border-stone-300 pb-2 text-left">
                                {category}
                            </h3>
                            <ul className="space-y-6">
                                {menuItems
                                    .filter((item) => item.category === category)
                                    .map((item) => (
                                        <MenuItemRow key={item.id} item={item} />
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mobile: Show Filtered Only */}
                <div className="md:hidden min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-2xl font-serif text-stone-800 mb-8 text-center hidden">
                                {activeCategory}
                            </h3>
                            <ul className="space-y-8">
                                {menuItems
                                    .filter((item) => item.category === activeCategory)
                                    .map((item) => (
                                        <MenuItemRow key={item.id} item={item} />
                                    ))}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}

// Subcomponent for cleaner render
function MenuItemRow({ item }: { item: MenuItem }) {
    return (
        <li className="flex flex-col justify-between items-baseline gap-1 group">
            <div className="flex justify-between items-baseline w-full">
                <h4 className="text-base md:text-lg font-medium text-stone-700 group-hover:text-stone-900 transition-colors relative">
                    {item.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-stone-400 transition-all group-hover:w-full opacity-50" />
                </h4>
                <div className="flex-1 border-b border-dotted border-stone-300 mx-4 relative top-[-4px] hidden md:block opacity-50" />
                <span className="font-serif text-stone-800 text-sm md:text-base">
                    ¥{item.price.toLocaleString()}
                </span>
            </div>
            {item.description && (
                <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed tracking-wide">
                    {item.description}
                </p>
            )}
        </li>
    );
}
