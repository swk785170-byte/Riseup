import { ImageResponse } from "next/og";

/**
 * Social share card, generated at build rather than shipped as a binary.
 *
 * The site previously had no og:image at all, so every share on WhatsApp,
 * LinkedIn or X rendered as a bare text link. Uses system fonts only — no
 * network fetch, so generation cannot fail on a font download.
 */
export const alt = "Riseup Solutions — We Build Websites That Grow Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFDF8",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#0B0B0B",
          }}
        >
          riseup
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#0B0B0B",
            maxWidth: "900px",
          }}
        >
          We Build Websites That Grow Businesses
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#3A3A3A",
          }}
        >
          Riseup Solutions
        </div>
      </div>
    ),
    size,
  );
}
