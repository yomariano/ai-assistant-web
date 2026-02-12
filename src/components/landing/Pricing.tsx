'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

interface TierData {
    name: string;
    id: string;
    href: string;
    price: string;
    description: string;
    features: string[];
    perfectFor: string;
    mostPopular: boolean;
    cta: string;
}

const tiers: TierData[] = [
    {
        name: 'Starter',
        id: 'tier-starter',
        href: '/register',
        price: '€99',
        description: 'Perfect for solo businesses getting started with AI.',
        perfectFor: 'Perfect for: Solo businesses',
        features: [
            '500 minutes/month (~200 calls)',
            '1 parallel call',
            'Google Calendar integration',
            '24/7 AI call answering',
            '5-day free trial',
        ],
        mostPopular: false,
        cta: 'Start Free Trial',
    },
    {
        name: 'Growth',
        id: 'tier-growth',
        href: '/register',
        price: '€299',
        description: 'For growing businesses with custom voice & scripts.',
        perfectFor: 'Perfect for: Growing businesses',
        features: [
            '1,000 minutes/month (~400 calls)',
            '3 parallel calls',
            'Custom voice & scripts',
            'Transfer to human',
            '5-day free trial',
        ],
        mostPopular: true,
        cta: 'Start Free Trial',
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '/register',
        price: '€599',
        description: 'For high-volume businesses with maximum capacity.',
        perfectFor: 'Perfect for: High-volume businesses',
        features: [
            '2,000 minutes/month (~800 calls)',
            '5 parallel calls',
            '90-day call recordings',
            'Early access to features',
            'Dedicated support',
        ],
        mostPopular: false,
        cta: 'Start Free Trial',
    },
];

function getCardClass(mostPopular: boolean) {
    const base = 'relative flex flex-col rounded-2xl p-8';
    if (mostPopular) {
        return base + ' bg-orange-500 text-white ring-2 ring-orange-500 lg:scale-105 lg:z-10 shadow-xl';
    }
    return base + ' bg-white border border-gray-200';
}

function getTitleClass(mostPopular: boolean) {
    return mostPopular ? 'text-xl font-semibold text-white' : 'text-xl font-semibold text-gray-900';
}

function getDescClass(mostPopular: boolean) {
    return mostPopular ? 'mt-2 text-sm text-orange-100' : 'mt-2 text-sm text-gray-600';
}

function getPriceClass(mostPopular: boolean) {
    return mostPopular ? 'text-5xl font-bold text-white' : 'text-5xl font-bold text-gray-900';
}

function getPriceSubClass(mostPopular: boolean) {
    return mostPopular ? 'text-sm text-orange-200' : 'text-sm text-gray-500';
}

function getCheckClass(mostPopular: boolean) {
    return mostPopular ? 'h-5 w-5 flex-none text-orange-200' : 'h-5 w-5 flex-none text-orange-500';
}

function getFeatureClass(mostPopular: boolean) {
    return mostPopular ? 'text-orange-50' : 'text-gray-600';
}

function getPerfectForClass(mostPopular: boolean) {
    return mostPopular ? 'text-sm text-orange-200 font-medium' : 'text-sm text-gray-500 font-medium';
}

function getButtonClass(mostPopular: boolean) {
    const base = 'mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors';
    if (mostPopular) {
        return base + ' bg-white text-orange-600 hover:bg-orange-50';
    }
    return base + ' bg-orange-500 text-white hover:bg-orange-600';
}

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">Pricing</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Simple Pricing. Massive ROI.
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        AI voice agents at a fraction of the cost. Pay only for what you use.
                    </p>
                </div>

                <div className="mx-auto grid max-w-lg grid-cols-1 items-start gap-8 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={getCardClass(tier.mostPopular)}
                        >
                            {tier.mostPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold text-white">
                                    Most Popular
                                </div>
                            )}
                            <div>
                                <h3 className={getTitleClass(tier.mostPopular)}>
                                    {tier.name}
                                </h3>
                                <p className={getDescClass(tier.mostPopular)}>
                                    {tier.description}
                                </p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className={getPriceClass(tier.mostPopular)}>
                                        {tier.price}
                                    </span>
                                    <span className={getPriceSubClass(tier.mostPopular)}>
                                        /month
                                    </span>
                                </p>
                                <p className={`mt-2 ${getPerfectForClass(tier.mostPopular)}`}>
                                    {tier.perfectFor}
                                </p>
                                <ul role="list" className="mt-8 space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3 text-sm">
                                            <Check className={getCheckClass(tier.mostPopular)} />
                                            <span className={getFeatureClass(tier.mostPopular)}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                href={tier.href}
                                className={getButtonClass(tier.mostPopular)}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        All plans include: <span className="font-medium">5-day free trial</span> • Cancel anytime • GDPR compliant
                    </p>
                </div>
            </div>
        </section>
    );
}
