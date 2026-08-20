import { SITE_URL } from "@/lib/site";
import { CORRECTIONS } from "@/data/corrections";
import { CLAN_ENTRIES } from "@/lib/clan-index";

/**
 * RSS 피드.
 *
 * 네이버 서치어드바이저는 사이트맵과 별개로 RSS를 받는데,
 * 새 글이 올라온 걸 사이트맵보다 빨리 알아채 수집이 빨라진다.
 * 우리는 '정정 내역'과 해설이 있는 주요 본관을 항목으로 내보낸다.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items: { title: string; link: string; desc: string; date: Date }[] = [];

  // 정정 내역 — 실제로 날짜가 있는 콘텐츠
  for (const c of CORRECTIONS) {
    items.push({
      title: `정정: ${c.target}`,
      link: `${SITE_URL}/corrections`,
      desc: `${c.before} → ${c.after}. ${c.reason}`,
      date: new Date(`${c.date}T09:00:00+09:00`),
    });
  }

  // 해설이 있는 본관 가운데 큰 것들
  const major = CLAN_ENTRIES.filter((c) => c.detail)
    .sort((a, b) => (b.detail?.population ?? 0) - (a.detail?.population ?? 0))
    .slice(0, 60);

  const base = new Date("2026-08-01T09:00:00+09:00").getTime();
  major.forEach((c, i) => {
    items.push({
      title: `${c.fullName} — 시조와 유래`,
      link: `${SITE_URL}${c.href}`,
      desc: `${c.fullName}의 시조는 ${c.detail?.founder}입니다.${c.region ? ` 본관 ${c.clanName}은 오늘날의 ${c.region.now}입니다.` : ""}`,
      // 항목마다 시각을 조금씩 달리해 순서를 고정한다
      date: new Date(base - i * 3600_000),
    });
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>뿌리찾기 — 성씨와 본관 찾기</title>
    <link>${SITE_URL}</link>
    <description>한국인의 성씨와 본관, 시조의 유래를 찾아보는 곳. 본관 하나를 페이지 하나로 정리했습니다.</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (it) => `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.link)}</link>
      <guid isPermaLink="true">${esc(it.link)}</guid>
      <description>${esc(it.desc)}</description>
      <pubDate>${it.date.toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
