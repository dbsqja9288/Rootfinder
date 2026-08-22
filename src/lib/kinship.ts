/**
 * 촌수(寸數) 추정.
 *
 * ┌─ 이 파일이 지키는 선 ────────────────────────────────────────┐
 * │ 족보 없이 두 사람의 정확한 촌수를 계산하는 방법은 없다.        │
 * │ 파(派)가 어디서 갈렸는지를 알아야 하는데 그 정보가 없기 때문.  │
 * │ 그래서 여기서는 **단정하지 않고 상한선만** 말한다.             │
 * │   "최대 58촌" = 아무리 멀어도 58촌, 실제로는 더 가까울 수 있다 │
 * │ 이 표현은 수학적으로 참이다. 지어낸 값이 아니다.               │
 * └────────────────────────────────────────────────────────────┘
 *
 * 촌수 세는 법: 나 → 공통 조상까지 올라간 걸음 수 + 공통 조상 → 상대까지 내려간 걸음 수.
 * 시조를 1세로 보면 N대손은 시조에서 (N-1) 걸음 아래다.
 * 따라서 두 사람의 공통 조상이 시조뿐이라면 촌수는 (a-1) + (b-1) = a + b - 2.
 * 파가 시조보다 아래에서 갈렸다면 그만큼 줄어든다. 그래서 이 값이 **상한**이다.
 */

/** 코드 안에서 항목을 가르는 글자. 사람이 입력할 수 없는 제어문자라 별명과 충돌하지 않는다. */
const SEP = "\u001f";

export type Person = {
  /** 성씨 id. 예: "kim" */
  surnameId: string;
  /** 본관 slug. 예: "김해" */
  slug: string;
  /** 표시용. 예: "김해 김씨" */
  fullName: string;
  /** 시조로부터 몇 세(대)인지 */
  gen: number;
  /** 별명. 없으면 빈 문자열 */
  nick?: string;
};

export type Kinship =
  | { kind: "stranger"; reason: "surname" | "clan"; headline: string; detail: string }
  | {
      kind: "kin";
      /** 촌수 상한 */
      maxChon: number;
      /** 세대 차이 */
      genGap: number;
      /** 세대 차이를 사람 말로. 예: "두 세대 위 — 할아버지뻘" */
      standing: string;
      /** 공통 조상(시조)까지 몇 세대를 거슬러 올라가야 하는지 */
      gensToAncestor: number;
      headline: string;
      detail: string;
      /** 민법상 혼인이 금지되는 8촌 이내인지 */
      withinEight: boolean;
    };

export const GEN_MIN = 1;
export const GEN_MAX = 60;

export function clampGen(n: number): number {
  if (!Number.isFinite(n)) return 30;
  return Math.min(GEN_MAX, Math.max(GEN_MIN, Math.round(n)));
}

/**
 * 세대 차이를 호칭으로 옮긴다.
 * 항렬이 같으면 나이와 상관없이 형제뻘이고, 한 세대 위면 아저씨뻘이다.
 * 실제 문중에서 쓰는 말 그대로 적었다.
 */
function standingOf(gap: number, iAmYounger: boolean): string {
  if (gap === 0) return "항렬이 같다 — 형·아우뻘";
  const dir = iAmYounger ? "위" : "아래";
  const namesUp = ["", "아저씨뻘(숙질)", "할아버지뻘", "증조뻘", "고조뻘"];
  const namesDown = ["", "조카뻘(숙질)", "손자뻘", "증손뻘", "현손뻘"];
  const table = iAmYounger ? namesUp : namesDown;
  if (gap < table.length) return `${gap}세대 ${dir} — 상대가 나보다 ${table[gap]}`;
  return `${gap}세대 ${dir} — 항렬이 아주 멀다`;
}

export function judgeKin(me: Person, other: Person): Kinship {
  if (me.surnameId !== other.surnameId) {
    return {
      kind: "stranger",
      reason: "surname",
      headline: "혈연 관계 없음",
      detail:
        "성씨가 다릅니다. 족보상으로는 이어지는 곳이 없어요. 촌수를 따질 수 있는 사이가 아닙니다.",
    };
  }

  if (me.slug !== other.slug) {
    return {
      kind: "stranger",
      reason: "clan",
      headline: "같은 성씨, 다른 집안",
      detail:
        `${me.fullName}와 ${other.fullName}. 성씨는 같지만 본관이 다릅니다. ` +
        "본관이 다르면 시조가 아예 다른 사람이라 족보가 만나지 않습니다. 남남이라고 보시면 됩니다.",
    };
  }

  const maxChon = me.gen + other.gen - 2;
  const genGap = Math.abs(me.gen - other.gen);
  // 시조를 1세로 본다. 시조가 실제로 몇 년 전 사람인지는 본관마다 천차만별이라
  // (김해 김씨 시조 김수로왕은 서기 42년) 연도로 환산하지 않고 세대 수로만 말한다.
  const gensToAncestor = Math.max(me.gen, other.gen) - 1;

  return {
    kind: "kin",
    maxChon,
    genGap,
    standing: standingOf(genGap, other.gen < me.gen),
    gensToAncestor,
    withinEight: maxChon <= 8,
    headline: maxChon === 0 ? "같은 자리" : `최대 ${maxChon}촌`,
    detail:
      `같은 ${me.fullName}입니다. 족보가 만나는 지점이 적어도 시조까지는 올라가므로 ` +
      `아무리 멀어도 ${maxChon}촌 안쪽입니다. 두 집안의 파(派)가 시조보다 아래에서 갈렸다면 실제로는 더 가깝습니다.`,
  };
}

/**
 * 공유 링크에 실을 코드.
 *
 * 서버에 아무것도 저장하지 않는다. 사람 정보가 통째로 주소에 들어 있어서
 * 링크만 있으면 어디서든 열리고, 데이터베이스도 개인정보 보관도 필요 없다.
 */
export function encodePerson(p: Person): string {
  const raw = [p.surnameId, p.slug, String(p.gen), p.nick ?? ""].join(SEP);
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePerson(code: string): Omit<Person, "fullName"> | null {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const [surnameId, slug, gen, nick] = new TextDecoder().decode(bytes).split(SEP);
    if (!surnameId || !slug) return null;
    const g = clampGen(Number(gen));
    return { surnameId, slug, gen: g, nick: (nick ?? "").slice(0, 12) };
  } catch {
    return null;
  }
}
