"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/surnames?q=${encodeURIComponent(q.trim())}`);
      }}
      className="flex w-full max-w-lg gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="성씨, 본관, 시조로 검색 (예: 김해, 최치원)"
        aria-label="성씨 검색"
        className="min-w-0 flex-1 rounded-xl border border-line bg-elev px-4 py-3 text-base outline-none transition placeholder:text-inksoft/60 focus:border-accent"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-accent px-5 py-3 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
      >
        검색
      </button>
    </form>
  );
}
