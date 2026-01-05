"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How long does implementation take?",
      answer:
        "Typical deployment is 2-4 weeks. Complex integrations may take 6-8 weeks. We provide dedicated implementation support throughout the process, including knowledge base training and testing.",
    },
    {
      question: "Can the AI handle our specific industry terminology?",
      answer:
        "Yes. We train custom models on your documentation, call recordings, and knowledge base. The AI learns your products, processes, and brand voice to ensure accurate and consistent communication.",
    },
    {
      question: "What happens when the AI can't handle a call?",
      answer:
        "Seamless escalation to human agents with full context transfer. The AI recognizes its limitations and escalates proactively, not after frustrating the customer. Your agents receive complete conversation history and context.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Usage-based pricing with volume discounts. Most clients pay €0.25-0.50 per minute of AI handling time. We provide detailed ROI analysis before you commit, showing exactly how costs compare to your current operation.",
    },
    {
      question: "Where is our data stored?",
      answer:
        "EU data centers (Ireland and Frankfurt). We never transfer data outside the EU unless specifically requested. GDPR-compliant DPA included with all contracts. Full data deletion available upon request.",
    },
    {
      question: "Can we keep our existing phone numbers and systems?",
      answer:
        "Yes. VoiceFleet integrates via SIP trunking with any telephony provider. Your customers dial the same numbers they always have. No disruption to your existing infrastructure.",
    },
    {
      question: "What's the minimum commitment?",
      answer:
        "Annual contracts for enterprise. We offer a paid pilot program (typically 4-6 weeks) to prove ROI before full commitment. This allows you to validate results with real call volume before scaling.",
    },
    {
      question: "How do you handle multiple languages?",
      answer:
        "We support 20+ languages including Irish English, UK English, and major European languages. Multi-language deployments available with the same AI quality and natural conversation flow.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Enterprise <span className="text-gradient-primary">FAQ</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Common questions from contact center leaders
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

export default FAQSection;
