"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ClanPicker from "./ClanPicker";
import GenPicker from "./GenPicker";
import AdSlot from "./AdSlot";
import SajuBoard, { OhaengBars } from "./SajuBoard";
import { buildFortune, type Gender } from "@/lib/fortune";
import { JIJI_ANIMAL, OHAENG_COLOR } from "@/lib/saju";
import type { ClanEntry } from "@/lib/clan-index";

/**
 * 가문 운세 리포트.
 *
 * 입력은 사주를 보는 곳이면 어디나 묻는 것과 같게 맞췄다.
 *   성별 · 양력 생년월일 · 태어난 시각(모름 허용)
 * 여기에 이 사이트만 가진 정보(본관·대손)를 더한다.
 *
 * 결과는 입력값과 그 달로만 정해진다. 새로고침해도 같은 글이 나온다.
 * 누를 때마다 바뀌면 그 순간 신뢰가 사라진다.
 */

const HOURS: { label: string; value: number | null }[] = [
  { label: "모름", value: null },
  { label: "23~01 자시", value: 23 },
  { label: "01~03 축시", value: 1 },
  { label: "03~05 인시", value: 3 },
  { label: "05~07 묘시", value: 5 },
  { label: "07~09 진시", value: 7 },
  { label: "09~11 사시", value: 9 },
  { label: "11~13 오시", value: 11 },
  { label: "13~15 미시", value: 13 },
  { label: "15~17 신시", value: 15 },
  { label: "17~19 유시", value: 17 },
  { label: "19~21 술시", value: 19 },
  { label: "21~23 해시", value: 21 },
];

export default function FortuneQuiz({ siteUrl }: { siteUrl: string }) {
  const [clan, setClan] = useState<ClanEntry | null>(null);
  const [gen, setGen] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [birth, setBirth] = useState("");
  const [hour, setHour] = useState<number | null | undefined>(undefined);

  const parsed = useMemo(() => {
    const m = birth.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return { y, m: mo, d };
  }, [birth]);

  const ready = clan && gen && gender && parsed && hour !== undefined;

  const report = useMemo(
    () =>
      ready
        ? buildFortune({ clan, gen, gender, birth: parsed, hour: hour ?? null }, new Date())
        : null,
    [ready, clan, gen, gender, parsed, hour],
  );

  const shareText = report
    ? `${clan!.fullName} ${gen}대손 · ${report.saju.animal}띠 ${report.dayGanLabel}일간\n${report.period}: ${report.headline}\n\n${siteUrl}/fortune`
    : "";

  return (
    <div className="space-y-6">
      <Step n={1} title="본관은?">
        <ClanPicker value={clan} onChange={setClan} />
      </Step>

      <Step n={2} title="몇 대손인가요?" dim={!clan}>
        <GenPicker value={gen} onChange={setGen} />
      </Step>

      <Step n={3} title="성별" dim={!clan || !gen}>
        <div className="flex gap-2">
          {(["남", "여"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 rounded-xl py-3 font-medium transition ${
                gender === g
                  ? "bg-accent text-white dark:text-stone-900"
                  : "border border-line text-inksoft hover:border-accent hover:text-accent"
              }`}
            >
              {g}자
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-inksoft">
          명리에서 대운이 흐르는 방향이 성별에 따라 갈리기 때문에 묻습니다.
        </p>
      </Step>

      <Step n={4} title="태어난 날 (양력)" dim={!gender}>
        <input
          type="date"
          value={birth}
          min="1900-01-01"
          max="2100-12-31"
          onChange={(e) => setBirth(e.target.value)}
          aria-label="양력 생년월일"
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
        />
        <p className="mt-2 text-xs leading-relaxed text-inksoft">
          <strong className="text-ink">양력</strong>으로 넣어 주세요. 음력 생일만 아신다면 달력 앱에서 양력으로
          바꾼 뒤 넣으시면 됩니다.
        </p>
      </Step>

      <Step n={5} title="태어난 시각" dim={!parsed}>
        <div className="grid grid-cols-3 gap-2">
          {HOURS.map((h) => (
            <button
              key={h.label}
              onClick={() => setHour(h.value)}
              className={`rounded-lg py-2.5 text-xs font-medium transition ${
                hour === h.value && hour !== undefined
                  ? "bg-accent text-white dark:text-stone-900"
                  : "border border-line text-inksoft hover:border-accent hover:text-accent"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-inksoft">
          모르셔도 됩니다. 대신 여덟 글자 중 여섯 글자로만 보게 되고, 화면에도 그렇게 적힙니다.
        </p>
      </Step>

      {report && (
        <>
          <div className="pt-4">
            <AdSlot slot={2} className="!mt-2 !mb-4" />
            <p className="fade-up text-center text-sm text-inksoft">
              리포트는 바로 아래에 있습니다 <span aria-hidden>↓</span>
            </p>
          </div>

          <article className="card fade-up overflow-hidden p-6 sm:p-8">
            <header className="border-b border-line pb-6 text-center">
              <p className="text-sm text-inksoft">{report.period} · 가문 운세</p>
              <p className="serif mt-2 text-lg">
                {clan!.fullName} {gen}대손 · {report.saju.animal}띠
              </p>
              <h2
                className="serif mt-4 text-3xl font-bold"
                style={{ color: OHAENG_COLOR[report.saju.strongest] }}
              >
                {report.headline}
              </h2>
            </header>

            {/* ── 계산 영역 ── */}
            <Block tag="계산" title="내 사주 여덟 글자">
              <SajuBoard saju={report.saju} />
            </Block>

            <Block tag="계산" title="오행이 몇 개씩인가">
              <OhaengBars counts={report.saju.counts} />
              <p className="mt-4 text-sm leading-relaxed text-inksoft">
                여덟 글자에 어떤 기운이 몰려 있는지를 셉니다. 가장 많은 것이{" "}
                <strong style={{ color: OHAENG_COLOR[report.saju.strongest] }}>
                  {report.saju.strongest}
                </strong>
                {report.saju.missing.length > 0 && (
                  <>
                    , 하나도 없는 것이{" "}
                    <strong className="text-ink">{report.saju.missing.join("·")}</strong>
                  </>
                )}
                입니다.
              </p>
            </Block>

            {/* ── 해석 영역 ── */}
            <Block tag="해석" title={`일간 ${report.dayGanLabel} — ${report.dayGanImage}`}>
              <p className="leading-loose text-ink/90">{report.dayGanNature}</p>
            </Block>

            {report.lacking.length > 0 && (
              <Block tag="해석" title="비어 있는 기운">
                <ul className="space-y-3">
                  {report.lacking.map(({ ohaeng, advice }) => (
                    <li key={ohaeng} className="leading-loose text-ink/90">
                      <strong style={{ color: OHAENG_COLOR[ohaeng] }}>{ohaeng}</strong> — {advice}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {report.lineage && (
              <Block tag="기록" title="선조에게서 온 것">
                <p className="leading-loose text-ink/90">{report.lineage}</p>
              </Block>
            )}

            <Block tag="해석" title={`${report.period}의 흐름`}>
              <p className="leading-loose text-ink/90">{report.flow}</p>
            </Block>

            <Block tag="해석" title="조심할 것">
              <p className="leading-loose text-ink/90">{report.caution}</p>
            </Block>

            <div className="mt-7 rounded-xl border-l-4 border-l-accent bg-elev p-5">
              <p className="mb-1 text-xs tracking-wide text-inksoft">이번 달 하나만 한다면</p>
              <p className="font-medium leading-relaxed">{report.action}</p>
            </div>

            {report.unknowns.length > 0 && (
              <ul className="mt-8 space-y-1.5 border-t border-line pt-5 text-xs leading-relaxed text-inksoft">
                {report.unknowns.map((u, i) => (
                  <li key={i}>· {u}</li>
                ))}
              </ul>
            )}
          </article>

          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line px-5 py-2.5 text-sm transition hover:border-accent hover:text-accent"
            >
              스레드에 공유
            </a>
            <Link
              prefetch={false}
              href={clan!.href}
              className="rounded-xl border border-line px-5 py-2.5 text-sm transition hover:border-accent hover:text-accent"
            >
              {clan!.fullName} 자세히
            </Link>
            <Link
              prefetch={false}
              href="/kin"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:text-stone-900"
            >
              이 사람과 몇 촌일까
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 리포트의 한 덩어리.
 * 태그로 '계산 / 기록 / 해석'을 구분해서 붙인다.
 * 계산한 값과 사람이 쓴 해석이 같은 무게로 읽히면 곤란하다.
 */
function Block({ tag, title, children }: { tag: "계산" | "기록" | "해석"; title: string; children: React.ReactNode }) {
  const tone =
    tag === "계산"
      ? "border-celadon text-celadon"
      : tag === "기록"
        ? "border-accent text-accent"
        : "border-line text-inksoft";

  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tone}`}>{tag}</span>
        <h3 className="serif font-bold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Step({ n, title, dim, children }: { n: number; title: string; dim?: boolean; children: React.ReactNode }) {
  return (
    <section className={`card p-5 transition ${dim ? "pointer-events-none opacity-40" : ""}`}>
      <h2 className="serif mb-3 font-bold">
        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs text-white dark:text-stone-900">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** 띠 이름 목록을 밖에서도 쓸 수 있게 재수출한다. */
export { JIJI_ANIMAL };
