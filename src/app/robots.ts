import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/marketing", // 내부용 성과 대시보드
        "/api/", // 기계용 응답. 색인돼 봐야 검색 결과만 어지럽힌다
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
