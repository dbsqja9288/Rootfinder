import type { Surname } from "@/data/types";

export type MatchReason = "성씨" | "한자" | "로마자" | "본관" | "시조" | "인물" | "본문";

export type SearchHit = {
  surname: Surname;
  score: number;
  reason: MatchReason;
  detail?: string; // 매칭된 구체적인 값 (예: "김해 김씨")
};

/**
 * 점수가 높을수록 위에 노출된다.
 * 성씨 자체가 일치하는 결과를, 본문에 우연히 언급된 결과보다 항상 먼저 보여주기 위한 가중치.
 */
const WEIGHT: Record<MatchReason, number> = {
  성씨: 100,
  한자: 90,
  로마자: 80,
  본관: 60,
  시조: 50,
  인물: 40,
  본문: 10,
};

export function scoreSurname(s: Surname, rawQuery: string): SearchHit | null {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return { surname: s, score: 0, reason: "성씨" };

  const hits: { reason: MatchReason; detail?: string; bonus: number }[] = [];

  // 성씨 한글 — 완전 일치에 추가 가산점
  if (s.ko.toLowerCase().includes(q)) {
    hits.push({ reason: "성씨", bonus: s.ko === rawQuery.trim() ? 20 : 0 });
  }
  if (s.hanja.toLowerCase().includes(q)) {
    hits.push({ reason: "한자", detail: s.hanja, bonus: 0 });
  }
  if (s.reading.toLowerCase().includes(q)) {
    hits.push({ reason: "로마자", detail: s.reading, bonus: 0 });
  }

  const clanHit = s.clans.find(
    (c) => c.name.toLowerCase().includes(q) || (c.hanja ?? "").toLowerCase().includes(q)
  );
  if (clanHit) {
    hits.push({ reason: "본관", detail: clanHit.name, bonus: 0 });
  } else {
    // 해설이 없는 본관까지 검색 대상에 포함 (예: 윤씨 35개 본관 전체)
    const extra = s.allClans?.find((n) => n.toLowerCase().includes(q));
    if (extra) hits.push({ reason: "본관", detail: `${extra} ${s.ko}씨`, bonus: 0 });
  }

  const founderHit = s.clans.find((c) => c.founder.toLowerCase().includes(q));
  if (founderHit) hits.push({ reason: "시조", detail: `${founderHit.name} 시조 ${founderHit.founder}`, bonus: 0 });

  const figureHit = s.figures?.find((f) => f.toLowerCase().includes(q));
  if (figureHit) hits.push({ reason: "인물", detail: figureHit, bonus: 0 });

  if (s.origin.toLowerCase().includes(q)) {
    hits.push({ reason: "본문", detail: excerpt(s.origin, rawQuery.trim()), bonus: 0 });
  }

  if (hits.length === 0) return null;

  const best = hits.reduce((a, b) => (WEIGHT[a.reason] + a.bonus >= WEIGHT[b.reason] + b.bonus ? a : b));
  // 여러 항목에 걸쳐 걸리면 소폭 가산
  const score = WEIGHT[best.reason] + best.bonus + (hits.length - 1) * 2;

  return { surname: s, score, reason: best.reason, detail: best.detail };
}

export function search(surnames: Surname[], query: string, chosung: string | null): SearchHit[] {
  const pool = chosung ? surnames.filter((s) => s.chosung === chosung) : surnames;
  const q = query.trim();

  if (!q) {
    return pool.map((s) => ({ surname: s, score: 0, reason: "성씨" as const }));
  }

  return pool
    .map((s) => scoreSurname(s, q))
    .filter((h): h is SearchHit => h !== null)
    .sort((a, b) => b.score - a.score || a.surname.rank - b.surname.rank);
}

/** 검색어 주변 문맥을 잘라낸다 */
function excerpt(text: string, q: string, radius = 22) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text.slice(0, 50);
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + q.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}
