/**
 * 내가 비교해 본 사람들 기록.
 *
 * ┌─ 왜 브라우저에 저장하는가 ──────────────────────────────────┐
 * │ 서버도 데이터베이스도 두지 않는다. 남의 본관과 생년월일을     │
 * │ 서버에 쌓아두는 순간 그것은 개인정보 처리가 되고, 지켜야 할   │
 * │ 것이 열 배로 늘어난다. 이 기능에는 그럴 이유가 없다.          │
 * │                                                              │
 * │ 기록은 각자의 브라우저에만 남는다. 다른 사람은 볼 수 없고,    │
 * │ 브라우저 데이터를 지우면 같이 사라진다. 화면에도 그렇게 적는다.│
 * └────────────────────────────────────────────────────────────┘
 */

const KEY = "rootfinder.kin.v1";
const LIMIT = 30;

export type KinLogEntry = {
  /** 상대 이름(없으면 빈 문자열) */
  nick: string;
  /** 예: "김해 김씨" */
  fullName: string;
  gen: number;
  /** 혈연이 아니면 null */
  maxChon: number | null;
  genGap: number | null;
  /** 저장 시각 */
  at: number;
};

function read(): KinLogEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as KinLogEntry[]) : [];
  } catch {
    // 사생활 보호 모드나 저장소 차단. 기능만 조용히 꺼지면 된다.
    return [];
  }
}

function write(list: KinLogEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, LIMIT)));
  } catch {
    /* 저장 못 해도 화면은 그대로 동작해야 한다 */
  }
}

/** 같은 사람을 여러 번 비교하면 최신 것 하나만 남긴다. */
export function saveKin(entry: KinLogEntry): KinLogEntry[] {
  const key = (e: KinLogEntry) => `${e.fullName}/${e.gen}/${e.nick}`;
  const next = [entry, ...read().filter((e) => key(e) !== key(entry))];
  write(next);
  return next;
}

export function loadKin(): KinLogEntry[] {
  return read();
}

export function clearKin() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}

/** 가까운 순. 혈연이 아닌 사람은 뒤로 보낸다. */
export function ranked(list: KinLogEntry[]): KinLogEntry[] {
  return [...list].sort((a, b) => {
    if (a.maxChon === null && b.maxChon === null) return b.at - a.at;
    if (a.maxChon === null) return 1;
    if (b.maxChon === null) return -1;
    return a.maxChon - b.maxChon || b.at - a.at;
  });
}
