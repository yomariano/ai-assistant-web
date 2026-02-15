"use client";

import { useCallback, useMemo, useState } from "react";
import type { Booking, DemoLanguageId, DemoStep } from "@/lib/demo/types";
import {
  DEMO_SCENARIOS,
  getWeekStart,
  getWeekDays,
  getIndustryDefaults,
  getTimeSlots,
  formatSlotKey,
} from "@/lib/demo/calendar-utils";
import DemoSteps from "./DemoSteps";
import IndustryPicker from "./IndustryPicker";
import WeeklyCalendar from "./WeeklyCalendar";
import DemoCallPanel from "./DemoCallPanel";
import LiveBookings from "./LiveBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/umami";

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>(1);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [demoSessionId, setDemoSessionId] = useState("");
  const [highlightDate, setHighlightDate] = useState<string | null>(null);
  const [languageId, setLanguageId] = useState<DemoLanguageId>("en");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const weekStart = useMemo(() => getWeekStart(), []);
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const scenario = useMemo(
    () => DEMO_SCENARIOS.find((s) => s.id === scenarioId) || null,
    [scenarioId]
  );

  const availableSlotCount = useMemo(
    () => Object.values(availability).filter(Boolean).length,
    [availability]
  );

  // Step 1: Select industry
  const handleSelectIndustry = useCallback(
    (id: string) => {
      setScenarioId(id);
      setAvailability(getIndustryDefaults(id, weekDays));
      setBookings([]);
      setStep(2);
      trackEvent("demo_industry_selected", { industry: id });
    },
    [weekDays]
  );

  // Step 2: Toggle individual slot
  const handleToggleSlot = useCallback((slotKey: string) => {
    setAvailability((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey],
    }));
  }, []);

  // Step 2: Set business hours (Mon-Fri 9-5)
  const handleSetBusinessHours = useCallback(() => {
    const times = getTimeSlots();
    const newAvailability: Record<string, boolean> = {};
    weekDays.forEach((day, i) => {
      const dayOfWeek = i + 1; // 1=Mon...7=Sun
      if (dayOfWeek <= 5) {
        times.forEach((time) => {
          const hour = parseInt(time.split(":")[0], 10);
          if (hour >= 9 && hour < 17) {
            newAvailability[formatSlotKey(day.dateStr, time)] = true;
          }
        });
      }
    });
    setAvailability(newAvailability);
  }, [weekDays]);

  // Step 2: Clear all
  const handleClearAll = useCallback(() => {
    setAvailability({});
  }, []);

  // Step 2 -> 3: Create session and start call flow
  const handleStartCallMode = useCallback(async () => {
    if (!scenarioId || !scenario) return;
    if (availableSlotCount === 0) return;

    setIsCreatingSession(true);

    const sessionId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/public/demo-tools/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            availability,
            scenario: scenarioId,
            businessName: scenario.businessName,
          }),
        });
        if (!res.ok) {
          console.error("[Demo] Session creation failed:", res.status, await res.text().catch(() => ""));
        }
      } catch (err) {
        console.error("[Demo] Session creation error:", err);
      }
    }

    setDemoSessionId(sessionId);
    setBookings([]);
    setIsCreatingSession(false);
    setStep(3);
  }, [availability, availableSlotCount, scenario, scenarioId]);

  const handleBookingCreated = useCallback((booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="pt-24 pb-6 sm:pt-28 sm:pb-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
            See AI Booking in Action
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick your industry, set your availability, and watch the AI book real appointments on your calendar — live.
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="px-4 pb-6">
        <div className="container mx-auto max-w-6xl">
          <DemoSteps currentStep={step} />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          {/* Step 1: Industry Picker */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  What kind of business do you run?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select an industry to see how the AI handles calls for your business type.
                </p>
              </div>
              <IndustryPicker selectedId={scenarioId} onSelect={handleSelectIndustry} />
            </div>
          )}

          {/* Step 2: Calendar Setup */}
          {step === 2 && scenario && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Change industry
                </button>
                <span className="text-sm text-muted-foreground">
                  {scenario.label} — {scenario.businessName}
                </span>
              </div>

              <WeeklyCalendar
                weekDays={weekDays}
                availability={availability}
                bookings={[]}
                mode="setup"
                onToggleSlot={handleToggleSlot}
                onSetBusinessHours={handleSetBusinessHours}
                onClearAll={handleClearAll}
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {availableSlotCount} slot{availableSlotCount !== 1 ? "s" : ""} available
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleStartCallMode}
                  disabled={availableSlotCount === 0 || isCreatingSession}
                >
                  {isCreatingSession ? (
                    "Setting up..."
                  ) : (
                    <>
                      Start Demo Call
                      <Phone className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Call + Live Calendar */}
          {step === 3 && scenario && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setBookings([]);
                    setHighlightDate(null);
                  }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to calendar setup
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Calendar + Live Bookings: 3/5 width on desktop */}
                <div className="lg:col-span-3 space-y-6">
                  <WeeklyCalendar
                    weekDays={weekDays}
                    availability={availability}
                    bookings={bookings}
                    mode="call"
                    highlightDate={highlightDate ?? undefined}
                  />
                  <LiveBookings bookings={bookings} />
                </div>

                {/* Call Panel: 2/5 width on desktop */}
                <div className="lg:col-span-2">
                  <DemoCallPanel
                    scenario={scenario}
                    demoSessionId={demoSessionId}
                    availability={availability}
                    languageId={languageId}
                    onLanguageChange={setLanguageId}
                    onBookingCreated={handleBookingCreated}
                    onHighlightDate={setHighlightDate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Ready to automate your bookings?
          </h2>
          <p className="text-muted-foreground">
            Get your AI receptionist live in under 5 minutes. No credit card required for the trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" data-umami-event="cta_click" data-umami-event-location="demo_bottom">
              <Button variant="hero" size="lg">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href="https://calendly.com/voicefleet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Book a Guided Demo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
