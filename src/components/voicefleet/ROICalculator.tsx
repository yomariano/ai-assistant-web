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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 lg:mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ROI Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Calculate Your <span className="text-gradient-primary">Savings</span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              Select your industry to see how much you could save with VoiceFleet
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            {/* Input Section */}
            <div className="p-5 sm:p-8 lg:p-10 space-y-6 border-b border-border">
              {/* Industry Dropdown */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  Select Your Industry
                </label>
                <select
                  value={selectedIndustry.id}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                >
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
                {!isCustom && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Industry average: {selectedIndustry.avgCalls} calls/month at €{selectedIndustry.avgCostPerCall.toFixed(2)}/call
                  </p>
                )}
              </div>

              {/* Adjustable Parameters */}
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Monthly Calls */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Monthly Calls: <span className="text-primary">{callVolume}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="800"
                    step="10"
                    value={callVolume}
                    onChange={(e) => {
                      setCallVolume(Number(e.target.value));
                      setIsCustom(true);
                    }}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50</span>
                    <span>800</span>
                  </div>
                </div>

                {/* Cost Per Call */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Cost Per Call: <span className="text-primary">€{costPerCall.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.25"
                    value={costPerCall}
                    onChange={(e) => {
                      setCostPerCall(Number(e.target.value));
                      setIsCustom(true);
                    }}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>€1</span>
                    <span>€6</span>
                  </div>
                </div>

                {/* Automatable % */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Automatable: <span className="text-primary">{automatable}%</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="5"
                    value={automatable}
                    onChange={(e) => {
                      setAutomatable(Number(e.target.value));
                      setIsCustom(true);
                    }}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>30%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>

              {/* Current Cost Summary */}
              <div className="bg-muted/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your Current Monthly Cost</p>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    €{planCalculations[0].currentMonthlyCost.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Calls AI Can Handle</p>
                  <p className="text-2xl font-heading font-bold text-primary">
                    {planCalculations[0].automatableCalls.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Comparison Section */}
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-lg font-semibold text-foreground">Your Savings by Plan</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {planCalculations.map((plan) => {
                  const Icon = plan.icon;
                  const isBest = plan.id === bestPlan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl p-5 transition-all ${
                        isBest
                          ? "bg-gradient-hero text-primary-foreground ring-2 ring-primary shadow-lg"
                          : "bg-muted/50 border border-border"
                      }`}
                    >
                      {isBest && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                          Best Value
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${isBest ? "text-primary-foreground" : "text-primary"}`} />
                        <span className={`font-heading font-bold ${isBest ? "text-primary-foreground" : "text-foreground"}`}>
                          {plan.name}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className={`text-xs ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          VoiceFleet Cost
                        </p>
                        <p className={`text-lg font-bold ${isBest ? "text-primary-foreground" : "text-foreground"}`}>
                          €{plan.voicefleetCost}/mo
                        </p>
                        <p className={`text-xs ${isBest ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          €{plan.monthlyFee} + {plan.perCallCost > 0 ? `€${plan.perCallCost}/call` : "unlimited"}
                        </p>
                      </div>

                      {plan.makesSense ? (
                        <>
                          <div className="mb-3">
                            <p className={`text-xs ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              Monthly Savings
                            </p>
                            <p className={`text-2xl font-heading font-extrabold ${isBest ? "text-primary-foreground" : "text-accent"}`}>
                              €{plan.monthlySavings.toLocaleString()}
                            </p>
                          </div>

                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            isBest ? "bg-primary-foreground/20 text-primary-foreground" : "bg-accent/10 text-accent"
                          }`}>
                            <Check className="w-3 h-3" />
                            {plan.savingsPercentage}% savings
                          </div>

                          <div className={`mt-3 pt-3 border-t ${isBest ? "border-primary-foreground/20" : "border-border"}`}>
                            <p className={`text-xs ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              Annual Savings
                            </p>
                            <p className={`text-lg font-bold ${isBest ? "text-primary-foreground" : "text-foreground"}`}>
                              €{plan.yearlySavings.toLocaleString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <p className={`text-sm ${isBest ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            Not cost-effective<br />for your volume
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                <p className="text-foreground font-medium mb-2">
                  {bestPlan.makesSense ? (
                    <>
                      With <span className="font-bold text-primary">{bestPlan.name}</span>, you could save{" "}
                      <span className="font-bold text-accent">€{bestPlan.yearlySavings.toLocaleString()}/year</span>
                    </>
                  ) : (
                    "Let us create a custom plan for your business"
                  )}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get a personalized analysis for your {selectedIndustry.name.toLowerCase()} business
                </p>
                <Button variant="hero" size="lg">
                  Get Custom ROI Analysis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
