import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-orange-500 rounded-3xl px-6 py-16 text-center sm:px-16 shadow-2xl">
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
                        Ready to Stop Missing Orders?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-orange-100">
                        Join 50+ Irish restaurants already using OrderBot. Start your 30-day free trial today.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-orange-600 hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            Start Your Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <div className="flex items-center gap-2 text-orange-100">
                            <Phone className="h-5 w-5" />
                            <span className="text-base font-medium">Or call us: 01 555 0123</span>
                        </div>
                    </div>
                    <p className="mt-6 text-sm text-orange-200">
                        We answer our phones too 😉
                    </p>
                </div>
            </div>
        </section>
    );
}
