import Link from 'next/link';
import { Phone } from 'lucide-react';

const footerNavigation = {
    product: [
        { name: 'Features', href: '/features' },
        { name: 'Industries', href: '/for' },
        { name: 'Locations', href: '/in' },
        { name: 'Pricing', href: '#pricing' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
    social: [
        {
            name: 'Twitter',
            href: '#',
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            href: '#',
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            ),
        },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <Phone className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">ValidateCall</span>
                        </Link>
                        <p className="text-sm leading-6 text-gray-600">
                            Your personal AI agent for every phone call. Save hours, avoid frustration, get results.
                        </p>
                        <div className="flex space-x-4">
                            {footerNavigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-5 w-5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {footerNavigation.product.map((item) => (
                                        <li key={item.name}>
                                            <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {footerNavigation.company.map((item) => (
                                        <li key={item.name}>
                                            <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {footerNavigation.legal.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} ValidateCall, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
