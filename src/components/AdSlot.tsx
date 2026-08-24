"use client";

import { useEffect, useRef } from "react";

/**
 * 광고 자리.
 *
 * 환경변수가 없으면 **아무것도 그리지 않는다.** 그래서 값을 넣기 전까지는 사이트에 변화가 없고,
 * 승인이 난 뒤 Vercel에 값만 넣으면 그 자리에 광고가 나온다. 코드를 다시 고칠 필요가 없다.
 *
 *   NEXT_PUBLIC_ADSENSE_CLIENT  = ca-pub-0000000000000000
 *   NEXT_PUBLIC_ADSENSE_SLOT    = 1234567890
 *   NEXT_PUBLIC_ADFIT_UNIT      = DAN-xxxxxxxxxxxx   (1번 자리)
 *   NEXT_PUBLIC_ADFIT_UNIT_2    = DAN-xxxxxxxxxxxx   (2번 자리)
 *   NEXT_PUBLIC_ADFIT_UNIT_3    = DAN-xxxxxxxxxxxx   (3번 자리)
 *
 * ┌─ 애드핏에서 꼭 지켜야 하는 것 ────────────────────────────┐
 * │ · 한 페이지에 광고 4개까지. 넘으면 심사에서 반려된다.        │
 * │ · **같은 페이지에 같은 광고단위 ID를 두 번 쓰면 안 된다.**   │
 * │   두 번째는 안 나온다. 자리마다 다른 ID가 필요하다.          │
 * │ · 버튼 근처에 두지 않는다(실수 클릭 유도 금지).              │
 * └────────────────────────────────────────────────────┘
 *
 * 애드센스와 애드핏 둘 다 켜져 있으면 애드센스를 먼저 쓴다(단가가 높다).
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

/** 자리 번호(1·2·3)로 광고단위를 고른다. 없는 번호면 광고를 그리지 않는다. */
const ADFIT_UNITS: Record<number, string | undefined> = {
  1: process.env.NEXT_PUBLIC_ADFIT_UNIT,
  2: process.env.NEXT_PUBLIC_ADFIT_UNIT_2,
  3: process.env.NEXT_PUBLIC_ADFIT_UNIT_3,
  4: process.env.NEXT_PUBLIC_ADFIT_UNIT_4,
};

/**
 * 애드핏은 **한 매체 안에 같은 크기의 광고단위를 두 번 만들 수 없다.**
 * ("해당 매체에 중복된 광고단위가 존재합니다" 에러가 이것이다.)
 * 그래서 자리마다 크기가 달라야 하고, 크기도 자리별로 따로 잡는다.
 *
 * 만든 광고단위의 크기와 여기 값이 다르면 광고가 아예 안 나온다. 반드시 맞출 것.
 *   1번(하단)  = 300x250  ← 기본값
 *   2번(본문 중간) = 320x100  ← 기본값(실제로 만든 단위 크기와 같다).
 *   3번(최상단 띠)  = 320x50   ← 기본값
 *   4번(큰 사각)    = 320x480  ← 기본값. 네 자리 모두 크기가 달라야 만들 수 있다.
 *                    다른 크기로 만들었으면 환경변수로 바꾼다.
 *     NEXT_PUBLIC_ADFIT_SIZE_2 = "336x280" 처럼 넣으면 그 값이 우선한다.
 */
function size(raw: string | undefined, fallback: [string, string]): [string, string] {
  const m = raw?.trim().match(/^(\d+)\s*[xX*]\s*(\d+)$/);
  return m ? [m[1], m[2]] : fallback;
}

const ADFIT_SIZES: Record<number, [string, string]> = {
  1: size(
    process.env.NEXT_PUBLIC_ADFIT_SIZE,
    [process.env.NEXT_PUBLIC_ADFIT_WIDTH ?? "300", process.env.NEXT_PUBLIC_ADFIT_HEIGHT ?? "250"],
  ),
  2: size(process.env.NEXT_PUBLIC_ADFIT_SIZE_2, ["320", "100"]),
  3: size(process.env.NEXT_PUBLIC_ADFIT_SIZE_3, ["320", "50"]),
  4: size(process.env.NEXT_PUBLIC_ADFIT_SIZE_4, ["320", "480"]),
};

export const ADS_ENABLED = Boolean((ADSENSE_CLIENT && ADSENSE_SLOT) || ADFIT_UNITS[1]);

/**
 * @param slot 같은 페이지에 광고를 두 개 이상 넣을 때 자리마다 다른 번호를 준다.
 *             애드핏은 한 페이지 4개가 상한이라 1~4번까지만 있다.
 *             페이지가 다르면 같은 번호를 써도 된다(중복은 한 페이지 안에서만 문제).
 */
export default function AdSlot({ className = "", slot = 1 }: { className?: string; slot?: 1 | 2 | 3 | 4 }) {
  if (ADSENSE_CLIENT && ADSENSE_SLOT) {
    return <AdSense className={className} />;
  }
  const unit = ADFIT_UNITS[slot];
  if (unit) {
    const [w, h] = ADFIT_SIZES[slot] ?? ADFIT_SIZES[1];
    return <AdFit className={className} unit={unit} w={w} h={h} />;
  }
  return null;
}

function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <aside className={`my-10 ${className}`} aria-label="광고">
      <p className="mb-1.5 text-center text-[11px] tracking-wide text-inksoft opacity-60">광고</p>
      {children}
    </aside>
  );
}

function AdSense({ className }: { className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    // 리액트가 같은 컴포넌트를 두 번 마운트해도 광고 요청은 한 번만 나가야 한다
    if (pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle ?? []).push({});
    } catch {
      // 광고 차단기가 막은 경우 — 사이트 동작에는 영향이 없다
    }
  }, []);

  return (
    <Frame className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Frame>
  );
}

function AdFit({ className, unit, w, h }: { className?: string; unit: string; w: string; h: string }) {
  const box = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !box.current) return;
    loaded.current = true;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", w);
    ins.setAttribute("data-ad-height", h);

    const s = document.createElement("script");
    s.async = true;
    // 카카오가 현재 안내하는 주소. 예전 t1.daumcdn.net도 동작하지만
    // 콘솔이 주는 스니펫과 맞춰두는 편이 나중에 바뀔 때 덜 헷갈린다.
    s.src = "//t1.kakaocdn.net/kas/static/ba.min.js";

    box.current.append(ins, s);
  }, [unit, w, h]);

  return (
    <Frame className={className}>
      <div ref={box} className="flex justify-center" />
    </Frame>
  );
}
