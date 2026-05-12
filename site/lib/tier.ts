import { cookies } from "next/headers";

export type Tier = "none" | "starter" | "pdf" | "full";

export const TIER_COOKIE = "rem_tier";

export function getTier(): Tier {
  // Dev preview: set PAYWALL_DISABLED=true (or NEXT_PUBLIC_DEV_UNLOCK=true) to
  // unlock everything without having to click through purchase flow.
  if (
    process.env.PAYWALL_DISABLED === "true" ||
    process.env.NEXT_PUBLIC_DEV_UNLOCK === "true" ||
    process.env.NODE_ENV === "development"
  ) {
    return "full";
  }
  const v = cookies().get(TIER_COOKIE)?.value as Tier | undefined;
  if (v === "starter" || v === "pdf" || v === "full") return v;
  return "none";
}

export function canAccessFull(t: Tier): boolean { return t === "full"; }
export function canDownloadPdf(t: Tier): boolean { return t === "pdf" || t === "full"; }
export function canAccessStarter(t: Tier): boolean { return t !== "none"; }
