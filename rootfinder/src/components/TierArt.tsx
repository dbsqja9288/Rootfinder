import type { TierId } from "@/data/joseon";

/** 등급별 일러스트. 외부 이미지 없이 SVG로 그려 공유 카드에도 그대로 재사용한다. */
export default function TierArt({ tier, size = 120 }: { tier: TierId; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 120 120", fill: "none" as const };

  if (tier === "royal") {
    return (
      <svg {...common} role="img" aria-label="종친">
        <circle cx="60" cy="60" r="56" fill="#b8860b" opacity=".10" />
        <circle cx="60" cy="60" r="40" stroke="#b8860b" strokeWidth="2" />
        <circle cx="60" cy="60" r="33" stroke="#b8860b" strokeWidth="1" opacity=".5" />
        <path
          d="M60 40c9 0 15 6 15 13 0 5-3 8-7 8-3 0-5-2-5-4 0-3 3-3 3-5s-2-4-6-4c-6 0-11 5-11 12 0 8 7 14 16 14"
          stroke="#b8860b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="47" cy="52" r="2.5" fill="#b8860b" />
        <path d="M42 84h36M46 90h28" stroke="#b8860b" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (tier === "sadaebu") {
    return (
      <svg {...common} role="img" aria-label="사대부">
        <circle cx="60" cy="60" r="56" fill="#7c2d12" opacity=".08" />
        <path d="M36 62c0-14 11-24 24-24s24 10 24 24" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="32" y="62" width="56" height="9" rx="4.5" fill="#7c2d12" />
        <path
          d="M32 66h-9c-4 0-6 4-3 7l7 5M88 66h9c4 0 6 4 3 7l-7 5"
          stroke="#7c2d12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="55" y="78" width="10" height="28" rx="5" fill="#7c2d12" opacity=".55" />
      </svg>
    );
  }

  if (tier === "hyangban") {
    return (
      <svg {...common} role="img" aria-label="향반">
        <circle cx="60" cy="60" r="56" fill="#4c7a6d" opacity=".10" />
        <path d="M22 54 60 32l38 22" stroke="#4c7a6d" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M30 54v34h60V54" stroke="#4c7a6d" strokeWidth="3" />
        <path d="M24 88h72" stroke="#4c7a6d" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="45" y="64" width="30" height="24" rx="2" stroke="#4c7a6d" strokeWidth="2.5" />
        <path d="M60 64v24" stroke="#4c7a6d" strokeWidth="2" />
      </svg>
    );
  }

  if (tier === "jungin") {
    return (
      <svg {...common} role="img" aria-label="중인">
        <circle cx="60" cy="60" r="56" fill="#3f6212" opacity=".09" />
        <path
          d="M44 30c-3 0-5 2-5 5 0 12 4 20 4 30v22c0 3 2 5 5 5s5-2 5-5V65c0-10 4-18 4-30 0-3-2-5-5-5z"
          stroke="#3f6212"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M39 62h18" stroke="#3f6212" strokeWidth="2.5" />
        <ellipse cx="80" cy="76" rx="16" ry="10" stroke="#3f6212" strokeWidth="3" />
        <path d="M70 70c4-3 16-3 20 0" stroke="#3f6212" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg {...common} role="img" aria-label="양인">
      <circle cx="60" cy="60" r="56" fill="#57534e" opacity=".09" />
      <path d="M60 34c-8 6-12 14-12 22s5 14 12 14 12-6 12-14-4-16-12-22z" stroke="#57534e" strokeWidth="3" />
      <path d="M60 44v42" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 86c8-6 18-6 26 0M66 86c8-6 18-6 26 0" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 96h80" stroke="#57534e" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
