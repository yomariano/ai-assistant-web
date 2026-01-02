import { MessageSquare, Phone, CheckCircle } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Tell Us What You Need",
        description: "Describe your task in plain English. \"Cancel my Comcast subscription\" or \"Book a dentist appointment for next Tuesday.\"",
        icon: MessageSquare,
    },
    {
        number: "02", 
        title: "AI Makes the Call",
        description: "Our AI agent calls the business, navigates menus, waits on hold, and has a natural conversation — just like you would.",
        icon: Phone,
    },
    {
        number: "03",
        title: "Get Results",
        description: "Receive a summary of what happened, any confirmation numbers, and follow-up actions needed. Done.",
        icon: CheckCircle,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">How It Works</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Three Steps to Freedom from Hold Music
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        No more wasting hours of your day on phone calls. Let AI handle it in minutes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent -translate-x-1/2" />
                            )}
                            
                            <div className="text-center">
                                <div className="relative inline-flex">
                                    <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                                        <step.icon className="h-12 w-12 text-indigo-600" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
