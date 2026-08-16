import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    // /marketing 은 내부용 대시보드라 검색엔진에서 제외한다
    rules: { userAgent: "*", allow: "/", disallow: ["/marketing"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
