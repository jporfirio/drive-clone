// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@drive/env";
import { useEffect, type ReactNode } from "react";
import dynamicLoader from "next/dynamic";

const SuspendedPostHogPageView = dynamicLoader(
  () => import("./pageview-tracker"),
  {
    ssr: false,
  },
);

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}
