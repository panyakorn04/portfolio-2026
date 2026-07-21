"use client";

import { useEffect } from "react";
import { posthog } from "../lib/posthog-client";

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
        api_host: posthogHost || "/ingest",
      });
      if (process.env.NODE_ENV !== "production") {
        posthog.opt_out_capturing();
      }
    }
  }, [posthogKey, posthogHost]);

  return <>{children}</>;
}
