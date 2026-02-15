"use client";

import type { Booking } from "@/lib/demo/types";

export default function BookingBadge({ booking }: { booking: Booking }) {
  return (
    <div className="absolute inset-0.5 rounded bg-accent/90 text-white flex items-center justify-center px-1 animate-in zoom-in-75 duration-300">
      <span className="text-[10px] font-semibold leading-tight truncate">
        {booking.customerName}
      </span>
    </div>
  );
}
