import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-indigo-600 rounded-3xl px-6 py-16 text-center sm:px-16 shadow-2xl">
                    {/* Background pattern */}
                    <svg
                        className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="cta-pattern"
                                width={200}
                                height={200}
                                x="50%"
                                y={-1}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M.5 200V.5H200" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth={0} fill="url(#cta-pattern)" />
                    </svg>

                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to Reclaim Your Time?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-indigo-100">
                        Start your free trial today. No credit card required. Let our AI handle your calls while you focus on what matters.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg"
                        >
                            Start Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#comparison"
                            className="text-base font-medium text-indigo-100 hover:text-white transition-colors"
                        >
                            See how we compare <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
