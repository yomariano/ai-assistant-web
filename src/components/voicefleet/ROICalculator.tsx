"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";

const ROICalculator = () => {
  const [callVolume, setCallVolume] = useState(25000);
  const [handleTime, setHandleTime] = useState(5);
  const [costPerCall, setCostPerCall] = useState(2.5);
  const [automatable, setAutomatable] = useState(60);

  const savings = useMemo(() => {
    const automatableCalls = callVolume * (automatable / 100);
    const currentCost = automatableCalls * costPerCall;
    const aiCost = automatableCalls * 0.35;
    const monthlySavings = currentCost - aiCost;
    const yearlySavings = monthlySavings * 12;
    const savingsPercentage = ((currentCost - aiCost) / currentCost) * 100;

    return {
      monthly: Math.round(monthlySavings),
      yearly: Math.round(yearlySavings),
      percentage: Math.round(savingsPercentage),
    };
  }, [callVolume, costPerCall, automatable]);

  const volumeOptions = [
    { value: 5000, label: "5,000" },
    { value: 10000, label: "10,000" },
    { value: 25000, label: "25,000" },
    { value: 50000, label: "50,000" },
    { value: 100000, label: "100,000+" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ROI Calculator</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Calculate Your <span className="text-gradient-primary">Savings</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See how much you could save with VoiceFleet AI agents
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Inputs */}
              <div className="p-8 lg:p-10 space-y-8">
                {/* Call Volume */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Monthly Call Volume
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {volumeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCallVolume(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          callVolume === option.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Handle Time */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Average Handle Time: <span className="text-primary">{handleTime} minutes</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={handleTime}
                    onChange={(e) => setHandleTime(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>2 min</span>
                    <span>10 min</span>
                  </div>
                </div>

                {/* Cost Per Call */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Current Cost Per Call: <span className="text-primary">€{costPerCall.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={costPerCall}
                    onChange={(e) => setCostPerCall(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>€1.00</span>
                    <span>€5.00</span>
                  </div>
                </div>

                {/* Automatable */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Percentage Automatable: <span className="text-primary">{automatable}%</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    step="5"
                    value={automatable}
                    onChange={(e) => setAutomatable(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>40%</span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-hero p-8 lg:p-10 text-primary-foreground">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium text-primary-foreground/80">
                        Estimated Savings
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-primary-foreground/70 mb-1">Monthly Savings</p>
                        <p className="text-4xl lg:text-5xl font-heading font-extrabold">
                          €{savings.monthly.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-primary-foreground/70 mb-1">Annual Savings</p>
                        <p className="text-3xl font-heading font-bold">
                          €{savings.yearly.toLocaleString()}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 rounded-full">
                        <span className="text-2xl font-bold">{savings.percentage}%</span>
                        <span className="text-sm">cost reduction</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-sm text-primary-foreground/80 mb-4">
                      Based on your inputs, VoiceFleet could save you significantly while improving customer experience.
                    </p>
                    <Button variant="heroOutline" size="lg" className="w-full">
                      Get Custom ROI Analysis
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
