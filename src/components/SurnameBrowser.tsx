"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CHOSUNG_LIST } from "@/data/surnames";
import type { Surname } from "@/data/types";
import { search, type MatchReason } from "@/lib/search";
import { searchClans, type ClanEntry } from "@/lib/clan-index";

const REASON_STYLE: Record<MatchReason, string> = {
  성씨: "bg-accent/15 text-accent",
  한자: "bg-accent/15 text-accent",
  로마자: "bg-accent/15 text-accent",
  본관: "bg-celadon/15 text-celadon",
  시조: "bg-celadon/15 text-celadon",
  인물: "bg-celadon/15 text-celadon",
  본문: "bg-line/70 text-inksoft",
};

export default function SurnameBrowser({
  surnames,
  initialQuery = "",
}: {
  surnames: Surname[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [chosung, setChosung] = useState<string | null>(null);

  const searching = q.trim().length > 0;
  const clanHits = useMemo(() => (searching ? searchClans(q) : []), [q, searching]);
  const surnameHits = useMemo(() => search(surnames, q, chosung), [q, chosung, surnames]);
  const activeChosung = new Set(surnames.map((s) => s.chosung));

  // 초성 필터를 쓰는 중이면 본관 결과는 감춘다 (필터 대상이 성씨이므로)
  const showClans = searching && !chosung && clanHits.length > 0;

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-6 bg-bg/90 px-4 py-3 backdrop-blur">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="성씨 또는 본관으로 검색 (예: 해평윤씨, 김해, 최치원)"
            aria-label="성씨 검색"
            className="w-full rounded-xl border border-line bg-elev px-4 py-3 pr-10 outline-none transition placeholder:text-inksoft/60 focus:border-accent"
          />
          {searching && (
            <button
              onClick={() => setQ("")}
              aria-label="검색어 지우기"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-inksoft transition hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

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

      {/* 본관 결과 — 검색의 1순위 */}
      {showClans && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm text-inksoft">
            본관 <strong className="text-ink">{clanHits.length}</strong>건
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {clanHits.map((c) => (
              <li key={c.href}>
                <ClanCard clan={c} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 성씨 결과 */}
      <p className="mb-4 text-sm text-inksoft">
        {searching ? (
          <>
            성씨 <strong className="text-ink">{surnameHits.length}</strong>건
          </>
        ) : (
          <>
            전체 <strong className="text-ink">{surnameHits.length}</strong>개 성씨 · 인구순
          </>
        )}
      </p>

      {surnameHits.length === 0 && !showClans ? (
        <div className="card p-10 text-center text-inksoft">
          <p className="mb-1">검색 결과가 없습니다.</p>
          <p className="text-sm">
            성씨(김), 한자(金), 본관(해평윤씨), 시조 이름(최치원)으로 찾을 수 있어요.
            {chosung && " 초성 필터를 해제해보세요."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surnameHits.map(({ surname: s, reason, detail }) => (
            <li key={s.id}>
              <Link prefetch={false}
                href={`/surnames/${s.id}`}
                className="card block h-full p-5 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="serif flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent">
                    {s.hanja}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {s.ko}씨 <span className="text-xs text-inksoft">{s.reading}</span>
                    </div>
                    <div className="text-xs text-inksoft">
                      인구 {s.rank}위 · 본관 {s.allClans?.length ?? s.clans.length}개
                    </div>
                  </div>
                </div>

                {searching && (
                  <div className="mb-2 flex items-start gap-1.5">
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] ${REASON_STYLE[reason]}`}>
                      {reason} 일치
                    </span>
                    {detail && <span className="line-clamp-1 text-xs text-inksoft">{detail}</span>}
                  </div>
                )}

                <p className="line-clamp-2 text-sm leading-relaxed text-inksoft">{s.origin}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClanCard({ clan }: { clan: ClanEntry }) {
  return (
    <Link prefetch={false}
      href={clan.href}
      className="card flex h-full items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
    >
      <span className="serif mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-celadon/10 text-lg font-bold text-celadon">
        {clan.surnameHanja}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">
          {clan.fullName}
          {clan.detail && (
            <span className="ml-2 rounded bg-accent/10 px-1.5 py-0.5 text-[11px] text-accent">주요 본관</span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-xs text-inksoft">
          {clan.detail?.founder ? `시조 ${clan.detail.founder}` : "시조 기록 확인 필요"}
        </span>
        {clan.region && (
          <span className="mt-0.5 block truncate text-xs text-inksoft">📍 {clan.region.now}</span>
        )}
      </span>
    </Link>
  );
}
