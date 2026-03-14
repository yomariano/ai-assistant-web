"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  numberOrderingApi,
  type NumberOrderingCountry,
  type NumberRequest,
} from "@/lib/api";

export type PlanId = "starter" | "growth" | "pro";

export interface NumberSelection {
  countryCode: string;
  numberCategory: string;
}

export interface RegionPlan {
  id: string;
  price: number;
  formattedPrice: string;
  monthlyMinutes: number;
  minutesIncluded?: number;
  paymentLink: string | null;
}

interface PaywallStepProps {
  hasSubscription: boolean;
  isRefreshing: boolean;
  onSelectPlan: (planId: PlanId, selection: NumberSelection) => void;
  onRefresh: () => void;
  onContinue: () => void;
  regionPlans?: RegionPlan[];
  currencySymbol?: string;
  isLoadingRegion?: boolean;
  detectedRegion?: string | null;
}

const defaultPlans: Array<{
  id: PlanId;
  name: string;
  price: string;
  subtitle: string;
  highlight?: boolean;
}> = [
  { id: "starter", name: "Starter", price: "EUR99/mo", subtitle: "500 minutes/month (~200 calls)" },
  { id: "growth", name: "Growth", price: "EUR299/mo", subtitle: "1,000 minutes/month (~400 calls)", highlight: true },
  { id: "pro", name: "Pro", price: "EUR599/mo", subtitle: "2,000 minutes/month (~800 calls)" },
];

const minutesPerPlan: Record<PlanId, { minutes: number }> = {
  starter: { minutes: 500 },
  growth: { minutes: 1000 },
  pro: { minutes: 2000 },
};

const DEFAULT_COUNTRY_BY_REGION: Record<string, string> = {
  AR: "AR",
  AU: "AU",
  EU: "IE",
  IE: "IE",
  US: "US",
};

const CATEGORY_LABELS: Record<string, string> = {
  GEOGRAPHIC: "Geographic",
  MOBILE: "Mobile",
  NATIONAL: "National",
  SPECIAL: "Special",
  TOLLFREE: "Toll-free",
};

const REQUEST_BLOCKING_STATUSES = new Set(["submitted", "approved"]);
const EMPTY_CATEGORIES: NumberOrderingCountry["categories"] = [];

function getStoredSelection(key: "selectedNumberCountry" | "selectedNumberCategory") {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.sessionStorage.getItem(key);
  return value && value.trim().length > 0 ? value : null;
}

function formatDocumentType(documentType: string) {
  return documentType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRequestStatusMessage(request: NumberRequest) {
  if (request.status === "approved") {
    return "Your number request is approved. You can wait for provisioning or contact support to finish the setup.";
  }

  if (request.status === "rejected") {
    return "This request was rejected. You can update the details below and submit a new request.";
  }

  return "Your number request is under review. We'll contact you to collect the required documents before activation.";
}

export function PaywallStep({
  hasSubscription,
  isRefreshing,
  onSelectPlan,
  onRefresh,
  onContinue,
  regionPlans,
  isLoadingRegion = false,
  detectedRegion,
}: PaywallStepProps) {
  const [countries, setCountries] = useState<NumberOrderingCountry[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedNumberCategory, setSelectedNumberCategory] = useState("");
  const [latestRequest, setLatestRequest] = useState<NumberRequest | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [endUserName, setEndUserName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadNumberOrdering = async () => {
      setIsLoadingOptions(true);
      setOptionsError(null);

      try {
        const [{ countries: loadedCountries }, { request }] = await Promise.all([
          numberOrderingApi.getOptions(),
          numberOrderingApi.getLatestRequest(),
        ]);

        setCountries(loadedCountries);
        setLatestRequest(request);

        const requestData = request?.requestData || {};
        setEndUserName(typeof requestData.endUserName === "string" ? requestData.endUserName : "");
        setBusinessName(typeof requestData.businessName === "string" ? requestData.businessName : "");
        setNotes(typeof requestData.notes === "string" ? requestData.notes : "");
      } catch (error) {
        console.error("[PaywallStep] Failed to load number ordering data:", error);
        setOptionsError("We could not load number availability right now. Refresh and try again.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void loadNumberOrdering();
  }, [reloadKey]);

  useEffect(() => {
    if (countries.length === 0) return;

    const pendingCountryCode = latestRequest?.countryCode;
    const storedCountryCode = getStoredSelection("selectedNumberCountry");
    const defaultCountryCode = DEFAULT_COUNTRY_BY_REGION[detectedRegion || "EU"] || countries[0]?.countryCode;
    const nextCountryCode = [pendingCountryCode, storedCountryCode, defaultCountryCode]
      .find((countryCode) => countryCode && countries.some((country) => country.countryCode === countryCode))
      || countries[0]?.countryCode;

    if (nextCountryCode && nextCountryCode !== selectedCountryCode) {
      setSelectedCountryCode(nextCountryCode);
    }
  }, [countries, detectedRegion, latestRequest?.countryCode, selectedCountryCode]);

  const selectedCountry = countries.find((country) => country.countryCode === selectedCountryCode) || null;
  const availableCategories = selectedCountry?.categories ?? EMPTY_CATEGORIES;

  useEffect(() => {
    if (availableCategories.length === 0) {
      if (selectedNumberCategory) {
        setSelectedNumberCategory("");
      }
      return;
    }

    const pendingCategory = latestRequest?.countryCode === selectedCountryCode ? latestRequest.numberCategory : null;
    const storedCategory = getStoredSelection("selectedNumberCategory");
    const nextCategory = [pendingCategory, storedCategory, "GEOGRAPHIC"]
      .find((category) => category && availableCategories.some((item) => item.numberCategory === category))
      || availableCategories[0]?.numberCategory;

    if (nextCategory && nextCategory !== selectedNumberCategory) {
      setSelectedNumberCategory(nextCategory);
    }
  }, [availableCategories, latestRequest?.countryCode, latestRequest?.numberCategory, selectedCountryCode, selectedNumberCategory]);

  const selectedRule = availableCategories.find((category) => category.numberCategory === selectedNumberCategory) || null;
  const hasBlockingRequestForSelection = Boolean(
    latestRequest &&
      latestRequest.countryCode === selectedCountryCode &&
      latestRequest.numberCategory === selectedNumberCategory &&
      REQUEST_BLOCKING_STATUSES.has(latestRequest.status)
  );

  const plans = regionPlans && regionPlans.length > 0
    ? regionPlans.map((rp) => {
        const planId = rp.id as PlanId;
        const minutes = rp.monthlyMinutes || rp.minutesIncluded || minutesPerPlan[planId]?.minutes || 500;
        const estimatedCalls = `~${Math.round(minutes / 2.5)}`;
        return {
          id: planId,
          name: planId.charAt(0).toUpperCase() + planId.slice(1),
          price: rp.formattedPrice,
          subtitle: `${minutes.toLocaleString()} minutes/month (${estimatedCalls} calls)`,
          highlight: planId === "growth",
        };
      })
    : defaultPlans;

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRequestError(null);
    setSelectedCountryCode(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRequestError(null);
    setSelectedNumberCategory(event.target.value);
  };

  const handlePlanAction = async (planId: PlanId) => {
    setRequestError(null);

    if (!selectedRule) {
      setRequestError("Select a supported country and number type first.");
      return;
    }

    if (selectedRule.appStatus === "hide") {
      setRequestError("This number type is not available yet.");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("selectedNumberCountry", selectedRule.countryCode);
      window.sessionStorage.setItem("selectedNumberCategory", selectedRule.numberCategory);
    }

    if (selectedRule.appStatus === "verification_required") {
      setIsSubmittingRequest(true);

      try {
        const { request } = await numberOrderingApi.createRequest({
          countryCode: selectedRule.countryCode,
          numberCategory: selectedRule.numberCategory,
          planId,
          endUserName: endUserName || undefined,
          businessName: businessName || undefined,
          notes: notes || undefined,
        });

        setLatestRequest(request);
      } catch (error) {
        console.error("[PaywallStep] Failed to submit number request:", error);
        setRequestError(error instanceof Error ? error.message : "Failed to submit your number request.");
      } finally {
        setIsSubmittingRequest(false);
      }

      return;
    }

    onSelectPlan(planId, {
      countryCode: selectedRule.countryCode,
      numberCategory: selectedRule.numberCategory,
    });
  };

  const refreshButtonLabel = hasBlockingRequestForSelection
    ? "Refresh number request status"
    : "I already subscribed - refresh status";

  const actionHint = hasBlockingRequestForSelection
    ? "You already have a pending request for this number. We'll contact you before asking for payment."
    : selectedRule?.appStatus === "verification_required"
      ? "Choosing a plan will submit a manual number request instead of opening checkout."
      : "You'll be redirected to our secure checkout.";

  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/60 rounded-2xl flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Choose a plan and number</h2>
        <p className="text-muted-foreground">
          Pick the number country first. Instant countries go straight to checkout. Regulated countries create a manual request.
        </p>
      </div>

      {isLoadingOptions ? (
        <div className="flex items-center justify-center py-8 mb-5">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading number availability...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-5">
            <div className="grid gap-2">
              <Label htmlFor="number-country">Number country</Label>
              <select
                id="number-country"
                value={selectedCountryCode}
                onChange={handleCountryChange}
                disabled={countries.length === 0}
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countries.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="number-category">Number type</Label>
              <select
                id="number-category"
                value={selectedNumberCategory}
                onChange={handleCategoryChange}
                disabled={availableCategories.length === 0}
                className="h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {availableCategories.map((category) => (
                  <option key={category.numberCategory} value={category.numberCategory}>
                    {CATEGORY_LABELS[category.numberCategory] || category.numberCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRule && (
            <div
              className={cn(
                "mb-5 rounded-xl border p-4",
                selectedRule.appStatus === "instant" && "border-emerald-200 bg-emerald-50",
                selectedRule.appStatus === "verification_required" && "border-amber-200 bg-amber-50",
                selectedRule.appStatus === "hide" && "border-slate-200 bg-slate-50"
              )}
            >
              <div className="flex items-start gap-3">
                {selectedRule.appStatus === "instant" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                )}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRule.appStatus === "instant"
                      ? "Instant provisioning available"
                      : selectedRule.appStatus === "verification_required"
                        ? "Manual verification required"
                        : "Not available yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRule.appStatus === "instant" && "This number can be provisioned automatically after checkout."}
                    {selectedRule.appStatus === "verification_required" && "We'll create a manual request first and follow up for end-user documents before activation."}
                    {selectedRule.appStatus === "hide" && "This country and number type is currently hidden in VoiceFleet."}
                  </p>
                  {selectedRule.documentTypes.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Typical documents: {selectedRule.documentTypes.map(formatDocumentType).join(", ")}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedRule?.appStatus === "verification_required" && !hasBlockingRequestForSelection && (
            <div className="grid gap-4 mb-5 rounded-xl border border-border bg-muted/30 p-4">
              <div className="grid gap-2">
                <Label htmlFor="end-user-name">End-user name</Label>
                <Input
                  id="end-user-name"
                  placeholder="Customer or company contact"
                  value={endUserName}
                  onChange={(event) => setEndUserName(event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="business-name">Business name</Label>
                <Input
                  id="business-name"
                  placeholder="Optional"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="number-request-notes">Notes</Label>
                <Textarea
                  id="number-request-notes"
                  placeholder="Anything you already know about the end-user documents or the requested number"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>
          )}

          {latestRequest && (
            <div
              className={cn(
                "mb-5 rounded-xl border p-4",
                latestRequest.status === "rejected" ? "border-red-200 bg-red-50" : "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-start gap-3">
                {latestRequest.status === "rejected" ? (
                  <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {latestRequest.countryName} {CATEGORY_LABELS[latestRequest.numberCategory] || latestRequest.numberCategory} request
                  </p>
                  <p className="text-sm text-muted-foreground">{getRequestStatusMessage(latestRequest)}</p>
                </div>
              </div>
            </div>
          )}

          {optionsError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {optionsError}
            </div>
          )}

          {requestError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {requestError}
            </div>
          )}

          <div className="grid gap-3 mb-5">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => void handlePlanAction(plan.id)}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all",
                  "hover:border-primary/50 hover:bg-primary/5",
                  plan.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-background"
                )}
                disabled={hasSubscription || hasBlockingRequestForSelection || isLoadingRegion || isLoadingOptions || isSubmittingRequest || !selectedRule}
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
                    <p className="text-xs text-muted-foreground">
                      {selectedRule?.appStatus === "verification_required" ? "Submit request" : "Billed monthly"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
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
            onClick={hasBlockingRequestForSelection ? () => setReloadKey((current) => current + 1) : onRefresh}
            isLoading={hasBlockingRequestForSelection ? isLoadingOptions : isRefreshing}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4" />
            {refreshButtonLabel}
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
        {actionHint}
      </p>
    </div>
  );
}

export default PaywallStep;
