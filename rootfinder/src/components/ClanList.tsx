"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const COLLAPSED = 24;

export default function ClanList({
  clans,
  detailed,
  surnameKo,
  surnameId,
}: {
  clans: string[];
  detailed: string[];
  surnameKo: string;
  surnameId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("");

  const detailedSet = useMemo(
    () => new Set(detailed.map((d) => d.replace(/\s*[가-힣]씨$/, "").trim())),
    [detailed]
  );

  const filtered = useMemo(
    () => (filter.trim() ? clans.filter((c) => c.includes(filter.trim())) : clans),
    [clans, filter]
  );

  const visible = expanded || filter.trim() ? filtered : filtered.slice(0, COLLAPSED);
  const hidden = filtered.length - visible.length;

  return (
    <div>
      {clans.length > COLLAPSED && (
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`본관 이름으로 좁히기 (예: 파평)`}
          aria-label="본관 목록 내 검색"
          className="mb-3 w-full max-w-xs rounded-lg border border-line bg-elev px-3 py-2 text-sm outline-none focus:border-accent"
        />
      )}

      <ul className="flex flex-wrap gap-1.5">
        {visible.map((c) => (
          <li key={c}>
            <Link
              href={`/surnames/${surnameId}/${encodeURIComponent(c.replace(/\(.*\)$/, "").trim())}`}
              className={`inline-block rounded-lg px-2.5 py-1 text-sm transition hover:border-accent hover:text-accent ${
                detailedSet.has(c)
                  ? "border border-accent/40 bg-accent/5 font-medium text-accent"
                  : "border border-line text-inksoft"
              }`}
              title={`${c} ${surnameKo}씨 페이지로 이동`}
            >
              {c}
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-sm text-inksoft">&ldquo;{filter}&rdquo;에 해당하는 본관이 없습니다.</p>
      )}

      {hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 rounded-lg border border-line px-3 py-1.5 text-sm text-inksoft transition hover:border-accent hover:text-accent"
        >
          나머지 {hidden}개 더 보기
        </button>
      )}
      {expanded && !filter.trim() && clans.length > COLLAPSED && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-3 rounded-lg border border-line px-3 py-1.5 text-sm text-inksoft transition hover:border-accent"
        >
          접기
        </button>
      )}
    </div>
  );
}
