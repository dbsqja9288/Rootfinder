"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MBTI_LIST, type Mbti } from "@/data/joseon";
import { searchClans, type ClanEntry } from "@/lib/clan-index";
import { judge } from "@/lib/joseon";
import TierArt from "./TierArt";

export default function JoseonQuiz({ siteUrl }: { siteUrl: string }) {
  const [q, setQ] = useState("");
  const [clan, setClan] = useState<ClanEntry | null>(null);
  const [mbti, setMbti] = useState<Mbti | null>(null);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const candidates = useMemo(() => (q.trim() ? searchClans(q, 8) : []), [q]);
  const result = useMemo(() => (clan && mbti ? judge(clan, mbti) : null), [clan, mbti]);

  async function saveImage() {
    if (!result) return;
    setSaving(true);
    try {
      const png = await renderCard(result);
      const a = document.createElement("a");
      a.href = png;
      a.download = `${result.clan.fullName}_${result.mbti}_조선시대.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  }

  function shareOnX() {
    if (!result) return;
    const rankLine =
      result.rawScore > 0
        ? `${result.tier.name}(${result.tier.hanja}) · 기록이 남은 본관 중 상위 ${result.percentile}%`
        : `${result.tier.name}(${result.tier.hanja})`;
    const text = `조선시대였다면 나는 「${result.job.name}」\n\n${result.clan.fullName} · ${result.mbti}\n${rankLine}\n\n내 본관도 찾아보기 👇`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl + "/joseon")}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="space-y-6">
      {/* 1단계 — 본관 */}
      <section className="card p-5">
        <h2 className="serif mb-1 font-bold">
          <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs text-white dark:text-stone-900">
            1
          </span>
          우리 집 본관은?
        </h2>
        <p className="mb-3 text-sm text-inksoft">
          모르시면 부모님께 여쭤보세요. &ldquo;해평윤씨&rdquo;처럼 붙여 써도 찾아집니다.
        </p>

        {clan ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-accent/10 px-4 py-2 font-medium text-accent">{clan.fullName}</span>
            <button
              onClick={() => {
                setClan(null);
                setQ("");
              }}
              className="text-sm text-inksoft underline transition hover:text-accent"
            >
              다시 고르기
            </button>
          </div>
        ) : (
          <>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예: 해평윤씨, 김해, 전주 이씨"
              aria-label="본관 검색"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
            />
            {candidates.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {candidates.map((c) => (
                  <li key={c.href}>
                    <button
                      onClick={() => setClan(c)}
                      className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2 text-left text-sm transition hover:border-accent hover:text-accent"
                    >
                      <span className="serif font-bold text-accent">{c.surnameHanja}</span>
                      <span className="flex-1">{c.fullName}</span>
                      {c.region && <span className="text-xs text-inksoft">{c.region.now}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {/* 2단계 — MBTI */}
      <section className={`card p-5 transition ${clan ? "" : "pointer-events-none opacity-40"}`}>
        <h2 className="serif mb-1 font-bold">
          <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs text-white dark:text-stone-900">
            2
          </span>
          MBTI를 골라주세요
        </h2>
        <p className="mb-3 text-sm text-inksoft">기질에 따라 조선시대 직업이 달라집니다.</p>
        <div className="grid grid-cols-4 gap-2">
          {MBTI_LIST.map((m) => (
            <button
              key={m}
              onClick={() => setMbti(m)}
              className={`rounded-lg py-2.5 text-sm font-medium transition ${
                mbti === m
                  ? "bg-accent text-white dark:text-stone-900"
                  : "border border-line text-inksoft hover:border-accent hover:text-accent"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* 결과 */}
      {result && (
        <>
          <div ref={cardRef} className="card fade-up overflow-hidden p-8 text-center">
            <div className="flex justify-center">
              <TierArt tier={result.tier.id} size={140} />
            </div>

            <p className="mt-3 text-sm text-inksoft">
              {result.clan.fullName} · {result.mbti} · {result.trait}
            </p>

            <p className="mt-1 text-xs tracking-wide text-inksoft">조선시대였다면 당신은</p>
            <h2 className="serif mt-1 text-4xl font-bold" style={{ color: result.tier.color }}>
              {result.job.name}
            </h2>
            {result.job.hanja && <p className="mt-1 text-sm text-inksoft">{result.job.hanja}</p>}

            <p className="mx-auto mt-4 max-w-md leading-loose text-ink/90">{result.job.desc}</p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line p-5">
              <p className="text-sm text-inksoft">가문 등급</p>
              <p className="serif mt-1 text-2xl font-bold" style={{ color: result.tier.color }}>
                {result.tier.name} <span className="text-base font-normal">{result.tier.hanja}</span>
              </p>
              <p className="mt-1 text-sm text-inksoft">{result.tier.tagline}</p>

              {result.rawScore > 0 ? (
                <>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(4, 100 - result.percentile)}%`,
                        background: `linear-gradient(90deg, #b45309, ${result.tier.color})`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm">
                    기록이 남은 본관 중{" "}
                    <strong style={{ color: result.tier.color }}>상위 {result.percentile}%</strong>
                    <span className="text-inksoft"> ({result.total.toLocaleString()}개 중 {result.rank}위)</span>
                  </p>
                  <p className="mt-1 text-xs text-inksoft">기록 점수 {result.rawScore}점</p>
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-inksoft">
                  조선시대 관직 기록이 따로 전하지 않는 본관입니다. 조선 인구의 대다수가 여기 속했고,{" "}
                  <strong className="text-ink">오늘의 우리는 대부분 그분들의 후손</strong>입니다.
                </p>
              )}

              {result.highlight && (
                <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-inksoft">
                  {result.highlight}
                </p>
              )}
            </div>

            <p className="mt-6 text-xs text-inksoft">뿌리찾기 · 재미로 보는 콘텐츠입니다</p>
          </div>

          {/* 공유 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={shareOnX}
              className="flex-1 rounded-xl bg-ink px-4 py-3 font-medium text-bg transition hover:opacity-90"
            >
              𝕏 에 공유하기
            </button>
            <button
              onClick={saveImage}
              disabled={saving}
              className="flex-1 rounded-xl bg-accent px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:text-stone-900"
            >
              {saving ? "만드는 중…" : "이미지 저장"}
            </button>
            <Link
              href={result.clan.href}
              className="rounded-xl border border-line px-4 py-3 text-center transition hover:border-accent hover:text-accent"
            >
              {result.clan.fullName} 자세히
            </Link>
          </div>

          <button
            onClick={() => {
              setMbti(null);
              setClan(null);
              setQ("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-inksoft transition hover:border-accent"
          >
            다시 해보기
          </button>
        </>
      )}
    </div>
  );
}

/** 결과를 공유용 정사각 카드 PNG로 그린다 (canvas 직접 그리기 — 외부 라이브러리 없음) */
async function renderCard(r: ReturnType<typeof judge>): Promise<string> {
  const W = 1080;
  const H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#faf7f2";
  ctx.fillRect(0, 0, W, H);

  // 상단·하단 띠
  ctx.fillStyle = r.tier.color;
  ctx.fillRect(0, 0, W, 14);
  ctx.fillRect(0, H - 14, W, 14);

  const center = W / 2;
  ctx.textAlign = "center";

  ctx.fillStyle = "#78716c";
  ctx.font = "500 30px 'Noto Sans KR', sans-serif";
  ctx.fillText(`${r.clan.fullName} · ${r.mbti}`, center, 150);

  ctx.font = "400 26px 'Noto Sans KR', sans-serif";
  ctx.fillText("조선시대였다면 당신은", center, 210);

  ctx.fillStyle = r.tier.color;
  ctx.font = "700 92px 'Noto Serif KR', serif";
  ctx.fillText(r.job.name, center, 320);

  if (r.job.hanja) {
    ctx.fillStyle = "#a8a29e";
    ctx.font = "400 30px 'Noto Serif KR', serif";
    ctx.fillText(r.job.hanja, center, 368);
  }

  // 설명 (줄바꿈 처리)
  ctx.fillStyle = "#44403c";
  ctx.font = "400 32px 'Noto Sans KR', sans-serif";
  wrap(ctx, r.job.desc, center, 450, 880, 52);

  // 등급 박스
  const boxY = 640;
  ctx.strokeStyle = "#e0d8ca";
  ctx.lineWidth = 2;
  roundRect(ctx, 120, boxY, W - 240, 300, 28);
  ctx.stroke();

  ctx.fillStyle = "#78716c";
  ctx.font = "400 26px 'Noto Sans KR', sans-serif";
  ctx.fillText("가문 등급", center, boxY + 62);

  ctx.fillStyle = r.tier.color;
  ctx.font = "700 62px 'Noto Serif KR', serif";
  ctx.fillText(`${r.tier.name} ${r.tier.hanja}`, center, boxY + 135);

  // 게이지
  const gw = 700;
  const gx = center - gw / 2;
  const gy = boxY + 175;
  ctx.fillStyle = "#e7e1d7";
  roundRect(ctx, gx, gy, gw, 14, 7);
  ctx.fill();
  if (r.rawScore > 0) {
    ctx.fillStyle = r.tier.color;
    roundRect(ctx, gx, gy, Math.max(30, gw * ((100 - r.percentile) / 100)), 14, 7);
    ctx.fill();
  }

  ctx.fillStyle = "#1c1917";
  ctx.font = "500 34px 'Noto Sans KR', sans-serif";
  ctx.fillText(
    r.rawScore > 0 ? `기록이 남은 본관 중 상위 ${r.percentile}%` : "조선 인구의 대다수가 속했던 신분",
    center,
    gy + 70
  );

  ctx.fillStyle = "#a8a29e";
  ctx.font = "400 24px 'Noto Sans KR', sans-serif";
  ctx.fillText("뿌리찾기 · 재미로 보는 콘텐츠입니다", center, H - 60);

  return canvas.toDataURL("image/png");
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = w;
      cy += lh;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
