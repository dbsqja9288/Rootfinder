/**
 * 가문 운세 리포트.
 *
 * ┌─ 무엇이 계산이고 무엇이 해석인가 ────────────────────────────┐
 * │ 계산: 사주 여덟 글자와 오행 분포. 규칙이 정해져 있어 누가      │
 * │       해도 같은 값이 나온다. (src/lib/saju.ts)                │
 * │ 사실: 시조·본관 지역. 사이트가 이미 검증해 둔 자료를 그대로.   │
 * │ 해석: 이 달의 흐름·조심할 것·할 일. 전통 해석의 방향을 따르되  │
 * │       사람이 쓴 문장이고, 미래를 맞히지 않는다.               │
 * │                                                              │
 * │ 셋을 화면에서도 섞지 않는다. 어디까지가 계산이고 어디부터가    │
 * │ 해석인지 읽는 사람이 구분할 수 있어야 신뢰가 생긴다.          │
 * └────────────────────────────────────────────────────────────┘
 */

import type { ClanEntry } from "@/lib/clan-index";
import {
  DAYGAN_NOTE,
  OHAENG_ADVICE,
  buildSaju,
  CHEONGAN,
  CHEONGAN_HANJA,
  type Ohaeng,
  type Saju,
} from "@/lib/saju";

export type Gender = "남" | "여";

export type FortuneInput = {
  clan: ClanEntry;
  gen: number;
  gender: Gender;
  /** 양력 생년월일 */
  birth: { y: number; m: number; d: number };
  /** 0~23. 모르면 null */
  hour: number | null;
};

/** 문자열을 숫자로. 같은 입력이면 언제나 같은 값이 나온다(FNV-1a). */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], seed: number, salt: number): T {
  return arr[Math.abs(seed + salt * 7919) % arr.length];
}

/**
 * 오행별 이 달의 흐름.
 * 그 달에 힘이 실리는 오행(가장 많은 오행)에 따라 결이 달라진다.
 */
const FLOW: Record<Ohaeng, readonly string[]> = {
  목: [
    "벌이는 쪽으로 기운이 섭니다. 다만 심어둔 것을 세는 일에는 약한 때라, 새로 시작한 만큼 정리도 같이 하십시오.",
    "제안과 기회가 늘어납니다. 다 받으면 아무것도 남지 않으니 둘만 고르십시오.",
  ],
  화: [
    "드러나는 달입니다. 사람 앞에 서는 일이 잘 풀리는 대신, 말이 앞서기도 쉽습니다.",
    "속도가 붙습니다. 빨리 가는 것보다 어디로 가는지가 중요한 시기입니다.",
  ],
  토: [
    "쌓이는 달입니다. 티가 안 나서 답답하겠지만, 지금 버틴 것이 다음 판의 바닥이 됩니다.",
    "자리를 옮기고 싶어지는 때입니다. 옮기더라도 지금 있는 곳을 정리한 뒤에 하십시오.",
  ],
  금: [
    "끊고 정리하는 달입니다. 오래 붙들고 있던 것 하나를 놓으면 나머지가 가벼워집니다.",
    "판단이 날카로워집니다. 그만큼 가까운 사람에게 날이 서기 쉬우니 조심하십시오.",
  ],
  수: [
    "흐르는 달입니다. 새 사람, 새 정보가 들어오는 때라 익숙한 자리에만 있으면 손해입니다.",
    "생각이 많아집니다. 정리되지 않은 채로 결정하지 말고 한 주만 미뤄 보십시오.",
  ],
};

const CAUTION = [
  "확실해 보이는 이야기일수록 한 번 더 확인하십시오.",
  "약속은 지킬 수 있는 것만 하십시오. 말이 앞서기 쉬운 때입니다.",
  "몸을 먼저 축내는 방식으로 일하지 마십시오. 이번 달은 잠이 성과보다 중요합니다.",
  "밖에서 받은 것을 안에서 풀지 않도록 조심하십시오.",
  "나눠도 되는 일을 혼자 붙들고 있지 않은지 보십시오.",
  "남의 속도를 기준으로 삼지 마십시오. 비교가 판단을 흐립니다.",
] as const;

const ACTION = [
  "미뤄둔 연락 한 통을 먼저 하십시오.",
  "이번 달 안에 한 가지를 끝까지 마무리하십시오. 새로 벌이는 것보다 낫습니다.",
  "돈 나가는 항목을 훑고 하나를 끊으십시오.",
  "안 쓰는 물건을 정리하십시오. 자리를 비우면 판단이 빨라집니다.",
  "가족 어른께 옛날 이야기를 여쭤보십시오. 생각보다 큰 것이 나옵니다.",
  "하루 30분을 아무에게도 쓰지 않는 시간으로 떼어두십시오.",
] as const;

export type FortuneReport = {
  /** 이 리포트가 유효한 달 */
  period: string;
  saju: Saju;
  /** 일간 한 글자. 예: "신(辛)" */
  dayGanLabel: string;
  dayGanImage: string;
  dayGanNature: string;
  /** 큰 제목 */
  headline: string;
  flow: string;
  caution: string;
  action: string;
  /** 부족한 오행 조언. 없으면 빈 배열 */
  lacking: { ohaeng: Ohaeng; advice: string }[];
  /** 선조에게서 온 것. 검증된 사실이 없으면 null */
  lineage: string | null;
  /** 사실이 없어서 비워둔 항목 */
  unknowns: string[];
};

export function buildFortune(input: FortuneInput, now: Date): FortuneReport {
  const { clan, gen, gender, birth, hour } = input;
  const period = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  const saju = buildSaju(birth.y, birth.m, birth.d, hour);

  const seed = hash(
    `${clan.surnameId}/${clan.slug}/${gen}/${gender}/${saju.day.label}/${saju.hour?.label ?? "-"}/${period}`,
  );

  const unknowns: string[] = [];
  let lineage: string | null = null;

  if (clan.detail?.founder && clan.detail.founder !== "미상") {
    lineage =
      `${clan.fullName}의 시조는 ${clan.detail.founder}입니다.` +
      (clan.detail.note ? ` ${clan.detail.note}` : "");
  } else if (clan.region) {
    lineage = `${clan.fullName}의 본관 ${clan.clanName}은(는) 오늘날 ${clan.region.now}입니다.`;
    unknowns.push("시조 기록이 확인되지 않아 선조 항목을 본관 지역으로 대신했습니다.");
  } else {
    unknowns.push("시조와 본관 지역 모두 확인된 기록이 없어 선조 항목을 비웠습니다.");
  }

  if (hour === null) {
    unknowns.push("태어난 시각을 넣지 않으셔서 시주(時柱)를 세우지 않았습니다. 여덟 글자 중 여섯 글자로 본 결과입니다.");
  }
  if (saju.nearBoundary) {
    unknowns.push(
      "절기가 바뀌는 날 근처에 태어나셨습니다. 절기가 드는 정확한 시각은 해마다 달라서, 연주·월주가 만세력과 하루 다를 수 있습니다.",
    );
  }

  const note = DAYGAN_NOTE[saju.dayGan];

  return {
    period,
    saju,
    dayGanLabel: `${CHEONGAN[saju.dayGan]}(${CHEONGAN_HANJA[saju.dayGan]})`,
    dayGanImage: note.image,
    dayGanNature: note.nature,
    headline: `${saju.strongest}의 기운이 도는 달`,
    flow: pick(FLOW[saju.strongest], seed, 1),
    caution: pick(CAUTION, seed, 2),
    action: pick(ACTION, seed, 3),
    lacking: saju.missing.map((o) => ({ ohaeng: o, advice: OHAENG_ADVICE[o] })),
    lineage,
    unknowns,
  };
}
