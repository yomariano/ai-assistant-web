import { Zap, Shield, Globe2, Clock, Brain, Headphones } from 'lucide-react';

const features = [
    {
        title: "Human-Like Voice",
        description: "Advanced text-to-speech that sounds natural, with proper pacing, emotion, and conversational flow.",
        icon: Headphones,
    },
    {
        title: "Real-Time Intelligence",
        description: "AI understands context, handles interruptions, and adapts to unexpected questions mid-call.",
        icon: Brain,
    },
    {
        title: "Sub-500ms Response",
        description: "Ultra-low latency ensures natural conversation rhythm without awkward pauses.",
        icon: Zap,
    },
    {
        title: "50+ Languages",
        description: "Native-level fluency in major languages with automatic accent matching.",
        icon: Globe2,
    },
    {
        title: "24/7 Availability",
        description: "Your AI agent never sleeps. Make calls anytime, any timezone, any day.",
        icon: Clock,
    },
    {
        title: "Enterprise Security",
        description: "SOC2 compliant, end-to-end encryption, and automatic PII redaction.",
        icon: Shield,
    },
];

export default function FeaturesGrid() {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Features</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Enterprise-Grade AI, Consumer Simple
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Built with the latest AI technology to deliver calls that are indistinguishable from human conversations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                                <feature.icon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
