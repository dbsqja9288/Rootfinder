"use client";

import { useState } from "react";

/** 눌러서 복사. 복사됐다는 걸 잠깐 보여준다. */
export default function CopyButton({
  value,
  label = "복사",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 클립보드 권한이 없는 환경(구형 브라우저·일부 인앱 브라우저) 대비
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        return;
      } finally {
        ta.remove();
      }
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      onClick={copy}
      aria-label={`${label}하기`}
      className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        done
          ? "border-accent bg-accent text-white dark:text-stone-900"
          : "border-line text-inksoft hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {done ? "복사됨" : label}
    </button>
  );
}
