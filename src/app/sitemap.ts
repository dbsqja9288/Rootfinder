import type { MetadataRoute } from "next";
import { SURNAMES } from "@/data/surnames";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/surnames", "/family-tree", "/history", "/stories"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    priority: p === "" ? 1 : 0.8,
  }));

  const surnameRoutes = SURNAMES.map((s) => ({
    url: `${BASE}/surnames/${s.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticRoutes, ...surnameRoutes];
}
