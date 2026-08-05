"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

/** Site-wide contact email, WhatsApp number and company social links. */
export function useSiteSettings(): SiteSettings {
  return useContext(SettingsContext);
}

/**
 * Fetched once in the root layout (a Server Component) and shared with every
 * client component that needs it — so the footer, navbar, contact sections and
 * WhatsApp button all read the same admin-managed values without threading
 * props through every page.
 */
export default function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
