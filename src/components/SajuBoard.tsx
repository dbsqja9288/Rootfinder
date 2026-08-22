"use client";

import {
  CHEONGAN,
  CHEONGAN_HANJA,
  JIJI,
  JIJI_HANJA,
  OHAENG_COLOR,
  type Ohaeng,
  type Pillar,
  type Saju,
} from "@/lib/saju";

/**
 * 명식(命式) 판.
 *
 * 글로 늘어놓는 대신 만세력이 보여주는 것과 같은 모양의 표로 그린다.
 * 사주를 본 적 있는 사람은 이 배치를 바로 알아보고, 처음 보는 사람도
 * 여덟 글자가 어디서 왔는지 한눈에 안다. 설명이 필요 없는 편이 낫다.
 */
export default function SajuBoard({ saju }: { saju: Saju }) {
  const cols: { label: string; p: Pillar | null }[] = [
    { label: "시주", p: saju.hour },
    { label: "일주", p: saju.day },
    { label: "월주", p: saju.month },
    { label: "연주", p: saju.year },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[280px] grid-cols-4 gap-2">
        {cols.map(({ label, p }) => (
          <div key={label} className="text-center">
            <p className="mb-1.5 text-xs text-inksoft">{label}</p>

            {p ? (
              <>
                <Cell
                  hanja={CHEONGAN_HANJA[p.gan]}
                  ko={CHEONGAN[p.gan]}
                  ohaeng={p.ganOhaeng}
                  emphasis={label === "일주"}
                />
                <Cell hanja={JIJI_HANJA[p.ji]} ko={JIJI[p.ji]} ohaeng={p.jiOhaeng} />
              </>
            ) : (
              <div className="flex h-[120px] items-center justify-center rounded-xl border border-dashed border-line px-1 text-xs leading-relaxed text-inksoft">
                시각
                <br />
                모름
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-inksoft">
        가운데 <strong className="text-ink">일주의 윗 글자</strong>가 사주에서 &lsquo;나&rsquo;를 뜻합니다
      </p>
    </div>
  );
}

function Cell({
  hanja,
  ko,
  ohaeng,
  emphasis,
}: {
  hanja: string;
  ko: string;
  ohaeng: Ohaeng;
  emphasis?: boolean;
}) {
  const color = OHAENG_COLOR[ohaeng];
  return (
    <div
      className={`mb-1.5 rounded-xl border py-2.5 ${emphasis ? "border-2" : "border"}`}
      style={{ borderColor: color, background: `${color}12` }}
    >
      <p className="serif text-2xl font-bold leading-none" style={{ color }}>
        {hanja}
      </p>
      <p className="mt-1 text-[11px] text-inksoft">
        {ko} · {ohaeng}
      </p>
    </div>
  );
}

/** 오행이 몇 개씩인지 막대로. 많고 적음이 한눈에 보여야 조언이 설득력을 갖는다. */
export function OhaengBars({ counts }: { counts: Record<Ohaeng, number> }) {
  const order: Ohaeng[] = ["목", "화", "토", "금", "수"];
  const max = Math.max(1, ...order.map((o) => counts[o]));

  return (
    <div className="space-y-2">
      {order.map((o) => {
        const n = counts[o];
        return (
          <div key={o} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-sm" style={{ color: OHAENG_COLOR[o] }}>
              {o}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-line/50">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(n / max) * 100}%`, background: OHAENG_COLOR[o] }}
              />
            </div>
            <span className={`w-8 shrink-0 text-right text-sm ${n === 0 ? "text-inksoft" : "font-medium"}`}>
              {n}개
            </span>
          </div>
        );
      })}
    </div>
  );
}
