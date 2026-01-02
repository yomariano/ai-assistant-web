import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Starter',
        id: 'tier-starter',
        href: '/login',
        priceMonthly: '$29',
        description: 'Perfect for small businesses getting started.',
        planId: 'starter',
        features: [
            '30 minutes included',
            '1 phone number',
            'Business hours (9am-6pm)',
            'Standard AI voices',
            'Call transcripts',
            'Email notifications',
            '$0.25/min overage',
        ],
        mostPopular: false,
    },
    {
        name: 'Growth',
        id: 'tier-growth',
        href: '/login',
        priceMonthly: '$79',
        description: 'For growing businesses with more call volume.',
        planId: 'growth',
        features: [
            '100 minutes included',
            '2 phone numbers',
            'Business hours (9am-6pm)',
            '3 concurrent calls',
            'Voice cloning',
            'Calendar booking',
            'Analytics dashboard',
            '$0.22/min overage',
        ],
        mostPopular: true,
    },
    {
        name: 'Scale',
        id: 'tier-scale',
        href: '/login',
        priceMonthly: '$199',
        description: 'For high-volume businesses that need more.',
        planId: 'scale',
        features: [
            '300 minutes included',
            '5 phone numbers',
            'Extended hours (7am-10pm)',
            '10 concurrent calls',
            'Custom knowledge base',
            'Priority support',
            'Advanced analytics',
            '$0.18/min overage',
        ],
        mostPopular: false,
    },
];

function getCardClass(mostPopular: boolean) {
    const base = 'relative flex flex-col rounded-2xl p-8';
    if (mostPopular) {
        return base + ' bg-indigo-600 text-white ring-2 ring-indigo-600 lg:scale-105 lg:z-10 shadow-xl';
    }
    return base + ' bg-white border border-gray-200';
}

function getTitleClass(mostPopular: boolean) {
    return mostPopular ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900';
}

function getDescClass(mostPopular: boolean) {
    return mostPopular ? 'mt-2 text-sm text-indigo-100' : 'mt-2 text-sm text-gray-600';
}

function getPriceClass(mostPopular: boolean) {
    return mostPopular ? 'text-4xl font-bold text-white' : 'text-4xl font-bold text-gray-900';
}

function getPriceSubClass(mostPopular: boolean) {
    return mostPopular ? 'text-sm text-indigo-200' : 'text-sm text-gray-500';
}

function getCheckClass(mostPopular: boolean) {
    return mostPopular ? 'h-5 w-5 flex-none text-indigo-200' : 'h-5 w-5 flex-none text-indigo-600';
}

function getFeatureClass(mostPopular: boolean) {
    return mostPopular ? 'text-indigo-50' : 'text-gray-600';
}

function getButtonClass(mostPopular: boolean) {
    const base = 'mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors';
    if (mostPopular) {
        return base + ' bg-white text-indigo-600 hover:bg-indigo-50';
    }
    return base + ' bg-indigo-600 text-white hover:bg-indigo-700';
}

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Pricing</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Simple, Transparent Pricing
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        No per-minute fees. No hidden charges. Just straightforward plans that scale with you.
                    </p>
                </div>

                <div className="mx-auto grid max-w-lg grid-cols-1 items-start gap-8 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={getCardClass(tier.mostPopular)}
                        >
                            {tier.mostPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white">
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
                                        {tier.priceMonthly}
                                    </span>
                                    <span className={getPriceSubClass(tier.mostPopular)}>
                                        /month
                                    </span>
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
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="mt-12 text-center text-sm text-gray-500">
                    All plans include a 7-day free trial. No credit card required.
                </p>
            </div>
        </section>
    );
}
