"use client";

import { CheckCircle2, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlanId = "starter" | "growth" | "scale";

interface PaywallStepProps {
  hasSubscription: boolean;
  isRefreshing: boolean;
  onSelectPlan: (planId: PlanId) => void;
  onRefresh: () => void;
  onContinue: () => void;
}

const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  subtitle: string;
  highlight?: boolean;
}> = [
  { id: "starter", name: "Lite", price: "€19/mo", subtitle: "+ €0.95/call" },
  { id: "growth", name: "Growth", price: "€99/mo", subtitle: "+ €0.45/call", highlight: true },
  { id: "scale", name: "Pro", price: "€249/mo", subtitle: "1500 calls included" },
];

export function PaywallStep({
  hasSubscription,
  isRefreshing,
  onSelectPlan,
  onRefresh,
  onContinue,
}: PaywallStepProps) {
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


