'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, type UmamiEventData } from '@/lib/umami';

interface BlogImpressionTrackerProps {
  eventName: string;
  eventData?: UmamiEventData;
  rootMargin?: string;
  threshold?: number;
}

export default function BlogImpressionTracker({
  eventName,
  eventData,
  rootMargin = '0px 0px -35% 0px',
  threshold = 0.2,
}: BlogImpressionTrackerProps) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const marker = markerRef.current;

    if (!marker || hasTrackedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && !hasTrackedRef.current) {
          hasTrackedRef.current = true;
          trackEvent(eventName, eventData);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(marker);

    return () => observer.disconnect();
  }, [eventData, eventName, rootMargin, threshold]);

  return <span ref={markerRef} aria-hidden="true" className="block h-px w-full opacity-0" />;
}
