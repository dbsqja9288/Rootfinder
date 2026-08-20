"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MBTI_LIST, type Mbti } from "@/data/joseon";
import { searchClans, type ClanEntry } from "@/lib/clan-index";
import { judge } from "@/lib/joseon";
import TierArt from "./TierArt";
import AdSlot from "./AdSlot";

export default function JoseonQuiz({ siteUrl }: { siteUrl: string }) {
  const [q, setQ] = useState("");
  const [clan, setClan] = useState<ClanEntry | null>(null);
  const [mbti, setMbti] = useState<Mbti | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<"" | "insta" | "save">("");
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const candidates = useMemo(() => (q.trim() ? searchClans(q, 8) : []), [q]);
  const result = useMemo(() => (clan && mbti ? judge(clan, mbti) : null), [clan, mbti]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  }

  const pageUrl = `${siteUrl}/joseon`;

  /** 공유 문구. 플랫폼마다 링크를 붙이는 방식이 달라서 본문만 만든다. */
  function shareText() {
    if (!result) return "";
    const rankLine =
      result.rawScore > 0
        ? `${result.tier.name}(${result.tier.hanja}) · 기록이 남은 본관 중 상위 ${result.percentile}%`
        : `${result.tier.name}(${result.tier.hanja})`;
    return `조선시대였다면 나는 「${result.job.name}」\n\n${result.clan.fullName} · ${result.mbti}\n${rankLine}\n\n내 본관도 찾아보기 👇`;
  }

  function fileName() {
    return `${result?.clan.fullName}_${result?.mbti}_조선시대.png`;
  }

  function download(dataUrl: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName();
    a.click();
  }

  async function saveImage() {
    if (!result) return;
    setSaving(true);
    try {
      download(await renderCard(result));
    } finally {
      setSaving(false);
    }
  }

  function shareOnX() {
    if (!result) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(pageUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  /** 스레드는 글쓰기 화면을 여는 공식 인텐트 주소가 있다. */
  function shareOnThreads() {
    if (!result) return;
    const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareText()}\n${pageUrl}`)}`;
    window.open(url, "_blank", "noopener");
  }

  /**
   * 인스타그램은 외부에서 글을 미리 채워 넣는 공개 주소가 없다.
   * 그래서 모바일에서는 공유 시트(Web Share)로 이미지를 그대로 넘기고,
   * PC에서는 이미지를 내려받고 문구를 클립보드에 담아준다.
   */
  async function shareOnInstagram() {
    if (!result) return;
    setBusy("insta");
    try {
      const png = await renderCard(result);
      const text = `${shareText()}\n${pageUrl}`;
      const file = await dataUrlToFile(png, fileName());

      if (file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          return;
        } catch (e) {
          // 사용자가 취소한 경우엔 조용히 끝낸다
          if ((e as DOMException)?.name === "AbortError") return;
        }
      }

      download(png);
      try {
        await navigator.clipboard.writeText(text);
        flash("이미지를 저장했어요. 문구도 복사했으니 인스타그램에 붙여넣어 주세요.");
      } catch {
        flash("이미지를 저장했어요. 인스타그램 스토리·피드에 올려보세요.");
      }
    } finally {
      setBusy("");
    }
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
          {/*
            결과 바로 앞 광고.
            여기가 이 사이트에서 사람이 가장 확실하게 지나가는 길목이다.
            다만 위쪽 MBTI 버튼과는 충분히 떨어뜨려 둔다 — 버튼을 누르려다 광고를 잘못 누르면
            애드핏/애드센스 양쪽 다 무효 클릭으로 잡고, 쌓이면 계정이 정지된다.
          */}
          <div className="pt-4">
            <AdSlot slot={2} className="!mt-2 !mb-4" />
            <p className="fade-up text-center text-sm text-inksoft">
              결과는 바로 아래에 있습니다 <span aria-hidden>↓</span>
            </p>
          </div>

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
          <div className="space-y-2">
            <p className="text-center text-sm text-inksoft">결과를 친구들에게 공유해보세요</p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={shareOnX}
                aria-label="X에 공유하기"
                className="flex items-center justify-center gap-2 rounded-xl bg-ink px-3 py-3 font-medium text-bg transition hover:opacity-90"
              >
                <XIcon />
                <span className="text-sm">X</span>
              </button>
              <button
                onClick={shareOnThreads}
                aria-label="스레드에 공유하기"
                className="flex items-center justify-center gap-2 rounded-xl bg-ink px-3 py-3 font-medium text-bg transition hover:opacity-90"
              >
                <ThreadsIcon />
                <span className="text-sm">스레드</span>
              </button>
              <button
                onClick={shareOnInstagram}
                disabled={busy === "insta"}
                aria-label="인스타그램에 공유하기"
                className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                }}
              >
                <InstagramIcon />
                <span className="text-sm">{busy === "insta" ? "준비 중…" : "인스타"}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveImage}
                disabled={saving}
                className="flex-1 rounded-xl bg-accent px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:text-stone-900"
              >
                {saving ? "만드는 중…" : "이미지 저장"}
              </button>
              <Link prefetch={false}
                href={result.clan.href}
                className="rounded-xl border border-line px-4 py-3 text-center transition hover:border-accent hover:text-accent"
              >
                {result.clan.fullName} 자세히
              </Link>
            </div>

            <p className="pt-1 text-center text-xs leading-relaxed text-inksoft">
              재밌으셨다면{" "}
              <Link prefetch={false} href="/support" className="underline underline-offset-2 transition hover:text-accent">
                만든 사람에게 커피 한 잔
              </Link>{" "}
              · 틀린 내용은{" "}
              <Link prefetch={false} href="/corrections" className="underline underline-offset-2 transition hover:text-accent">
                여기로
              </Link>
            </p>

            {toast && (
              <p
                role="status"
                className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-center text-sm text-accent"
              >
                {toast}
              </p>
            )}
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

/** 브라우저 공유 시트에 넘길 수 있도록 데이터 URL을 파일 객체로 바꾼다 */
async function dataUrlToFile(dataUrl: string, name: string): Promise<File | null> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], name, { type: "image/png" });
  } catch {
    return null;
  }
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.291 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.617-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.9 13.9 0 0 1 2.618.116c-.106-.647-.32-1.16-.64-1.532-.44-.51-1.12-.772-2.02-.779h-.033c-.723 0-1.704.198-2.33 1.129l-1.688-1.134C9.174 6.552 10.616 5.7 12.291 5.7h.05c2.802.017 4.471 1.732 4.638 4.727.096.04.19.082.283.126 1.318.62 2.283 1.558 2.79 2.71.708 1.607.773 4.228-1.36 6.317-1.63 1.597-3.61 2.316-6.508 2.337z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
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
