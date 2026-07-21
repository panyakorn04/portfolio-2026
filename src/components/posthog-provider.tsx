"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({
  children,
  posthogKey,
  posthogHost,
}: {
  children: React.ReactNode;
  posthogKey?: string;
  posthogHost?: string;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && !posthog.__loaded && posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost ?? "/ingest",
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV !== "production") {
            ph.opt_out_capturing();
          }
        },
      });
    }
  }, [posthogKey, posthogHost]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
