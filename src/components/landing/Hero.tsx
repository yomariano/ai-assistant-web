import Link from 'next/link';
import { Play, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Warm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 mb-8">
                        <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-sm font-medium text-orange-700">AI Phone Answering for Irish Restaurants</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                        Your Phone Rings. You&apos;re Making Coffee.
                        <br />
                        <span className="text-orange-500">Another Order Walks Out the Door.</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        OrderBot answers every call, takes orders, and notifies you instantly.
                        24/7. No staff needed. Never miss an order again.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 py-4 text-base font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                        >
                            Start Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <Play className="h-5 w-5 text-orange-500" />
                            See How It Works
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🇮🇪</span>
                            <span className="font-medium">Irish Company</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="font-medium">GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <span className="font-medium">Setup in 24 Hours</span>
                        </div>
                    </div>

                    {/* Hero Visual - Split Screen Concept */}
                    <div className="mt-16 relative">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                {/* Left: Busy Restaurant Scene */}
                                <div className="p-8 md:p-12 text-left border-r border-gray-700">
                                    <div className="text-orange-400 text-sm font-semibold uppercase tracking-wide mb-4">Without OrderBot</div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-red-400 text-lg">📞</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Phone ringing...</p>
                                                <p className="text-gray-400 text-sm">You&apos;re hands-deep in orders</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-red-400 text-lg">😤</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Customer hangs up</p>
                                                <p className="text-gray-400 text-sm">€15 order gone forever</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: OrderBot Answering */}
                                <div className="p-8 md:p-12 text-left bg-gradient-to-br from-orange-500/10 to-transparent">
                                    <div className="text-green-400 text-sm font-semibold uppercase tracking-wide mb-4">With OrderBot</div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">AI answers in 0.5 seconds</p>
                                                <p className="text-gray-400 text-sm">&quot;Hi, thanks for calling...&quot;</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Order taken + Email sent</p>
                                                <p className="text-gray-400 text-sm">You get notified instantly</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
