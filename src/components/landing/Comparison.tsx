'use client';

import { Check, X, Minus } from 'lucide-react';

const comparisonData = [
    {
        feature: "Available 24/7",
        orderbot: true,
        staff: false,
        answering: true,
        voicemail: true
    },
    {
        feature: "Takes actual orders",
        orderbot: true,
        staff: true,
        answering: false,
        voicemail: false
    },
    {
        feature: "Instant notifications",
        orderbot: true,
        staff: false,
        answering: false,
        voicemail: false
    },
    {
        feature: "Irish voice/accent",
        orderbot: true,
        staff: true,
        answering: false,
        voicemail: "na"
    },
    {
        feature: "Monthly cost",
        orderbot: "€149",
        staff: "€2,000+",
        answering: "€500+",
        voicemail: "Free"
    },
    {
        feature: "Setup time",
        orderbot: "24 hours",
        staff: "2-4 weeks",
        answering: "1 week",
        voicemail: "Instant"
    },
    {
        feature: "Handles 100 calls/day",
        orderbot: true,
        staff: false,
        answering: "€€€",
        voicemail: false
    },
    {
        feature: "Never calls in sick",
        orderbot: true,
        staff: false,
        answering: true,
        voicemail: true
    }
];

function CellContent({ value }: { value: boolean | string }) {
    if (value === true) {
        return <Check className="h-5 w-5 text-green-500 mx-auto" />;
    }
    if (value === false) {
        return <X className="h-5 w-5 text-red-400 mx-auto" />;
    }
    if (value === "na") {
        return <Minus className="h-5 w-5 text-gray-300 mx-auto" />;
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>;
}

export default function Comparison() {
    return (
        <section id="comparison" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">Comparison</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Why Restaurants Choose OrderBot
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        See how we stack up against the alternatives
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Feature</th>
                                <th className="py-4 px-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-orange-500 font-bold text-lg">OrderBot</span>
                                        <span className="text-xs text-gray-400">AI Assistant</span>
                                    </div>
                                </th>
                                <th className="py-4 px-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-gray-700 font-medium">Hiring Staff</span>
                                        <span className="text-xs text-gray-400">Part-time</span>
                                    </div>
                                </th>
                                <th className="py-4 px-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-gray-700 font-medium">Answering Service</span>
                                        <span className="text-xs text-gray-400">Call center</span>
                                    </div>
                                </th>
                                <th className="py-4 px-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-gray-700 font-medium">DIY Voicemail</span>
                                        <span className="text-xs text-gray-400">Basic</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, index) => (
                                <tr
                                    key={row.feature}
                                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}
                                >
                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.feature}</td>
                                    <td className="py-4 px-4 text-center bg-orange-50/50">
                                        <CellContent value={row.orderbot} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <CellContent value={row.staff} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <CellContent value={row.answering} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <CellContent value={row.voicemail} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        OrderBot gives you the reliability of automation with the quality of a real person.
                    </p>
                </div>
            </div>
        </section>
    );
}
