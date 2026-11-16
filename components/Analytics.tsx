"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics 4. The tag loads only on the production host, so local previews and the
// vercel.app mirrors never reach the reports. Never put personal data (name, email, message)
// in an event: Google's terms forbid it.
const GA_ID = "G-S84D52M61H";
const PRODUCTION_HOST = "www.linestack.com.ar";

type Gtag = (...args: unknown[]) => void;

/**
 * GA4's recommended lead event. `contact_channel` and `project_kind` must be registered as
 * custom dimensions in GA4 to show up in reports. A no-op until the tag has loaded.
 */
export function trackLead(contactChannel: "email" | "whatsapp", projectKind?: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", "generate_lead", { contact_channel: contactChannel, project_kind: projectKind ?? "" });
}

export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.location.hostname !== PRODUCTION_HOST) return;
    setEnabled(true);

    // Every WhatsApp button on the site is a wa.me link, so one delegated listener covers the
    // hero, the floating button, the projects and the footer. This records intent: the chat
    // opened, not that a message was sent.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (link) trackLead("whatsapp");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!enabled) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
