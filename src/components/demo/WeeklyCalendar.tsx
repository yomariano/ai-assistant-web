"use client";

import { Fragment, useMemo } from "react";
import type { Booking } from "@/lib/demo/types";
import type { WeekDay } from "@/lib/demo/calendar-utils";
import {
  getTimeSlots,
  formatSlotKey,
  formatTimeDisplay,
} from "@/lib/demo/calendar-utils";
import CalendarSlot from "./CalendarSlot";

type WeeklyCalendarProps = {
  weekDays: WeekDay[];
  availability: Record<string, boolean>;
  bookings: Booking[];
  mode: "setup" | "call";
  highlightDate?: string; // "YYYY-MM-DD" — date being checked by AI
  onToggleSlot?: (slotKey: string) => void;
  onSetBusinessHours?: () => void;
  onClearAll?: () => void;
};

export default function WeeklyCalendar({
  weekDays,
  availability,
  bookings,
  mode,
  highlightDate,
  onToggleSlot,
  onSetBusinessHours,
  onClearAll,
}: WeeklyCalendarProps) {
  const timeSlots = useMemo(() => getTimeSlots(), []);

  const bookingMap = useMemo(() => {
    const map: Record<string, Booking> = {};
    bookings.forEach((b) => {
      map[formatSlotKey(b.date, b.time)] = b;
    });
    return map;
  }, [bookings]);

  return (
    <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
      {mode === "setup" && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">
            Set your availability
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSetBusinessHours}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              Business Hours
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      {mode === "call" && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-medium text-foreground">
            Live Calendar
          </p>
          {bookings.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({bookings.length} booking{bookings.length > 1 ? "s" : ""})
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4">
        <div
          className="grid gap-px min-w-[600px]"
          style={{
            gridTemplateColumns: "60px repeat(7, 1fr)",
          }}
        >
          {/* Header row */}
          <div /> {/* Empty corner */}
          {weekDays.map((day) => (
            <div
              key={day.dateStr}
              className={`text-center py-2 ${
                day.isToday ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <div className="text-xs font-medium">{day.dayName}</div>
              <div className="text-xs">{day.monthName} {day.dayNum}</div>
            </div>
          ))}

          {/* Time rows */}
          {timeSlots.map((time) => (
            <Fragment key={time}>
              <div
                className="text-[11px] text-muted-foreground pr-2 flex items-center justify-end"
              >
                {formatTimeDisplay(time)}
              </div>
              {weekDays.map((day) => {
                const key = formatSlotKey(day.dateStr, time);
                return (
                  <CalendarSlot
                    key={key}
                    slotKey={key}
                    available={!!availability[key]}
                    booking={bookingMap[key]}
                    mode={mode}
                    highlighted={highlightDate === day.dateStr}
                    onToggle={
                      mode === "setup" && onToggleSlot
                        ? () => onToggleSlot(key)
                        : undefined
                    }
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {mode === "setup" && (
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-emerald-400 bg-emerald-50" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-dashed border-border bg-muted/30" />
            Unavailable
          </div>
        </div>
      )}

      {mode === "call" && (
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-emerald-400 bg-emerald-50" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-accent/40 bg-accent/10" />
            Booked
          </div>
        </div>
      )}
    </div>
  );
}
