"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/src/components/ui/button";
import { trackEvent, type AnalyticsPayload } from "@/src/lib/analytics";

type TrackedAnchorProps = ButtonProps & {
  href: string;
  eventName: string;
  payload?: AnalyticsPayload;
  children: ReactNode;
};

export function TrackedAnchor({
  href,
  eventName,
  payload,
  children,
  ...buttonProps
}: TrackedAnchorProps) {
  return (
    <Button asChild {...buttonProps}>
      <a
        href={href}
        onClick={() => {
          trackEvent(eventName, payload);
        }}
      >
        {children}
      </a>
    </Button>
  );
}
