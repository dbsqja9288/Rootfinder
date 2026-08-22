/**
 * 사주(四柱) 세우기.
 *
 * ┌─ 왜 이걸 직접 계산하는가 ────────────────────────────────────┐
 * │ 운세라는 것에 신뢰가 붙으려면, 적어도 **입력에서 결과가 나오는 │
 * │ 과정이 실재해야 한다.** 무작위로 뽑은 문장은 몇 번만 눌러보면  │
 * │ 들통난다.                                                    │
 * │                                                              │
 * │ 사주팔자는 생년월일시를 육십갑자로 옮긴 것이다. 규칙이 명확히  │
 * │ 정해져 있어서 누가 계산해도 같은 답이 나온다. 여기서는 그      │
 * │ 규칙을 그대로 구현한다. 해석이 아니라 계산 부분은 검증 가능하다.│
 * └────────────────────────────────────────────────────────────┘
 *
 * 근거
 *  · 일주: 율리우스일(JDN)로 육십갑자를 정한다.
 *    S = 1 + ((JDN - 11) mod 60), S=1이 갑자.
 *    (2019-01-27 정오 JDN 2458511 = 갑자일 — 이 값으로 맞춘다)
 *  · 시주: 오자둔(五子遁). 일간에 따라 자시의 천간이 정해진다.
 *  · 연주: 입춘에 해가 바뀐다. 설날이 아니다.
 *  · 월주: 절기에 달이 바뀐다. 오호둔(五虎遁)으로 월간을 정한다.
 *
 * ┌─ 한계를 숨기지 않는다 ──────────────────────────────────────┐
 * │ 입춘과 절기가 드는 **정확한 시각**은 해마다 다르다(2/3~2/5).  │
 * │ 여기서는 평년 기준 날짜로 근사한다. 그래서 절기 전환일 근처에  │
 * │ 태어난 경우 연주·월주가 만세력과 하루 다를 수 있다.           │
 * │ 화면에도 이 사실을 그대로 적는다. 일주·시주는 근사가 없다.     │
 * └────────────────────────────────────────────────────────────┘
 */

export const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const CHEONGAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;
export const JIJI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
/** 지지에 딸린 띠. 사람들이 가장 먼저 알아보는 정보라 같이 내보낸다. */
export const JIJI_ANIMAL = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;

export type Ohaeng = "목" | "화" | "토" | "금" | "수";

export const OHAENG_COLOR: Record<Ohaeng, string> = {
  목: "#4d7c0f",
  화: "#b91c1c",
  토: "#a16207",
  금: "#57534e",
  수: "#1d4ed8",
};

/** 천간의 오행. 갑을=목, 병정=화, 무기=토, 경신=금, 임계=수 */
const GAN_OHAENG: Ohaeng[] = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
/** 지지의 오행 */
const JI_OHAENG: Ohaeng[] = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

export type Pillar = {
  /** 천간 인덱스 0~9 */
  gan: number;
  /** 지지 인덱스 0~11 */
  ji: number;
  /** 표시용. 예: "갑자(甲子)" */
  label: string;
  ganOhaeng: Ohaeng;
  jiOhaeng: Ohaeng;
};

export type Saju = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  /** 태어난 시각을 모르면 시주는 세우지 않는다. 억지로 채우지 않는다. */
  hour: Pillar | null;
  /** 일간 = 사주에서 '나'를 가리키는 글자 */
  dayGan: number;
  /** 오행이 각각 몇 개인지 */
  counts: Record<Ohaeng, number>;
  /** 가장 많은 오행 */
  strongest: Ohaeng;
  /** 하나도 없는 오행들 */
  missing: Ohaeng[];
  /** 띠 */
  animal: string;
  /** 절기 근처라 하루 차이가 날 수 있는 경우 true */
  nearBoundary: boolean;
};

function pillar(gan: number, ji: number): Pillar {
  const g = ((gan % 10) + 10) % 10;
  const j = ((ji % 12) + 12) % 12;
  return {
    gan: g,
    ji: j,
    label: `${CHEONGAN[g]}${JIJI[j]}(${CHEONGAN_HANJA[g]}${JIJI_HANJA[j]})`,
    ganOhaeng: GAN_OHAENG[g],
    jiOhaeng: JI_OHAENG[j],
  };
}

/** 그레고리력 날짜의 율리우스일. 정오 기준 정수값. */
export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

/**
 * 절기가 드는 날(근사). 각 달의 시작일이다.
 * 배열 순서는 1월부터. 값은 '그 달의 며칠부터 새 절기 달이 시작되는가'.
 *   1월 6일 소한 → 축월,  2월 4일 입춘 → 인월, ...
 */
const TERM_DAY = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
/** 위 절기가 시작시키는 지지(월지). 1월=축(1), 2월=인(2) … 12월=자(0) */
const TERM_BRANCH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

/** 절기 전환일에서 하루 이내면 만세력과 갈릴 수 있다. */
function isNearTerm(m: number, d: number): boolean {
  return Math.abs(d - TERM_DAY[m - 1]) <= 1;
}

export function buildSaju(
  y: number,
  m: number,
  d: number,
  /** 0~23. 모르면 null */
  hour: number | null,
): Saju {
  // ── 연주: 입춘(2월 4일 근사) 전이면 아직 지난해다
  const beforeIpchun = m < 2 || (m === 2 && d < TERM_DAY[1]);
  const sajuYear = beforeIpchun ? y - 1 : y;
  // 서기 4년이 갑자년이다. (4 → 0)
  const yearGan = (((sajuYear - 4) % 10) + 10) % 10;
  const yearJi = (((sajuYear - 4) % 12) + 12) % 12;
  const yearP = pillar(yearGan, yearJi);

  // ── 월주: 절기로 월지를 정하고, 오호둔으로 월간을 정한다
  const beforeTerm = d < TERM_DAY[m - 1];
  // 절기 전이면 지난달의 절기 구간에 속한다
  const termMonth = beforeTerm ? (m === 1 ? 12 : m - 1) : m;
  const monthJi = TERM_BRANCH[termMonth - 1];
  // 오호둔: 갑기년→병인월, 을경년→무인월, 병신년→경인월, 정임년→임인월, 무계년→갑인월
  const inMonthGan = ((yearGan % 5) * 2 + 2) % 10;
  // 인(2)에서 몇 칸 떨어져 있는지
  const stepsFromIn = (monthJi - 2 + 12) % 12;
  const monthP = pillar(inMonthGan + stepsFromIn, monthJi);

  // ── 일주: 근사 없음
  const J = jdn(y, m, d);
  const s = (((J - 11) % 60) + 60) % 60;
  const dayP = pillar(s % 10, s % 12);

  // ── 시주: 오자둔. 자시(23~01)는 지지 0.
  let hourP: Pillar | null = null;
  if (hour !== null) {
    const hj = Math.floor(((hour + 1) % 24) / 2);
    const jasiGan = (dayP.gan % 5) * 2;
    hourP = pillar(jasiGan + hj, hj);
  }

  // ── 오행 세기
  const counts: Record<Ohaeng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const list = [yearP, monthP, dayP, ...(hourP ? [hourP] : [])];
  for (const p of list) {
    counts[p.ganOhaeng]++;
    counts[p.jiOhaeng]++;
  }

  const entries = Object.entries(counts) as [Ohaeng, number][];
  const strongest = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const missing = entries.filter(([, n]) => n === 0).map(([k]) => k);

  return {
    year: yearP,
    month: monthP,
    day: dayP,
    hour: hourP,
    dayGan: dayP.gan,
    counts,
    strongest,
    missing,
    animal: JIJI_ANIMAL[yearP.ji],
    nearBoundary: isNearTerm(m, d) || (m === 2 && Math.abs(d - TERM_DAY[1]) <= 1),
  };
}

/**
 * 일간 해설.
 *
 * 명리에서 일간은 사주 여덟 글자 가운데 '나'를 가리키는 글자다.
 * 아래 설명은 각 천간에 전통적으로 붙는 물상(物象) 비유를 옮긴 것이며,
 * 유파에 따라 표현이 다를 수 있다. 없는 말을 지어 붙이지는 않았다.
 */
export const DAYGAN_NOTE: { image: string; nature: string }[] = [
  { image: "큰 나무", nature: "위로 곧게 자라는 성질입니다. 방향이 정해지면 잘 꺾이지 않고, 앞장서는 자리에 놓이는 일이 많습니다." },
  { image: "덩굴과 화초", nature: "휘어지되 부러지지 않습니다. 상황에 맞춰 자리를 잡는 데 능하고, 사람 사이를 부드럽게 잇습니다." },
  { image: "태양", nature: "숨기지 못하는 성질입니다. 마음이 밖으로 드러나고, 주변을 데우는 대신 스스로 빨리 지칩니다." },
  { image: "등불", nature: "가까운 것을 밝힙니다. 넓게 퍼지지는 않아도 곁에 있는 사람에게 오래 남는 온기를 줍니다." },
  { image: "넓은 땅", nature: "받아내는 성질입니다. 무거운 것을 얹어도 티를 내지 않아, 사람들이 기대러 옵니다." },
  { image: "밭의 흙", nature: "기르는 성질입니다. 티 나지 않게 챙기고, 자기 몫보다 남의 결실을 먼저 봅니다." },
  { image: "무쇠와 바위", nature: "끊고 맺음이 분명합니다. 옳고 그름을 넘기지 못해 부딪히기도 하지만 신뢰를 얻습니다." },
  { image: "보석과 칼날", nature: "다듬을수록 빛나는 성질입니다. 예민하고 정교하며, 어설픈 것을 견디지 못합니다." },
  { image: "큰 물", nature: "흘러가며 형태를 바꿉니다. 담는 그릇에 따라 달라지고, 깊이를 쉽게 보여주지 않습니다." },
  { image: "이슬과 시냇물", nature: "스며드는 성질입니다. 조용히 파고들어 오래 남고, 생각이 멈추는 법이 없습니다." },
];

/** 부족한 오행에 붙이는 조언. 전통적으로 말하는 보완 방향이다. */
export const OHAENG_ADVICE: Record<Ohaeng, string> = {
  목: "새로 시작하는 힘이 약합니다. 벌여둔 것을 정리하기보다 하나라도 새로 심는 쪽이 도움이 됩니다.",
  화: "드러내는 힘이 약합니다. 잘한 일을 안에 두지 말고 말로 꺼내 보십시오.",
  토: "버티는 힘이 약합니다. 판을 자주 바꾸기보다 한자리에서 시간을 쌓는 편이 낫습니다.",
  금: "끊는 힘이 약합니다. 하지 않을 일을 정하는 것이 할 일을 정하는 것보다 급합니다.",
  수: "흐르는 힘이 약합니다. 익숙한 자리에서 벗어나 새 사람과 새 정보를 만나야 합니다.",
};
