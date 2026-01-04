import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function ReservationButton({ url, tel }: { url?: string, tel?: string }) {
    if (!url) return null;

    return (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8 z-40 animate-bounce-slow flex flex-row md:flex-col gap-3 items-center justify-end md:items-end pointer-events-none">
            {/* Mobile Call Button */}
            {tel && (
                <Button
                    variant="outline"
                    className="md:hidden h-14 w-14 rounded-full shadow-xl bg-white border-stone-200 text-stone-800 hover:bg-stone-50 flex flex-col items-center justify-center gap-0.5 pointer-events-auto"
                    asChild
                >
                    <a href={`tel:${tel}`} aria-label="電話をかける">
                        <Phone size={20} className="mb-0.5" />
                        <span className="text-[9px] font-medium tracking-wide leading-none">TEL</span>
                    </a>
                </Button>
            )}

            <Button
                variant="primary"
                size="lg"
                className="shadow-xl rounded-full px-8 py-0 h-14 flex flex-col justify-center items-center pointer-events-auto min-w-[140px]"
                asChild
            >
                <Link href={url} target="_blank" rel="noopener noreferrer">
                    <span className="text-sm font-serif tracking-widest">Web予約</span>
                </Link>
            </Button>
        </div>
    );
}
