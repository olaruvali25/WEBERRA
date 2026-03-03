import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/src/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/en",
    "/demo-website-presentation",
    "/en/demo-website-presentation",
    "/privacy",
    "/terms",
    "/en/privacy",
    "/en/terms"
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: "weekly",
    priority: route === "/" || route === "/en" ? 1 : 0.7,
    lastModified: new Date()
  }));
}
