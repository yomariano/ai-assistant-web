import Link from 'next/link';
import { Play, ArrowRight, Phone, Clock, DollarSign } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white -z-10" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 mb-8">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        <span className="text-sm font-medium text-indigo-700">AI Voice Agents for Business</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                        Never Wait on Hold Again.
                        <br />
                        <span className="text-indigo-600">Let AI Make Your Calls.</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Our AI voice agents handle phone calls on your behalf — from booking appointments 
                        to canceling subscriptions. Human-quality conversations, zero hold time.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link 
                            href="/login" 
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
                        >
                            Start Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <Play className="h-5 w-5 text-indigo-600" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                                <Clock className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">2+ hrs</div>
                            <div className="text-sm text-gray-500 mt-1">Saved per call on average</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                                <Phone className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">95%</div>
                            <div className="text-sm text-gray-500 mt-1">Call success rate</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-3">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">10x</div>
                            <div className="text-sm text-gray-500 mt-1">ROI for businesses</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
