import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function LandingNavbar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Phone className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">ValidateCall</span>
                    </Link>
                </div>

                <div className="hidden lg:flex lg:gap-x-8">
                    <Link href="#use-cases" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Use Cases
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        How it Works
                    </Link>
                    <Link href="#comparison" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Compare
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex lg:flex-1 lg:justify-end items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Log in
                    </Link>
                    <Link 
                        href="/login" 
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                        Start Free Trial
                    </Link>
                </div>
            </nav>
        </header>
    );
}
