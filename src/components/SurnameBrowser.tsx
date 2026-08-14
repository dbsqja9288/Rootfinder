"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CHOSUNG_LIST, type Surname } from "@/data/surnames";

export default function SurnameBrowser({
  surnames,
  initialQuery = "",
}: {
  surnames: Surname[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [chosung, setChosung] = useState<string | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return surnames.filter((s) => {
      if (chosung && s.chosung !== chosung) return false;
      if (!query) return true;
      const hay = [
        s.ko,
        s.hanja,
        s.reading,
        s.origin,
        ...s.clans.map((c) => `${c.name} ${c.hanja ?? ""} ${c.founder}`),
        ...(s.figures ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q, chosung, surnames]);

  const activeChosung = new Set(surnames.map((s) => s.chosung));

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-6 bg-bg/90 px-4 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="성씨, 본관, 시조, 인물로 검색"
          aria-label="성씨 검색"
          className="w-full rounded-xl border border-line bg-elev px-4 py-3 outline-none transition placeholder:text-inksoft/60 focus:border-accent"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setChosung(null)}
            className={`rounded-lg px-3 py-1 text-sm transition ${
              chosung === null ? "bg-accent text-white dark:text-stone-900" : "border border-line hover:border-accent"
            }`}
          >
            전체
          </button>
          {CHOSUNG_LIST.filter((c) => activeChosung.has(c)).map((c) => (
            <button
              key={c}
              onClick={() => setChosung(chosung === c ? null : c)}
              className={`size-8 rounded-lg text-sm transition ${
                chosung === c ? "bg-accent text-white dark:text-stone-900" : "border border-line hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-inksoft">
        검색 결과 <strong className="text-ink">{results.length}</strong>건
      </p>

      {results.length === 0 ? (
        <div className="card p-10 text-center text-inksoft">
          <p className="mb-1">검색 결과가 없습니다.</p>
          <p className="text-sm">다른 검색어를 입력하거나 초성 필터를 해제해보세요.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <li key={s.id}>
              <Link
                href={`/surnames/${s.id}`}
                className="card block h-full p-5 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="serif flex size-11 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
                    {s.hanja}
                  </span>
                  <div>
                    <div className="font-medium">
                      {s.ko}씨 <span className="text-xs text-inksoft">{s.reading}</span>
                    </div>
                    <div className="text-xs text-inksoft">
                      인구 {s.rank}위 · {s.population.toLocaleString()}명
                    </div>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-inksoft">{s.origin}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.clans.slice(0, 3).map((c) => (
                    <span key={c.name} className="rounded-md bg-line/50 px-2 py-0.5 text-xs text-inksoft">
                      {c.name}
                    </span>
                  ))}
                  {s.clans.length > 3 && (
                    <span className="px-1 text-xs text-inksoft">+{s.clans.length - 3}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
