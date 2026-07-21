"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({
  children,
  posthogKey,
}: {
  children: React.ReactNode;
  posthogKey?: string;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && !posthog.__loaded && posthogKey) {
      posthog.init(posthogKey, {
        api_host: `${window.location.origin}/ingest`,
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV !== "production") {
            ph.opt_out_capturing();
          }
        },
      });
    }
  }, [posthogKey]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
