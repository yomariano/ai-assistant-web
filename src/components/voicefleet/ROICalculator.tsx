"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, ArrowRight, Building2, Check, Zap, Rocket, Crown } from "lucide-react";

// Industry data with realistic averages
const industries = [
  { id: "restaurant", name: "Restaurant / Food Service", avgCalls: 200, avgCostPerCall: 2.50, automatable: 70 },
  { id: "healthcare", name: "Healthcare / Medical", avgCalls: 350, avgCostPerCall: 3.50, automatable: 55 },
  { id: "dental", name: "Dental Practice", avgCalls: 250, avgCostPerCall: 3.00, automatable: 65 },
  { id: "legal", name: "Legal / Law Firm", avgCalls: 150, avgCostPerCall: 4.00, automatable: 50 },
  { id: "realestate", name: "Real Estate", avgCalls: 180, avgCostPerCall: 3.00, automatable: 60 },
  { id: "auto", name: "Auto Dealership", avgCalls: 300, avgCostPerCall: 2.80, automatable: 65 },
  { id: "homeservices", name: "Home Services", avgCalls: 220, avgCostPerCall: 2.50, automatable: 70 },
  { id: "insurance", name: "Insurance Agency", avgCalls: 280, avgCostPerCall: 3.20, automatable: 55 },
  { id: "hospitality", name: "Hospitality / Hotels", avgCalls: 400, avgCostPerCall: 2.30, automatable: 75 },
  { id: "property", name: "Property Management", avgCalls: 250, avgCostPerCall: 2.80, automatable: 65 },
  { id: "custom", name: "Custom / Other", avgCalls: 200, avgCostPerCall: 2.50, automatable: 60 },
];

// VoiceFleet pricing plans
const plans = [
  { id: "lite", name: "Lite", monthlyFee: 19, perCallCost: 0.95, maxCalls: 100, icon: Zap },
  { id: "growth", name: "Growth", monthlyFee: 99, perCallCost: 0.45, maxCalls: 400, icon: Rocket },
  { id: "pro", name: "Pro", monthlyFee: 249, perCallCost: 0, maxCalls: 1500, icon: Crown },
];

const ROICalculator = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);
  const [callVolume, setCallVolume] = useState(industries[0].avgCalls);
  const [costPerCall, setCostPerCall] = useState(industries[0].avgCostPerCall);
  const [automatable, setAutomatable] = useState(industries[0].automatable);
  const [isCustom, setIsCustom] = useState(false);

  // Calculate costs and savings for each plan
  const planCalculations = useMemo(() => {
    const automatableCalls = Math.round(callVolume * (automatable / 100));
    const currentMonthlyCost = automatableCalls * costPerCall;

    return plans.map(plan => {
      let voicefleetCost: number;

      if (plan.id === "pro") {
        // Pro is unlimited (up to 1500 cap)
        voicefleetCost = plan.monthlyFee;
      } else {
        // Lite and Growth have per-call costs
        voicefleetCost = plan.monthlyFee + (automatableCalls * plan.perCallCost);
      }

      const monthlySavings = currentMonthlyCost - voicefleetCost;
      const yearlySavings = monthlySavings * 12;
      const savingsPercentage = currentMonthlyCost > 0
        ? ((currentMonthlyCost - voicefleetCost) / currentMonthlyCost) * 100
        : 0;

      // Determine if this plan is recommended based on call volume
      let isRecommended = false;
      if (automatableCalls <= 100 && plan.id === "lite") isRecommended = true;
      else if (automatableCalls > 100 && automatableCalls <= 400 && plan.id === "growth") isRecommended = true;
      else if (automatableCalls > 400 && plan.id === "pro") isRecommended = true;

      // Check if savings are positive (plan makes sense)
      const makesSense = monthlySavings > 0;

      return {
        ...plan,
        automatableCalls,
        currentMonthlyCost: Math.round(currentMonthlyCost),
        voicefleetCost: Math.round(voicefleetCost),
        monthlySavings: Math.round(monthlySavings),
        yearlySavings: Math.round(yearlySavings),
        savingsPercentage: Math.round(savingsPercentage),
        isRecommended,
        makesSense,
      };
    });
  }, [callVolume, costPerCall, automatable]);

  // Find the best plan (highest savings that makes sense)
  const bestPlan = useMemo(() => {
    const validPlans = planCalculations.filter(p => p.makesSense);
    if (validPlans.length === 0) return planCalculations[0];
    return validPlans.reduce((best, plan) =>
      plan.monthlySavings > best.monthlySavings ? plan : best
    );
  }, [planCalculations]);

  const handleIndustryChange = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId) || industries[0];
    setSelectedIndustry(industry);

    if (industryId === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setCallVolume(industry.avgCalls);
      setCostPerCall(industry.avgCostPerCall);
      setAutomatable(industry.automatable);
    }
  };

  return (
    <section className="py-16 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 lg:mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ROI Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Calculate Your <span className="text-gradient-primary">Savings</span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              See how much you could save with VoiceFleet AI agents
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Inputs */}
              <div className="p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                {/* Call Volume */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Monthly Call Volume
                  </label>
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                    {volumeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCallVolume(option.value)}
                        className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
              <div className="bg-gradient-hero p-5 sm:p-8 lg:p-10 text-primary-foreground">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium text-primary-foreground/80">
                        Estimated Savings
                      </span>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <p className="text-sm text-primary-foreground/70 mb-1">Monthly Savings</p>
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold">
                          €{savings.monthly.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-primary-foreground/70 mb-1">Annual Savings</p>
                        <p className="text-2xl sm:text-3xl font-heading font-bold">
                          €{savings.yearly.toLocaleString()}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-foreground/20 rounded-full">
                        <span className="text-xl sm:text-2xl font-bold">{savings.percentage}%</span>
                        <span className="text-sm">cost reduction</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <p className="text-sm text-primary-foreground/80 mb-4 hidden sm:block">
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
