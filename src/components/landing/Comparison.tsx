import { Check, X, Minus } from 'lucide-react';

const features = [
    { name: "Human-like voice quality", validatecall: true, blandai: true, airai: true, humanagent: true },
    { name: "No hold time", validatecall: true, blandai: true, airai: true, humanagent: false },
    { name: "24/7 availability", validatecall: true, blandai: true, airai: true, humanagent: false },
    { name: "Multi-language support", validatecall: "50+", blandai: "25+", airai: "10+", humanagent: "Limited" },
    { name: "Sub-500ms latency", validatecall: true, blandai: false, airai: false, humanagent: true },
    { name: "Real-time adaptation", validatecall: true, blandai: "partial", airai: "partial", humanagent: true },
    { name: "Personal use friendly", validatecall: true, blandai: false, airai: false, humanagent: true },
    { name: "No per-minute fees", validatecall: true, blandai: false, airai: false, humanagent: false },
    { name: "Setup time", validatecall: "Instant", blandai: "Hours", airai: "Days", humanagent: "N/A" },
    { name: "Starting price", validatecall: "$19/mo", blandai: "$0.09/min", airai: "Custom", humanagent: "$15/hr+" },
];

function ValueCell({ value }: { value: boolean | string }) {
    if (value === true) {
        return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
        return <X className="h-5 w-5 text-gray-300 mx-auto" />;
    }
    if (value === "partial") {
        return <Minus className="h-5 w-5 text-amber-500 mx-auto" />;
    }
    return <span className="text-sm text-gray-700">{value}</span>;
}

export default function Comparison() {
    return (
        <section id="comparison" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Comparison</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Why Choose ValidateCall?
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        See how we stack up against other AI calling solutions and traditional human agents.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Feature</th>
                                <th className="py-4 px-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-1">ValidateCall</span>
                                        <span className="text-xs text-gray-400">You are here</span>
                                    </div>
                                </th>
                                <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Bland AI</th>
                                <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Air AI</th>
                                <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Human Agent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr 
                                    key={feature.name} 
                                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                >
                                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">{feature.name}</td>
                                    <td className="py-4 px-4 text-center bg-indigo-50/50">
                                        <ValueCell value={feature.validatecall} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <ValueCell value={feature.blandai} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <ValueCell value={feature.airai} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <ValueCell value={feature.humanagent} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Ready to save hours every week?</p>
                    <a 
                        href="/login" 
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                        Start Your Free Trial
                    </a>
                </div>
            </div>
        </section>
    );
}
