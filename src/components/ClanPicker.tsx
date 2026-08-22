"use client";

import { useMemo, useState } from "react";
import { searchClans, type ClanEntry } from "@/lib/clan-index";

/**
 * 본관 고르는 입력창.
 *
 * 조선시대 퀴즈에 있던 것과 같은 동작을 떼어냈다.
 * 여러 화면에서 같은 방식으로 본관을 고르게 하려고 공용으로 만들었다.
 */
export default function ClanPicker({
  value,
  onChange,
  label,
  placeholder = "예: 해평윤씨, 김해, 전주 이씨",
}: {
  value: ClanEntry | null;
  onChange: (c: ClanEntry | null) => void;
  label?: string;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const candidates = useMemo(() => (q.trim().length >= 1 ? searchClans(q, 6) : []), [q]);

  if (value) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-lg bg-accent/10 px-4 py-2 font-medium text-accent">{value.fullName}</span>
        <button
          onClick={() => {
            onChange(null);
            setQ("");
          }}
          className="text-sm text-inksoft underline transition hover:text-accent"
        >
          다시 고르기
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? "본관 검색"}
        className="w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
      />
      {candidates.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {candidates.map((c) => (
            <li key={c.href}>
              <button
                onClick={() => onChange(c)}
                className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2 text-left text-sm transition hover:border-accent hover:text-accent"
              >
                <span className="serif font-bold text-accent">{c.surnameHanja}</span>
                <span className="flex-1">{c.fullName}</span>
                {c.region && <span className="text-xs text-inksoft">{c.region.now}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
