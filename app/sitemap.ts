import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified: a date that changes on every deploy says nothing, and Google learns to ignore
  // it. The home URL ends in "/" to match its canonical.
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/contacto`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
