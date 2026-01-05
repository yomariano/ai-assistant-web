import { Phone, Zap, ClipboardList, MessageSquare, CheckCircle } from 'lucide-react';

const steps = [
    {
        step: 1,
        icon: Phone,
        title: "Customer Calls",
        description: "They dial your number — same as always"
    },
    {
        step: 2,
        icon: Zap,
        title: "AI Answers in 0.5s",
        description: "\"Hi, thanks for calling! How can I help?\""
    },
    {
        step: 3,
        icon: ClipboardList,
        title: "Takes Order Naturally",
        description: "Handles modifications, questions, special requests"
    },
    {
        step: 4,
        icon: MessageSquare,
        title: "You Get SMS",
        description: "Full order details sent to your phone instantly"
    },
    {
        step: 5,
        icon: CheckCircle,
        title: "Order Ready",
        description: "Customer confirmed, you're already preparing"
    }
];

const setupSteps = [
    {
        step: 1,
        title: "Sign Up",
        description: "2-minute form. No credit card required for trial."
    },
    {
        step: 2,
        title: "Quick Onboarding Call",
        description: "15 mins. We learn your menu, hours, and style."
    },
    {
        step: 3,
        title: "We Build Your AI",
        description: "Custom voice, your menu, your FAQs. Ready in hours."
    },
    {
        step: 4,
        title: "Go Live",
        description: "Forward your calls or get a new number. Start taking orders."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Solution Flow */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">Meet Your 24/7 Order Taker</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        From Ring to Ready in Seconds
                    </p>
                </div>

                {/* Flow Visualization */}
                <div className="relative mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                        {steps.map((item, index) => (
                            <div key={item.step} className="flex-1 relative">
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative z-10">
                                        <item.icon className="h-8 w-8 text-orange-500" />
                                    </div>

                                    {/* Arrow connector (hidden on mobile, last item) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-100" />
                                    )}

                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 max-w-[150px]">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Setup Steps */}
                <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-900">Live in 24 Hours</h3>
                        <p className="text-gray-600 mt-2">Getting started is faster than training a new hire</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {setupSteps.map((item) => (
                            <div key={item.step} className="relative">
                                {/* Step Number */}
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                                    {item.step}
                                </div>

                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
