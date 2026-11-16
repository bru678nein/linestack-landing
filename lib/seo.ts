import type { Metadata } from "next";
import { site } from "@/config/site";

/**
 * Open Graph block for one page. A page that sets `openGraph` replaces the parent's whole object
 * instead of merging into it, so every page builds the complete set here. The preview image is not
 * inherited either, and Next ignores config images when a file-based one exists, so each page
 * segment re-exports app/opengraph-image.tsx as its own opengraph-image.tsx.
 */
export function openGraphFor(title: string, description: string, path: string): Metadata["openGraph"] {
  return {
    title,
    description,
    url: path,
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  };
}
