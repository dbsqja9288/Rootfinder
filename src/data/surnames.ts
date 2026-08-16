import { CORE_SURNAMES } from "./surnames-core";
import { MORE_SURNAMES } from "./surnames-more";
import { RARE_SURNAMES } from "./surnames-rare";
import { EXTRA_CLANS } from "./clans";
import { stripSurnameSuffix } from "./surname-utils";
import type { Surname } from "./types";

export type { Surname, Clan } from "./types";
export { CLAN_DISCLAIMER } from "./clans";

/**
 * 상세 해설이 붙은 주요 본관(`clans`)과, 이름만 수록한 전체 본관 목록(`clans.ts`)을 합쳐
 * 하나의 성씨 데이터로 만든다. 중복은 제거하고 상세 본관을 앞에 둔다.
 */
function merge(list: Surname[]): Surname[] {
  return list.map((s) => {
    const detailed = s.clans.map((c) => stripSurnameSuffix(c.name, s.ko));
    const extra = (EXTRA_CLANS[s.id] ?? [])
      .map((n) => n.trim())
      .filter((n, i, arr) => arr.indexOf(n) === i) // 목록 내 중복 제거
      .filter((n) => !detailed.some((d) => d === n || d.startsWith(n) || n.startsWith(d)));

    return { ...s, allClans: [...detailed, ...extra] };
  });
}

export const SURNAMES: Surname[] = merge([
  ...CORE_SURNAMES,
  ...MORE_SURNAMES,
  ...RARE_SURNAMES,
]).sort((a, b) => a.rank - b.rank);

export const CHOSUNG_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

export const TOTAL_CLAN_COUNT = SURNAMES.reduce((a, s) => a + (s.allClans?.length ?? 0), 0);

export function getSurname(id: string) {
  return SURNAMES.find((s) => s.id === id);
}
