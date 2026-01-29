import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-orange-500 p-2 rounded-lg">
                                <img
                                    src="/logo-mark.svg"
                                    alt="VoiceFleet"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">VoiceFleet</span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs">
                            AI voice receptionist for small businesses. Answer every call, take messages, and book appointments.
                        </p>
                        <a
                            href="mailto:support@voicefleet.ai"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            support@voicefleet.ai
                        </a>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                        <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                            Pricing
                        </a>
                        <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                            FAQ
                        </a>
                        <Link href="/connect" className="text-gray-400 hover:text-white transition-colors">
                            Integrations
                        </Link>
                        <Link href="/compare" className="text-gray-400 hover:text-white transition-colors">
                            Compare
                        </Link>
                        <Link href="/industries" className="text-gray-400 hover:text-white transition-colors">
                            Industries
                        </Link>
                        <Link href="/locations" className="text-gray-400 hover:text-white transition-colors">
                            Locations
                        </Link>
                        <a href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
                            Sitemap
                        </a>
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-sm text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} VoiceFleet. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
