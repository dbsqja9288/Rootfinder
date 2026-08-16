import { SURNAMES } from "@/data/surnames";
import { getRegion, type Region } from "@/data/regions";
import { stripSurnameSuffix } from "@/data/surname-utils";
import type { Clan, Surname } from "@/data/types";

/** 본관 하나를 성씨와 묶은 단위. 사이트의 최소 페이지 단위이기도 하다. */
export type ClanEntry = {
  slug: string; // URL 조각 (한글). 예: "해평"
  clanName: string; // 본관 이름. 예: "해평"
  surnameId: string; // 예: "yoon"
  surnameKo: string; // 예: "윤"
  surnameHanja: string; // 예: "尹"
  /** 표시용 전체 이름. 예: "해평 윤씨" */
  fullName: string;
  /** 공백 없는 형태. 검색용. 예: "해평윤씨" */
  compact: string;
  detail?: Clan; // 해설이 있는 주요 본관이면 채워진다
  region: Region | null;
  href: string;
};

function toSlug(clanName: string) {
  // "선산(일선)" → "선산"
  return clanName.replace(/\(.*\)$/, "").trim();
}

function build(): ClanEntry[] {
  const out: ClanEntry[] = [];
  const seen = new Set<string>();

  for (const s of SURNAMES) {
    const detailMap = new Map<string, Clan>();
    for (const c of s.clans) {
      detailMap.set(toSlug(stripSurnameSuffix(c.name, s.ko)), c);
    }

    for (const raw of s.allClans ?? []) {
      const slug = toSlug(raw);
      const key = `${s.id}/${slug}`;
      if (seen.has(key)) continue;
      seen.add(key);

      out.push({
        slug,
        clanName: raw,
        surnameId: s.id,
        surnameKo: s.ko,
        surnameHanja: s.hanja,
        fullName: `${raw} ${s.ko}씨`,
        compact: `${slug}${s.ko}씨`,
        detail: detailMap.get(slug),
        // 해설이 있는 본관은 한자를 넘겨 동음이의(광주 廣州/光州)를 정확히 가른다
        region: getRegion(raw, detailMap.get(slug)?.hanja),
        href: `/surnames/${s.id}/${encodeURIComponent(slug)}`,
      });
    }
  }

  return out;
}

export const CLAN_ENTRIES: ClanEntry[] = build();

export function getClan(surnameId: string, slug: string) {
  const decoded = decodeURIComponent(slug);
  return CLAN_ENTRIES.find((c) => c.surnameId === surnameId && c.slug === decoded) ?? null;
}

/** 같은 성씨의 다른 본관 */
export function siblingClans(entry: ClanEntry) {
  return CLAN_ENTRIES.filter((c) => c.surnameId === entry.surnameId && c.slug !== entry.slug);
}

/** 같은 본관 이름을 쓰는 다른 성씨 (예: 경주 → 김·이·최·정·손·배…) */
export function sameRegionClans(entry: ClanEntry) {
  return CLAN_ENTRIES.filter((c) => c.slug === entry.slug && c.surnameId !== entry.surnameId);
}

export function surnameOf(entry: ClanEntry): Surname | undefined {
  return SURNAMES.find((s) => s.id === entry.surnameId);
}

/**
 * "해평윤씨", "해평 윤씨", "해평윤", "해평" 모두 걸리도록 정규화해서 비교한다.
 */
export function normalize(q: string) {
  return q.replace(/\s+/g, "").toLowerCase();
}

export function searchClans(query: string, limit = 60): ClanEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = CLAN_ENTRIES.map((c) => {
    const compact = normalize(c.compact); // 해평윤씨
    const noSuffix = normalize(`${c.slug}${c.surnameKo}`); // 해평윤
    const clanOnly = normalize(c.slug); // 해평

    let score = 0;
    if (compact === q || noSuffix === q) score = 100; // 완전 일치
    else if (clanOnly === q) score = 80; // 본관명만 정확히
    else if (compact.startsWith(q) || noSuffix.startsWith(q)) score = 70;
    else if (clanOnly.startsWith(q)) score = 60;
    else if (compact.includes(q)) score = 40;
    else if (c.detail?.founder && normalize(c.detail.founder).includes(q)) score = 35;
    else if (c.region && normalize(c.region.now).includes(q)) score = 20;

    // 해설이 있는 주요 본관을 살짝 우대
    if (score > 0 && c.detail) score += 5;
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (b.c.detail?.population ?? 0) - (a.c.detail?.population ?? 0));

  return scored.slice(0, limit).map((x) => x.c);
}

export const TOTAL_CLANS = CLAN_ENTRIES.length;
