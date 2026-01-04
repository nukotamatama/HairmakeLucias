import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section id="faq" className="py-20 md:py-32 bg-stone-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16 space-y-3">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-800">Q&A</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">よくあるご質問</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {items.map((faq) => (
                        <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border border-stone-200 bg-white px-4 md:px-8 rounded-sm data-[state=open]:border-stone-400 transition-colors">
                            <AccordionTrigger className="text-left font-serif text-stone-800 hover:no-underline hover:text-stone-600 py-6 text-sm md:text-base">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-stone-600 leading-loose font-light pb-6 text-sm">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
