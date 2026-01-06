declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}

/**
 * Track a custom event with Umami analytics
 * @param eventName - The name of the event (e.g., 'button_click', 'form_submit')
 * @param eventData - Optional data to attach to the event
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

/**
 * Track a page view with Umami analytics
 * @param url - Optional URL to track (defaults to current page)
 */
export function trackPageView(url?: string): void {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(url || window.location.pathname);
  }
}
