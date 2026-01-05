'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ROICalculator() {
    const [missedCalls, setMissedCalls] = useState(5);
    const [avgOrderValue, setAvgOrderValue] = useState(15);

    const monthlyLoss = missedCalls * avgOrderValue * 30;
    const orderBotCost = 149; // Starter plan
    const paybackDays = Math.ceil(orderBotCost / (missedCalls * avgOrderValue));
    const annualSavings = (monthlyLoss * 12) - (orderBotCost * 12);

    return (
        <section id="calculator" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">
                        ROI Calculator
                    </h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        See Your Savings
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Every missed call is money walking out the door. See how much OrderBot can save you.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-200">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Inputs */}
                            <div className="space-y-8">
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                                        <span>Missed calls per day</span>
                                        <span className="text-orange-600 font-semibold">{missedCalls} calls</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={missedCalls}
                                        onChange={(e) => setMissedCalls(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>1</span>
                                        <span>20</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                                        <span>Average order value</span>
                                        <span className="text-orange-600 font-semibold">&euro;{avgOrderValue}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="50"
                                        value={avgOrderValue}
                                        onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>&euro;10</span>
                                        <span>&euro;50</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calculator className="h-4 w-4" />
                                        <span>Based on 30 days per month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
                                <div className="text-center pb-4 border-b border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">You&apos;re losing</p>
                                    <p className="text-4xl font-bold text-red-500">
                                        &euro;{monthlyLoss.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">per month</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">OrderBot pays for itself in</span>
                                        <span className="text-lg font-bold text-orange-600">{paybackDays} days</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Annual savings with OrderBot</span>
                                        <span className="text-lg font-bold text-green-600">
                                            &euro;{annualSavings.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-2">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="font-medium">
                                            {Math.round((annualSavings / (orderBotCost * 12)) * 100)}% ROI
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                            >
                                Stop Losing Money Today
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-3 text-sm text-gray-500">
                                14-day free trial &bull; No credit card required
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
