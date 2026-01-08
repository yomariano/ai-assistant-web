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
      question: "How do I forward my calls to VoiceFleet?",
      answer:
        "It's easy! After signup, we'll give you your VoiceFleet number. Then you simply set up call forwarding on your existing phone - we provide step-by-step instructions for all Irish providers (Eir, Vodafone, Three, etc.). Most people have it set up in under 5 minutes.",
    },
    {
      question: "Can it handle Irish accents and names?",
      answer:
        "Absolutely. Our AI is trained on Irish English and handles Irish accents, place names, and spelling naturally. Whether your caller is from Dublin, Cork, or Donegal, they'll be understood perfectly.",
    },
    {
      question: "What happens if the caller needs to speak to a human?",
      answer:
        "The AI can transfer callers to you directly, take a detailed message for callback, or mark urgent calls for immediate attention. You control how escalation works based on your preferences and availability.",
    },
    {
      question: "Can it book appointments in my calendar?",
      answer:
        "Yes! On Growth and Pro plans, VoiceFleet integrates with Google Calendar and Microsoft 365. The AI checks your availability, books appointments, and sends confirmation to both you and the caller.",
    },
    {
      question: "How quickly does it answer calls?",
      answer:
        "Under 1 second, every time. No hold music, no 'please wait' messages. Your callers get an immediate, professional response 24/7 - even at 3am on Christmas Day.",
    },
    {
      question: "Is my data safe and kept in Ireland?",
      answer:
        "Yes. All data is stored in EU data centres. We're fully GDPR compliant, and we never share your data with third parties. You can request full data deletion at any time.",
    },
    {
      question: "Can I customise what the AI says?",
      answer:
        "Completely. You set the greeting, the tone, how it handles different types of calls, what information to collect, and when to escalate. We even offer industry-specific templates to get you started quickly.",
    },
    {
      question: "What if I'm not happy with the service?",
      answer:
        "No contracts, cancel anytime. We're confident you'll love VoiceFleet, but if it's not right for your business, you can cancel with a click. No questions asked, no cancellation fees.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about VoiceFleet
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
