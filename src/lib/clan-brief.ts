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

/** 자주 묻는 질문 한 쌍. */
export type ClanFaq = { q: string; a: string };

/**
 * 본관 페이지의 "자주 묻는 질문".
 *
 * ┌─ 왜 만드는가 ──────────────────────────────────────────────────┐
 * │ 1. 사람들이 검색창에 치는 말은 "김해 김씨"가 아니라              │
 * │    "김해김씨 시조가 누구야", "본관이 김해면 김해 사람이야?" 같은  │
 * │    **문장**이다. 그 문장을 페이지에 그대로 적어두면 걸린다.       │
 * │ 2. 해설이 없는 본관 506개는 본문이 짧다. 확인된 사실을 문답으로   │
 * │    다시 정리하면, 지어내지 않고도 페이지가 실제로 쓸모 있어진다. │
 * │ 3. 구글이 검색 결과에 문답을 접힌 채로 함께 보여줄 수 있다.       │
 * └────────────────────────────────────────────────────────────────┘
 *
 * ★ 지켜야 할 것 두 가지
 *   - 여기서 만든 답은 **화면에도 그대로 보여야 한다.** 구조화 데이터에만
 *     넣고 화면에 없으면 구글 정책 위반이다.
 *   - **모르는 것은 모른다고 답한다.** 시조 기록이 없는 본관에 그럴듯한
 *     시조를 지어 넣지 않는다. 이 사이트의 제1원칙이다.
 */
export function buildFaq(entry: ClanEntry, surname?: Surname): ClanFaq[] {
  const out: ClanFaq[] = [];
  const S = entry.surnameKo;
  const d = entry.detail;
  const sameRegion = sameRegionClans(entry);

  // 1) 이 본관이 지금 어디인가 — 가장 많이 검색되는 질문
  if (entry.region) {
    out.push({
      q: `${entry.clanName}은 지금 어디인가요?`,
      a:
        `${entry.clanName}은 오늘날의 ${entry.region.now}입니다.` +
        (entry.region.note ? ` ${entry.region.note}` : ""),
    });
  }

  // 2) 시조 — 있으면 밝히고, 없으면 없다고 말한다
  out.push(
    d?.founder
      ? {
          q: `${entry.compact}의 시조는 누구인가요?`,
          a:
            `${entry.fullName}의 시조는 ${d.founder}입니다.` +
            (d.note ? ` ${d.note}` : ""),
        }
      : {
          q: `${entry.compact}의 시조는 누구인가요?`,
          a:
            `${entry.fullName}의 시조는 이 사이트가 아직 확인하지 못했습니다. ` +
            `확인되지 않은 내용은 지어내지 않고 비워 둡니다. ` +
            `${S}씨 대종회나 ${entry.clanName} ${S}씨 종친회, ` +
            `국립중앙도서관·한국학중앙연구원 장서각의 족보 자료에서 확인하실 수 있습니다.`,
        },
  );

  // 3) 본관을 사는 곳으로 오해하는 사람이 아주 많다
  if (entry.region) {
    out.push({
      q: `본관이 ${entry.clanName}이면 ${entry.region.now}에 살아야 하나요?`,
      a:
        `아닙니다. 본관은 지금 사는 곳이 아니라 시조가 터를 잡은 곳을 가리킵니다. ` +
        `서울에 살아도, 외국에 살아도 본관이 ${entry.clanName}이면 ${entry.fullName}입니다. ` +
        `본관은 태어난 곳이나 주소와 관계없이 아버지에게서 그대로 물려받습니다.`,
    });
  }

  // 4) 같은 성씨 안에서 이 본관이 어디쯤인가
  if (surname) {
    const total = surname.allClans?.length ?? surname.clans.length;
    out.push({
      q: `${S}씨 본관은 몇 개인가요?`,
      a:
        `이 사이트가 확인한 ${S}(${entry.surnameHanja})씨 본관은 ${total}개입니다. ` +
        (surname.population
          ? `${S}씨는 전국에 약 ${surname.population.toLocaleString()}명으로 인구 ${surname.rank}위입니다. `
          : "") +
        `본관이 다르면 같은 ${S}씨라도 계통이 전혀 다른 가문이라 서로 남입니다.`,
    });
  }

  // 5) 이 본관만의 인구가 집계돼 있으면 밝힌다
  if (d?.population) {
    out.push({
      q: `${entry.compact}는 몇 명인가요?`,
      a:
        `${entry.fullName}는 약 ${d.population.toLocaleString()}명으로 집계됩니다. ` +
        `통계청 「2015 인구주택총조사 성씨·본관 집계」 기준입니다.`,
    });
  }

  // 6) 같은 고을에서 일어난 다른 성씨 — 헷갈리기 쉬운 대목
  if (sameRegion.length) {
    out.push({
      q: `${entry.clanName}을 본관으로 쓰는 다른 성씨도 있나요?`,
      a:
        `${sameRegion.length}개 있습니다` +
        `(${sameRegion.slice(0, 5).map((c) => c.fullName).join(", ")}` +
        `${sameRegion.length > 5 ? " 등" : ""}). ` +
        `한 고을에서 여러 성씨가 일어난 것이며, 본관이 같아도 성씨가 다르면 서로 다른 가문입니다.`,
    });
  }

  return out;
}
