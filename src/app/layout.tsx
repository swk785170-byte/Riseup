import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import SplashScreen from "@/components/SplashScreen";
import SettingsProvider from "@/components/SettingsProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteSettings } from "@/lib/data/site";
import { siteUrl } from "@/lib/site-url";
import JsonLd, {
  organisationSchema,
  websiteSchema,
} from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  // Required for og:image / canonical URLs to resolve absolutely.
  metadataBase: new URL(siteUrl()),
  alternates: { canonical: "/" },
  title: {
    default: "RISEUP SOLUTIONS — We Build Websites That Grow Businesses",
    // Inner pages set only their own name; the brand is appended here.
    template: "%s — RISEUP SOLUTIONS",
  },
  description:
    "Riseup Solutions is a web development agency crafting high-performance websites, e-commerce experiences and brands that convert. Design, development, SEO and ongoing care — under one roof.",
  keywords: [
    "web development agency",
    "web design",
    "e-commerce development",
    "SEO",
    "Next.js agency",
  ],
  openGraph: {
    title: "RISEUP SOLUTIONS — We Build Websites That Grow Businesses",
    description:
      "High-performance websites, e-commerce experiences and brands that convert.",
    type: "website",
    siteName: "Riseup Solutions",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RISEUP SOLUTIONS — We Build Websites That Grow Businesses",
    description:
      "High-performance websites, e-commerce experiences and brands that convert.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    /*
     * The `?v=` suffix is deliberate. Browsers cache favicons far more
     * aggressively than page assets — often ignoring cache headers and
     * surviving a hard refresh — so replacing the file at the SAME URL leaves
     * the old icon showing indefinitely. Changing the query makes it a new URL.
     *
     * BUMP THIS NUMBER whenever the icon artwork changes.
     */
    icon: [
      // SVG first for crisp rendering at any size; the 32px PNG covers
      // browsers that will not take an SVG favicon.
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/icon-32.png?v=2", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/icon-32.png?v=2",
    // iOS ignores SVG here and composites onto a background, so this one is a
    // PNG with the brand cream baked in.
    apple: [
      { url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const base = siteUrl();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Entity graph: lets search and AI engines resolve "Riseup Solutions"
            to one organisation rather than guessing from page copy. */}
        <JsonLd
          data={organisationSchema({
            siteUrl: base,
            email: settings.email,
            socials: [
              settings.instagramUrl,
              settings.facebookUrl,
              settings.linkedinUrl,
              settings.youtubeUrl,
            ],
          })}
        />
        <JsonLd data={websiteSchema(base)} />
        {/* Satoshi via Fontshare CDN — React 19 hoists these into <head> */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          precedence="default"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        <SettingsProvider settings={settings}>
          <SmoothScroll>{children}</SmoothScroll>
          {/* Persistent fractal-noise grain across the public site (not /admin) */}
          <GrainOverlay />
          {/* Brief branded loading splash on full page loads (not /admin) */}
          <SplashScreen />
          {/* Floating WhatsApp contact (not /admin, hidden if no number set) */}
          <WhatsAppButton />
        </SettingsProvider>
      </body>
    </html>
  );
}
