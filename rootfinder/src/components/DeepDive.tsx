"use client";

import { useState } from "react";

export default function DeepDive({ surname, clans }: { surname: string; clans: string[] }) {
  const [clan, setClan] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask() {
    setLoading(true);
    setError("");
    setText("");
    try {
      const res = await fetch("/api/deep-dive", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ surname, clan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "요청에 실패했습니다.");
      setText(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap gap-2">
        <select
          value={clan}
          onChange={(e) => setClan(e.target.value)}
          aria-label="본관 선택"
          className="min-w-40 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="">성씨 전체에 대해</option>
          {clans.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:text-stone-900"
        >
          {loading ? "찾아보는 중…" : "해설 보기"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {text && (
        <div className="mt-4">
          <span className="mb-2 inline-block rounded-md bg-line/60 px-2 py-0.5 text-[11px] text-inksoft">
            AI 생성 — 사실 확인 필요
          </span>
          <div className="space-y-3 leading-loose text-ink/90">
            {text
              .split("\n")
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-inksoft">
            이 문단은 AI가 생성한 것으로, 위의 본관·시조 데이터와 달리 검증되지 않았습니다. 족보에 기록할 내용이라면
            반드시 해당 종친회나 원문 족보로 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}
