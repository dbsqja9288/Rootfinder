import type { MetadataRoute } from "next";
import { SURNAMES } from "@/data/surnames";
import { CLAN_ENTRIES } from "@/lib/clan-index";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

/**
 * 콘텐츠가 마지막으로 바뀐 날.
 *
 * 예전에는 여기에 `new Date()`를 썼다. 그러면 **배포할 때마다** 사이트맵이
 * "915개 페이지가 전부 오늘 바뀌었다"고 말하게 된다. 실제로는 광고 위치 하나만
 * 고쳤는데도 그렇다. 이런 사이트맵을 구글은 곧 믿지 않게 되고,
 * 정말로 내용을 고친 날에도 다시 와 보지 않는다.
 *
 * 그래서 날짜를 손으로 박아둔다. **성씨·본관 데이터를 실제로 고쳤을 때만**
 * 이 한 줄을 오늘 날짜로 바꾸면 된다. (예: 정정 요청을 반영했을 때)
 */
const DATA_UPDATED = new Date("2026-08-25");

/** 서비스 페이지는 데이터와 별개로 손보는 일이 잦아서 따로 둔다. */
const APP_UPDATED = new Date("2026-08-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { p: "", priority: 1, freq: "daily" as const },
    { p: "/surnames", priority: 0.9, freq: "weekly" as const },
    { p: "/joseon", priority: 0.9, freq: "weekly" as const },
    { p: "/fortune", priority: 0.8, freq: "weekly" as const },
    { p: "/kin", priority: 0.8, freq: "weekly" as const },
    { p: "/family-tree", priority: 0.7, freq: "monthly" as const },
    { p: "/history", priority: 0.7, freq: "monthly" as const },
    { p: "/stories", priority: 0.7, freq: "monthly" as const },
    { p: "/about", priority: 0.5, freq: "yearly" as const },
    { p: "/corrections", priority: 0.5, freq: "weekly" as const },
    { p: "/support", priority: 0.3, freq: "yearly" as const },
    { p: "/legal/privacy", priority: 0.2, freq: "yearly" as const },
    { p: "/legal/terms", priority: 0.2, freq: "yearly" as const },
  ].map(({ p, priority, freq }) => ({
    url: `${BASE}${p}`,
    lastModified: APP_UPDATED,
    changeFrequency: freq,
    priority,
  }));

  // 성씨 목록 페이지 141개 — 본관 페이지로 들어가는 길목이라 본관보다 높게 둔다
  const surnameRoutes: MetadataRoute.Sitemap = SURNAMES.map((s) => ({
    url: `${BASE}/surnames/${s.id}`,
    lastModified: DATA_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 본관 페이지 761개 — 해설이 있는 쪽을 먼저 보라고 우선순위로 알려준다
  const clanRoutes: MetadataRoute.Sitemap = CLAN_ENTRIES.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: DATA_UPDATED,
    changeFrequency: "monthly",
    priority: c.detail ? 0.6 : 0.4,
  }));

  return [...staticRoutes, ...surnameRoutes, ...clanRoutes];
}
