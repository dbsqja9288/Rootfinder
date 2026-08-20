import type { ClanEntry } from "./clan-index";
import { sameRegionClans, siblingClans } from "./clan-index";
import type { Surname } from "@/data/types";

/**
 * 해설이 없는 본관 페이지를 위한 자동 요약.
 *
 * 중요한 원칙: **없는 사실을 지어내지 않는다.**
 * 이미 확인된 자료(본관의 현재 지명, 같은 성씨의 다른 본관, 같은 고을의 다른 성씨,
 * 성씨 전체의 유래)만 조합해 문장을 만든다. 시조나 연대처럼 확인이 필요한 것은
 * 비워두고 "전하지 않는다"고 밝힌다.
 *
 * 이렇게 하면 이용자에게 실제로 쓸모 있는 정보가 생기고,
 * "빈 페이지"라는 인상과 그로 인한 문의도 줄어든다.
 */
export type ClanBrief = {
  /** 3~4문장짜리 요약. 문단 배열로 돌려준다. */
  paragraphs: string[];
  /** 지금 사이트가 모르는 것 */
  unknowns: string[];
};

export function buildBrief(entry: ClanEntry, surname?: Surname): ClanBrief {
  const paragraphs: string[] = [];
  const siblings = siblingClans(entry);
  const sameRegion = sameRegionClans(entry);
  const S = entry.surnameKo;

  // 1문단 — 이 본관이 무엇인지, 지금 어디인지
  if (entry.region) {
    paragraphs.push(
      `${entry.fullName}는 ${S}(${entry.surnameHanja})씨가 본관으로 삼는 ${entry.clanName} 고을에서 갈라져 나온 갈래입니다. ` +
        `${entry.clanName}은 오늘날의 ${entry.region.now}입니다.` +
        (entry.region.note ? ` ${entry.region.note}` : "")
    );
  } else {
    paragraphs.push(
      `${entry.fullName}는 ${S}(${entry.surnameHanja})씨가 본관으로 삼는 갈래 가운데 하나입니다.`
    );
  }

  // 2문단 — 성씨 전체 규모 속에서의 위치
  if (surname) {
    const total = surname.allClans?.length ?? 0;
    const pop = surname.population
      ? `${S}씨는 전국에 약 ${surname.population.toLocaleString()}명이 있고, `
      : "";
    paragraphs.push(
      `${pop}이 사이트가 확인한 ${S}씨 본관은 ${total}개입니다. ` +
        `본관이 다르면 같은 ${S}씨라도 계통이 전혀 다른 가문입니다. ` +
        `한 고을에서 여러 성씨가 일어나기도 하고, 한 성씨가 여러 고을로 퍼지기도 했기 때문입니다.`
    );
  }

  // 3문단 — 주변 관계 (같은 성씨의 큰 본관, 같은 고을의 다른 성씨)
  const majorSiblings = siblings.filter((c) => c.detail).slice(0, 3);
  const parts: string[] = [];
  if (majorSiblings.length) {
    parts.push(
      `같은 ${S}씨 가운데 기록이 많이 남은 본관으로는 ` +
        `${majorSiblings.map((c) => c.fullName).join(", ")}가 있습니다.`
    );
  }
  if (sameRegion.length) {
    parts.push(
      `${entry.clanName}을 본관으로 쓰는 다른 성씨도 ${sameRegion.length}개 있습니다` +
        `(${sameRegion.slice(0, 4).map((c) => c.fullName).join(", ")}${sameRegion.length > 4 ? " 등" : ""}). ` +
        `본관이 같아도 성씨가 다르면 서로 다른 가문입니다.`
    );
  }
  if (parts.length) paragraphs.push(parts.join(" "));

  // 이 사이트가 모르는 것 — 솔직하게 남긴다
  const unknowns: string[] = ["시조와 세계(世系)"];
  if (!entry.detail?.population) unknowns.push("이 본관만의 인구");
  unknowns.push("분관 시기와 경위");

  return { paragraphs, unknowns };
}
