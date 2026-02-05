"use client";

import { CheckCircle2, CreditCard, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlanId = "starter" | "growth" | "pro";

export interface RegionPlan {
  id: string;
  price: number;
  formattedPrice: string;
  monthlyMinutes: number;
  paymentLink: string | null;
}

interface PaywallStepProps {
  hasSubscription: boolean;
  isRefreshing: boolean;
  onSelectPlan: (planId: PlanId) => void;
  onRefresh: () => void;
  onContinue: () => void;
  // Region-based pricing (optional - falls back to default if not provided)
  regionPlans?: RegionPlan[];
  currencySymbol?: string;
  isLoadingRegion?: boolean;
}

// Default EU plans (fallback if region detection fails or not provided)
const defaultPlans: Array<{
  id: PlanId;
  name: string;
  price: string;
  subtitle: string;
  highlight?: boolean;
}> = [
  { id: "starter", name: "Starter", price: "€99/mo", subtitle: "500 minutes/month (~200 calls)" },
  { id: "growth", name: "Growth", price: "€299/mo", subtitle: "1,000 minutes/month (~400 calls)", highlight: true },
  { id: "pro", name: "Pro", price: "€599/mo", subtitle: "2,000 minutes/month (~800 calls)" },
];

// Minutes per plan (for subtitle)
const minutesPerPlan: Record<PlanId, { minutes: number; calls: string }> = {
  starter: { minutes: 500, calls: "~200" },
  growth: { minutes: 1000, calls: "~400" },
  pro: { minutes: 2000, calls: "~800" },
};

export function PaywallStep({
  hasSubscription,
  isRefreshing,
  onSelectPlan,
  onRefresh,
  onContinue,
  regionPlans,
  currencySymbol = "€",
  isLoadingRegion = false,
}: PaywallStepProps) {
  // Build plans from region data or use defaults
  const plans = regionPlans && regionPlans.length > 0
    ? regionPlans.map((rp, index) => {
        const planId = rp.id as PlanId;
        // Use region-specific minutes from rp.monthlyMinutes (e.g., AR=250, EU=500 for starter)
        const minutes = rp.monthlyMinutes;
        const estimatedCalls = `~${Math.round(minutes / 2.5)}`;
        return {
          id: planId,
          name: planId.charAt(0).toUpperCase() + planId.slice(1),
          price: `${rp.formattedPrice}/mo`,
          subtitle: `${minutes.toLocaleString()} minutes/month (${estimatedCalls} calls)`,
          highlight: planId === "growth",
        };
      })
    : defaultPlans;
  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/60 rounded-2xl flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Choose a plan</h2>
        <p className="text-muted-foreground">
          Subscribe to activate your AI receptionist and continue setup.
        </p>
      </div>

      {isLoadingRegion ? (
        <div className="flex items-center justify-center py-8 mb-5">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading pricing...</span>
        </div>
      ) : (
        <div className="grid gap-3 mb-5">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                plan.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-background"
              )}
              disabled={hasSubscription}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{plan.name}</span>
                    {plan.highlight && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{plan.price}</p>
                  <p className="text-xs text-muted-foreground">Billed monthly</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {hasSubscription ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 mb-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Subscription active</p>
            <p className="text-sm text-emerald-700">You can continue onboarding.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 mb-5">
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            isLoading={isRefreshing}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4" />
            I already subscribed — refresh status
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="hero"
        size="lg"
        onClick={onContinue}
        disabled={!hasSubscription}
        className="w-full"
      >
        Continue setup
      </Button>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        You&apos;ll be redirected to our secure checkout.
      </p>
    </div>
  );
}

export default PaywallStep;





