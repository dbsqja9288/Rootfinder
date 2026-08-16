/**
 * 검색엔진에게 페이지의 뜻을 알려주는 구조화 데이터(JSON-LD).
 *
 * 사람 눈에는 안 보이고 크롤러만 읽는다.
 * 구글은 이걸로 사이트 링크·검색창을, 네이버는 문서 분류를 잡는다.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // 구조화 데이터는 우리가 만든 값만 들어가므로 안전하다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import { SITE_URL as SITE } from "@/lib/site";

/** 사이트 전체를 설명한다. 홈에 한 번만 넣는다. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "뿌리찾기",
    alternateName: "뿌리찾기 — 성씨와 본관 찾기",
    url: SITE,
    inLanguage: "ko-KR",
    description:
      "한국인의 성씨와 본관, 시조의 유래를 찾아보는 무료 서비스. 본관 하나를 페이지 하나로 정리했습니다.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE}/surnames?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** 본관 페이지 하나를 하나의 문서로 설명한다. */
export function clanSchema(opts: {
  fullName: string;
  href: string;
  description: string;
  regionNow?: string;
  founder?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.fullName,
    description: opts.description,
    url: `${SITE}${opts.href}`,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    about: [
      { "@type": "Thing", name: opts.fullName },
      ...(opts.regionNow ? [{ "@type": "Place", name: opts.regionNow }] : []),
      ...(opts.founder ? [{ "@type": "Person", name: opts.founder }] : []),
    ],
    publisher: { "@type": "Organization", name: "뿌리찾기", url: SITE },
  };
}

/** 빵부스러기. 검색 결과에 경로가 함께 뜬다. */
export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.href}`,
    })),
  };
}
