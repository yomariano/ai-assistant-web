"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOMEPAGE_FAQS_ES, PRICING_FAQS_ES } from "@/lib/marketing/faqs-es";

interface FAQSectionESProps {
  variant?: "homepage" | "pricing";
}

const FAQSectionES = ({ variant = "homepage" }: FAQSectionESProps) => {
  const faqs = variant === "pricing" ? PRICING_FAQS_ES : HOMEPAGE_FAQS_ES;

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Preguntas <span className="text-gradient-primary">Frecuentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Todo lo que necesitás saber sobre VoiceFleet
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSectionES;
