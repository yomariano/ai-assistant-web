"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const DEADLINE = new Date("2026-04-01T00:00:00Z").getTime();
const STORAGE_KEY = "countdown-banner-dismissed";

function getTimeLeft() {
  const now = Date.now();
  const diff = DEADLINE - now;
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [dismissed, setDismissed] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === "true";

    queueMicrotask(() => {
      if (!mountedRef.current) return;
      setDismissed(wasDismissed);
      setTimeLeft(getTimeLeft());
    });

    const interval = setInterval(() => {
      const tl = getTimeLeft();
      if (!tl) {
        clearInterval(interval);
      }
      setTimeLeft(tl);
    }, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  if (dismissed || !timeLeft) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-primary via-primary/90 to-accent text-white">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-4 text-sm">
        <span className="font-semibold">
          Launch offer: 25% off Growth &amp; Pro plans &mdash; ends March 31
        </span>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <TimeBlock value={timeLeft.days} label="d" />
          <span className="opacity-70">:</span>
          <TimeBlock value={timeLeft.hours} label="h" />
          <span className="opacity-70">:</span>
          <TimeBlock value={timeLeft.minutes} label="m" />
          <span className="opacity-70">:</span>
          <TimeBlock value={timeLeft.seconds} label="s" />
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <span className="bg-white/20 rounded px-1.5 py-0.5 tabular-nums">
    {String(value).padStart(2, "0")}{label}
  </span>
);

export default CountdownBanner;
