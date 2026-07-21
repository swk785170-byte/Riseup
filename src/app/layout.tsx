import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "RISE UP MEDIA — We Build Websites That Grow Businesses",
  description:
    "Rise Up Media is a web development agency crafting high-performance websites, e-commerce experiences and brands that convert. Design, development, SEO and ongoing care — under one roof.",
  keywords: [
    "web development agency",
    "web design",
    "e-commerce development",
    "SEO",
    "Next.js agency",
  ],
  openGraph: {
    title: "RISE UP MEDIA — We Build Websites That Grow Businesses",
    description:
      "High-performance websites, e-commerce experiences and brands that convert.",
    type: "website",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
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
        <SmoothScroll>{children}</SmoothScroll>
        {/* Persistent fractal-noise grain across the entire site */}
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
