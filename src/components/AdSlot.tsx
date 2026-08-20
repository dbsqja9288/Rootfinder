"use client";

import { useEffect, useRef } from "react";

/**
 * 광고 자리.
 *
 * 환경변수가 없으면 **아무것도 그리지 않는다.** 그래서 지금은 사이트에 변화가 없고,
 * 승인이 난 뒤 Vercel에 값만 넣으면 그 자리에 광고가 나온다. 코드를 다시 고칠 필요가 없다.
 *
 *   NEXT_PUBLIC_ADSENSE_CLIENT  = ca-pub-0000000000000000
 *   NEXT_PUBLIC_ADSENSE_SLOT    = 1234567890
 *   NEXT_PUBLIC_ADFIT_UNIT      = DAN-xxxxxxxxxxxx
 *
 * 애드센스와 애드핏 둘 다 켜져 있으면 애드센스를 먼저 쓴다(단가가 높다).
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
const ADFIT_UNIT = process.env.NEXT_PUBLIC_ADFIT_UNIT;

/**
 * 애드핏은 광고단위마다 크기가 고정이다. 만든 단위의 크기와 여기가 다르면 광고가 안 나온다.
 * 기본값 300x250은 본문 안에 넣기에 무난하고 모바일·PC 양쪽에서 잘 보이는 크기다.
 */
const ADFIT_W = process.env.NEXT_PUBLIC_ADFIT_WIDTH ?? "300";
const ADFIT_H = process.env.NEXT_PUBLIC_ADFIT_HEIGHT ?? "250";

export const ADS_ENABLED = Boolean((ADSENSE_CLIENT && ADSENSE_SLOT) || ADFIT_UNIT);

export default function AdSlot({ className = "" }: { className?: string }) {
  if (ADSENSE_CLIENT && ADSENSE_SLOT) {
    return <AdSense className={className} />;
  }
  if (ADFIT_UNIT) {
    return <AdFit className={className} />;
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

function AdFit({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !box.current) return;
    loaded.current = true;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", ADFIT_UNIT!);
    ins.setAttribute("data-ad-width", ADFIT_W);
    ins.setAttribute("data-ad-height", ADFIT_H);

    const s = document.createElement("script");
    s.async = true;
    // 카카오가 현재 안내하는 주소. 예전 t1.daumcdn.net도 동작하지만
    // 콘솔이 주는 스니펫과 맞춰두는 편이 나중에 바뀔 때 덜 헷갈린다.
    s.src = "//t1.kakaocdn.net/kas/static/ba.min.js";

    box.current.append(ins, s);
  }, []);

  return (
    <Frame className={className}>
      <div ref={box} className="flex justify-center" />
    </Frame>
  );
}
