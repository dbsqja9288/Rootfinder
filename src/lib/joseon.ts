import { CLAN_ENTRIES, type ClanEntry } from "@/lib/clan-index";
import { getRecord } from "@/data/records";
import { ARCHETYPES, TIERS, type Mbti, type TierId } from "@/data/joseon";

/**
 * 본관에 남은 공개 기록의 양을 점수화한다.
 * '가문의 우열'이 아니라 '기록의 많고 적음'을 재는 값이다.
 */
export function scoreClan(surnameId: string, clanSlug: string): number {
  const r = getRecord(surnameId, clanSlug);
  let score = 0;

  // 옛 왕성(신라·가야·탐라) 계통 가산. 조선 왕실 종친은 등급에서 따로 처리한다.
  if (r.royal) score += 25;
  score += (r.jeongseung ?? 0) * 8;
  score += (r.queens ?? 0) * 10;
  score += Math.floor((r.munkwa ?? 0) / 10) * 3;

  const entry = CLAN_ENTRIES.find((c) => c.surnameId === surnameId && c.slug === clanSlug);
  const pop = entry?.detail?.population ?? 0;
  score += Math.min(8, Math.round((pop / 500000) * 8));

  return score;
}

/**
 * 등급 판정.
 * 종친은 조선 왕실(전주 이씨)에만 준다 — 조선시대에 신라·가야 왕성은 종친이 아니었다.
 */
export function tierOf(score: number, joseonRoyal: boolean): TierId {
  if (joseonRoyal) return "royal";
  if (score >= 45) return "sadaebu";
  if (score >= 18) return "hyangban";
  if (score >= 5) return "jungin";
  return "yangin";
}

const ALL_SCORES: number[] = CLAN_ENTRIES.map((c) => scoreClan(c.surnameId, c.slug)).sort((a, b) => b - a);
const MAX_SCORE = Math.max(...ALL_SCORES, 1);

export function percentileOf(score: number): number {
  const better = ALL_SCORES.filter((s) => s > score).length;
  const pct = ((better + 1) / ALL_SCORES.length) * 100;
  return Math.max(0.2, Math.round(pct * 10) / 10);
}

export type JoseonResult = {
  clan: ClanEntry;
  mbti: Mbti;
  score: number; // 0~100으로 환산한 표시용 점수
  rawScore: number;
  tier: (typeof TIERS)[TierId];
  percentile: number;
  rank: number;
  total: number;
  job: { name: string; hanja?: string; desc: string };
  trait: string;
  family: string;
  highlight?: string;
};

export function judge(clan: ClanEntry, mbti: Mbti): JoseonResult {
  const record = getRecord(clan.surnameId, clan.slug);
  const raw = scoreClan(clan.surnameId, clan.slug);
  const tierId = tierOf(raw, Boolean(record.joseonRoyal));
  const arch = ARCHETYPES[mbti];

  return {
    clan,
    mbti,
    score: Math.round((raw / MAX_SCORE) * 100),
    rawScore: raw,
    tier: TIERS[tierId],
    percentile: percentileOf(raw),
    rank: ALL_SCORES.filter((s) => s > raw).length + 1,
    total: ALL_SCORES.length,
    job: arch.jobs[tierId],
    trait: arch.trait,
    family: arch.family,
    highlight: record.highlight,
  };
}
