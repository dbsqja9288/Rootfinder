import type { MetadataRoute } from "next";
import { SURNAMES } from "@/data/surnames";
import { CLAN_ENTRIES } from "@/lib/clan-index";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/surnames",
    "/joseon",
    "/fortune",
    "/kin",
    "/family-tree",
    "/history",
    "/stories",
    "/about",
    "/corrections",
    "/support",
    "/legal/privacy",
    "/legal/terms",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    // 약관류는 색인은 되게 두되 우선순위는 낮춘다
    priority: p === "" ? 1 : p.startsWith("/legal") ? 0.3 : 0.8,
  }));

  const surnameRoutes = SURNAMES.map((s) => ({
    url: `${BASE}/surnames/${s.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const clanRoutes = CLAN_ENTRIES.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: new Date(),
    priority: c.detail ? 0.6 : 0.4,
  }));

  return [...staticRoutes, ...surnameRoutes, ...clanRoutes];
}
