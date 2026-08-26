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

/**
 * 사이트를 만든 주체. 홈에 한 번만 넣는다.
 * 구글이 "이 사이트는 누가 운영하는가"를 판단할 때 쓰고,
 * 검색 결과 오른쪽 정보 패널의 근거가 되기도 한다.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "뿌리찾기",
    url: SITE,
    logo: `${SITE}/share-preview.png`,
    email: "dbsqja9288@gmail.com",
    description:
      "한국인의 성씨 141개와 본관 761개를 정리해 공개하는 무료 서비스입니다.",
    knowsLanguage: "ko-KR",
    areaServed: { "@type": "Country", name: "대한민국" },
  };
}

/**
 * 자주 묻는 질문.
 *
 * 사람들이 검색창에 실제로 치는 문장("본관이 뭐예요", "김해김씨 시조가 누구야")을
 * 그대로 질문으로 두고, 페이지 안에 있는 답을 그대로 답으로 둔다.
 * 구글이 검색 결과에 질문·답을 접힌 형태로 함께 보여줄 수 있고,
 * AI 검색 요약이 인용할 때도 이 형식을 잘 집어간다.
 *
 * ★ 규칙: 여기 들어가는 답은 **반드시 페이지 본문에도 같은 내용이 있어야 한다.**
 *   본문에 없는 답을 구조화 데이터에만 넣으면 구글 정책 위반이다.
 */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** 목록 페이지(성씨 하나에 딸린 본관들)를 목록으로 알려준다. */
export function itemListSchema(opts: {
  name: string;
  items: { name: string; href: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE}${it.href}`,
    })),
  };
}
