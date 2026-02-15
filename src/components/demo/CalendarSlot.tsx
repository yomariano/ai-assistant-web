"use client";

import type { Booking } from "@/lib/demo/types";
import BookingBadge from "./BookingBadge";

type CalendarSlotProps = {
  slotKey: string;
  available: boolean;
  booking?: Booking;
  mode: "setup" | "call";
  highlighted?: boolean;
  onToggle?: () => void;
};

export default function CalendarSlot({
  available,
  booking,
  mode,
  highlighted,
  onToggle,
}: CalendarSlotProps) {
  if (booking) {
    return (
      <div className="relative h-9 rounded border border-accent/40 bg-accent/10">
        <BookingBadge booking={booking} />
      </div>
    );
  }

  if (mode === "setup") {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 rounded border transition-colors ${
          available
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
            : "border-dashed border-border bg-muted/30 hover:bg-muted/50"
        }`}
      />
    );
  }

  // Call mode: read-only
  return (
    <div
      className={`h-9 rounded border transition-colors ${
        available
          ? highlighted
            ? "border-primary bg-primary/10 animate-pulse"
            : "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-dashed border-border bg-muted/20"
      }`}
    />
  );
}
