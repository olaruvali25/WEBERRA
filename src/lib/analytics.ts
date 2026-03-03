export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  console.info("[analytics]", event, payload);
}
