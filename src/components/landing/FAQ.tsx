'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Can customers tell it's AI?",
        answer: "Our AI speaks natural Irish English with proper pronunciation and conversational flow. Most customers can't tell the difference, and many prefer it because there's no hold time or background noise. We've had restaurant owners say their customers thought they'd hired new staff!"
    },
    {
        question: "What if it gets an order wrong?",
        answer: "OrderBot reads back every order before confirming and asks clarifying questions when needed. If something doesn't sound right, it double-checks. You'll receive the full transcript with every order, so you can verify details before preparing. In our experience, AI makes fewer mistakes than rushed staff during busy periods."
    },
    {
        question: "How do I get notified of orders?",
        answer: "Instant notifications via SMS, email, or both—your choice. You'll receive the order details, customer phone number, and delivery/pickup time within seconds of the call ending. Many owners set up a dedicated tablet in the kitchen that pings for every new order."
    },
    {
        question: "Can it handle complex orders?",
        answer: "Absolutely! 'Large pepperoni, no mushrooms, extra cheese, deliver to Unit 5B at 7pm' is no problem. OrderBot handles modifications, special requests, allergies, and specific instructions. It's trained on your specific menu, so it knows what's possible and what combinations work."
    },
    {
        question: "Do I keep my existing phone number?",
        answer: "Yes! We set up call forwarding from your existing number, so customers call the same number they always have. No need to update menus, Google listings, or signage. Setup takes about 5 minutes with your phone provider."
    },
    {
        question: "Is it GDPR compliant?",
        answer: "100%. All data is stored in EU data centres, we don't sell or share customer information, and callers can request their data be deleted at any time. We're fully compliant with Irish data protection laws. You'll receive a Data Processing Agreement as part of onboarding."
    },
    {
        question: "What happens if I go over my call limit?",
        answer: "Extra calls are billed at €0.50 each—no surprise charges. You'll get a notification when you're approaching your limit so you can upgrade if needed. Most businesses find the Growth plan (500 calls) covers even their busiest months."
    },
    {
        question: "Can it handle multiple locations?",
        answer: "Yes! Our Pro plan supports unlimited locations with separate menus, phone numbers, and notification settings for each. Perfect for restaurant groups or franchises. Each location gets its own trained AI that knows that specific menu and operating hours."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">
                        FAQ
                    </h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Questions? We&apos;ve Got Answers
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Everything you need to know about OrderBot for your restaurant, café, or takeaway.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 flex-shrink-0 text-orange-500 transition-transform ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <HelpCircle className="h-5 w-5" />
                            <span>Still have questions?</span>
                        </div>
                        <p className="mt-2">
                            <a
                                href="mailto:support@voicefleet.ai"
                                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                            >
                                Email us at support@voicefleet.ai
                            </a>
                            <span className="text-gray-500"> or call </span>
                            <a
                                href="tel:+35315550123"
                                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                            >
                                01 555 0123
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
