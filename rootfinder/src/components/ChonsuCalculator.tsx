"use client";

import { useMemo, useState } from "react";

type Step = { key: string; label: string; kind: "up" | "down" | "sibling" | "spouse"; gender: "M" | "F" };

const STEPS: Step[] = [
  { key: "father", label: "아버지", kind: "up", gender: "M" },
  { key: "mother", label: "어머니", kind: "up", gender: "F" },
  { key: "brother", label: "형·오빠·남동생", kind: "sibling", gender: "M" },
  { key: "sister", label: "누나·언니·여동생", kind: "sibling", gender: "F" },
  { key: "son", label: "아들", kind: "down", gender: "M" },
  { key: "daughter", label: "딸", kind: "down", gender: "F" },
  { key: "husband", label: "남편", kind: "spouse", gender: "M" },
  { key: "wife", label: "아내", kind: "spouse", gender: "F" },
];

/** 위로 u대, 아래로 d대 이동한 위치의 호칭 (남/여) */
const NAMES: Record<string, [string, string]> = {
  "0,0": ["나", "나"],
  "1,0": ["아버지", "어머니"],
  "2,0": ["할아버지", "할머니"],
  "3,0": ["증조할아버지", "증조할머니"],
  "4,0": ["고조할아버지", "고조할머니"],
  "0,1": ["아들", "딸"],
  "0,2": ["손자", "손녀"],
  "0,3": ["증손자", "증손녀"],
  "0,4": ["고손자(현손)", "고손녀"],
  "1,1": ["형제(형·남동생)", "자매(누나·여동생)"],
  "2,1": ["삼촌(백부·숙부)", "고모"],
  "3,1": ["종조부(큰할아버지)", "대고모(고모할머니)"],
  "4,1": ["재종조부", "재종대고모"],
  "1,2": ["조카", "조카딸"],
  "2,2": ["사촌 형제", "사촌 자매"],
  "3,2": ["오촌 당숙(아저씨)", "오촌 당고모"],
  "4,2": ["칠촌 재당숙", "칠촌 재당고모"],
  "1,3": ["종손(조카의 아들)", "종손녀"],
  "2,3": ["오촌 조카(당질)", "오촌 조카딸"],
  "3,3": ["육촌 형제(재종)", "육촌 자매"],
  "4,3": ["칠촌 조카(재당질)", "칠촌 조카딸"],
  "0,0x": ["나", "나"],
  "4,4": ["팔촌 형제(삼종)", "팔촌 자매"],
  "3,4": ["칠촌 조카", "칠촌 조카딸"],
  "2,4": ["칠촌 손자뻘", "칠촌 손녀뻘"],
  "1,4": ["증종손", "증종손녀"],
  "4,0x": ["", ""],
};

export default function ChonsuCalculator() {
  const [path, setPath] = useState<Step[]>([]);

  const result = useMemo(() => {
    let u = 0;
    let d = 0;
    let spouseAtEnd = false;
    let maternal = false;
    let sawFirstUp = false;
    let gender: "M" | "F" = "M";

    for (const s of path) {
      if (s.kind === "up" || s.kind === "sibling") {
        // 형제는 '부모로 올라갔다 자식으로 내려오는' 것과 같다
        if (d > 0) d -= 1;
        else u += 1;
        if (!sawFirstUp) {
          sawFirstUp = true;
          if (s.kind === "up" && s.gender === "F") maternal = true;
        }
        if (s.kind === "sibling") d += 1;
      } else if (s.kind === "down") {
        d += 1;
      }
      spouseAtEnd = s.kind === "spouse";
      gender = s.gender;
    }

    const chon = u + d;
    const key = `${u},${d}`;
    const pair = NAMES[key];
    const base = pair ? pair[gender === "M" ? 0 : 1] : `${chon}촌`;

    return { u, d, chon, base, spouseAtEnd, maternal, gender };
  }, [path]);

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center gap-1.5 text-sm">
        <span className="rounded-lg bg-accent px-2.5 py-1 text-white dark:text-stone-900">나</span>
        {path.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-inksoft">의</span>
            <span className="rounded-lg border border-line px-2.5 py-1">{s.label}</span>
          </span>
        ))}
        {path.length === 0 && <span className="text-inksoft">아래에서 관계를 눌러 이어보세요</span>}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((s) => (
          <button
            key={s.key}
            onClick={() => setPath((p) => [...p, s])}
            disabled={path.length >= 8}
            className="rounded-lg border border-line px-3 py-2 text-sm transition hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-2 text-sm">
        <button
          onClick={() => setPath((p) => p.slice(0, -1))}
          disabled={path.length === 0}
          className="rounded-lg border border-line px-3 py-1.5 transition hover:border-accent disabled:opacity-40"
        >
          ← 한 단계 취소
        </button>
        <button
          onClick={() => setPath([])}
          disabled={path.length === 0}
          className="rounded-lg border border-line px-3 py-1.5 text-inksoft transition hover:border-accent disabled:opacity-40"
        >
          처음부터
        </button>
      </div>

      {path.length > 0 && (
        <div className="rounded-xl bg-accent/5 p-5">
          <p className="text-sm text-inksoft">이 사람은 나와</p>
          <p className="serif mt-1 text-3xl font-bold text-accent">
            {result.spouseAtEnd ? "무촌 (배우자)" : `${result.chon}촌`}
          </p>
          <p className="mt-2 text-lg">
            호칭:{" "}
            <strong>
              {result.maternal && result.chon >= 3 && "외" }
              {result.base}
              {result.spouseAtEnd && "의 배우자"}
            </strong>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-inksoft">
            공통 조상까지 위로 {result.u}대, 다시 아래로 {result.d}대 → {result.u} + {result.d} ={" "}
            {result.chon}촌. 부부 사이는 촌수를 세지 않습니다(무촌).
            {result.maternal && " 어머니 쪽으로 이어진 관계라 '외(外)'가 붙습니다."}
          </p>
        </div>
      )}
    </div>
  );
}
