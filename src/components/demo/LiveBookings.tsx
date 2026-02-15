"use client";

import { CalendarDays, Clock, User } from "lucide-react";
import type { Booking } from "@/lib/demo/types";
import { formatTimeDisplay } from "@/lib/demo/calendar-utils";

type LiveBookingsProps = {
  bookings: Booking[];
};

export default function LiveBookings({ bookings }: LiveBookingsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-foreground">
          Live Bookings
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Watch bookings being created in real-time
      </p>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No bookings yet — start a call and ask the AI to book an appointment
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {[...bookings].reverse().map((booking, idx) => (
            <div
              key={`${booking.date}_${booking.time}_${idx}`}
              className="rounded-xl border border-border bg-background p-4 animate-in slide-in-from-top-2 fade-in duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {booking.customerName || "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.service || "Appointment"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {booking.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimeDisplay(booking.time)}
                </span>
              </div>
              {(booking.confirmationNumber || booking.notes) && (
                <p className="mt-2 text-xs italic text-muted-foreground/80">
                  Note: {[booking.confirmationNumber, booking.notes].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
