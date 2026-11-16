import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@/components/Analytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/config/site";
import { openGraphFor } from "@/lib/seo";
import "./globals.css";

// Tipografías de Fontshare (ITF Free Font License, ver app/fonts/LICENSE-FFL.txt),
// alojadas en el propio sitio como permite la licencia.
const clash = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.homeTitle,
  description: site.description,
  openGraph: openGraphFor(site.homeTitle, site.description, "/"),
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#050505" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${satoshi.variable} ${clash.variable}`}>
      <body className="noise antialiased">
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
