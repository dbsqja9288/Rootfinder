"use client";

import { useEffect, useMemo, useState } from "react";
import ClanPicker from "./ClanPicker";
import GenPicker from "./GenPicker";
import AdSlot from "./AdSlot";
import KinDiagram from "./KinDiagram";
import { CLAN_ENTRIES, type ClanEntry } from "@/lib/clan-index";
import { decodePerson, encodePerson, judgeKin, type Person } from "@/lib/kinship";
import { clearKin, loadKin, ranked, saveKin, type KinLogEntry } from "@/lib/kin-log";

/**
 * 먼 친척찾기.
 *
 * 한 페이지가 두 얼굴을 갖는다.
 *   ?c= 가 없으면 → 내 링크 만들기
 *   ?c= 가 있으면 → 링크를 받은 사람이 자기 것을 넣고 관계를 본다
 *
 * 어느 쪽이든 아래에 **내 촌수 랭킹**이 붙는다. 한 번 비교하고 끝나면
 * 다시 올 이유가 없지만, 비교한 사람이 쌓이면 돌아올 이유가 생긴다.
 *
 * 서버에 아무것도 저장하지 않는다. 사람 정보는 주소 안에, 기록은 각자
 * 브라우저에만 있다.
 */
export default function KinFinder({ siteUrl }: { siteUrl: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [log, setLog] = useState<KinLogEntry[]>([]);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    setCode(c && c.length > 0 ? c : null);
    setLog(loadKin());
    setReady(true);
  }, []);

  const other = useMemo(() => (code ? resolve(code) : null), [code]);

  if (!ready) return <div className="card p-5 text-sm text-inksoft">불러오는 중…</div>;

  if (code && !other) {
    return (
      <div className="card p-6 text-center">
        <p className="font-medium">링크가 깨졌습니다</p>
        <p className="mt-2 text-sm text-inksoft">주소가 잘리거나 잘못 복사된 것 같아요. 보내주신 분께 다시 받아보세요.</p>
        <button
          onClick={() => setCode(null)}
          className="mt-5 rounded-xl bg-accent px-5 py-2.5 text-sm text-white dark:text-stone-900"
        >
          내 링크 만들기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {other ? (
        <Compare other={other} onSaved={setLog} onReset={() => setCode(null)} />
      ) : (
        <MakeLink siteUrl={siteUrl} />
      )}

      <Ranking log={log} onClear={() => { clearKin(); setLog([]); }} />
    </div>
  );
}

function resolve(code: string): Person | null {
  const d = decodePerson(code);
  if (!d) return null;
  const entry = CLAN_ENTRIES.find((c) => c.surnameId === d.surnameId && c.slug === d.slug);
  if (!entry) return null;
  return { ...d, fullName: entry.fullName };
}

/* ─────────────────────────── 내 링크 만들기 ─────────────────────────── */

function MakeLink({ siteUrl }: { siteUrl: string }) {
  const [clan, setClan] = useState<ClanEntry | null>(null);
  const [gen, setGen] = useState<number | null>(null);
  const [nick, setNick] = useState("");
  const [copied, setCopied] = useState(false);

  const link =
    clan && gen
      ? `${siteUrl}/kin?c=${encodePerson({
          surnameId: clan.surnameId,
          slug: clan.slug,
          fullName: clan.fullName,
          gen,
          nick: nick.trim().slice(0, 10),
        })}`
      : "";

  const shareText = `나랑 몇 촌인지 확인해보셈 ㅋㅋ\n${link}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <Step n={1} title="내 본관은?">
        <ClanPicker value={clan} onChange={setClan} />
      </Step>

      <Step n={2} title="몇 대손인가요?" dim={!clan}>
        <GenPicker value={gen} onChange={setGen} />
      </Step>

      <Step n={3} title="이름 (선택)" dim={!clan || !gen}>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          maxLength={10}
          placeholder="비워두셔도 됩니다"
          aria-label="표시할 이름"
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
        />
      </Step>

      {link && (
        <div className="card fade-up border-l-4 border-l-celadon p-6">
          <p className="serif font-bold">내 링크가 만들어졌습니다</p>
          <p className="mt-1 text-sm text-inksoft">받은 사람이 자기 본관을 넣으면 나와 몇 촌인지 나옵니다.</p>

          <div className="mt-4 break-all rounded-xl border border-line bg-bg px-4 py-3 text-sm">{link}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={copy}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:text-stone-900"
            >
              {copied ? "복사했습니다" : "링크 복사"}
            </button>
            <a
              href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line px-5 py-2.5 text-sm transition hover:border-accent hover:text-accent"
            >
              스레드에 올리기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────── 링크를 받은 사람이 보는 화면 ────────────────────── */

function Compare({
  other,
  onSaved,
  onReset,
}: {
  other: Person;
  onSaved: (l: KinLogEntry[]) => void;
  onReset: () => void;
}) {
  const [clan, setClan] = useState<ClanEntry | null>(null);
  const [gen, setGen] = useState<number | null>(null);

  const me: Person | null =
    clan && gen ? { surnameId: clan.surnameId, slug: clan.slug, fullName: clan.fullName, gen } : null;
  const result = me ? judgeKin(me, other) : null;

  // 결과가 나오면 그 즉시 내 기록에 남긴다. 따로 누를 것을 만들면 아무도 안 누른다.
  useEffect(() => {
    if (!result) return;
    onSaved(
      saveKin({
        nick: other.nick ?? "",
        fullName: other.fullName,
        gen: other.gen,
        maxChon: result.kind === "kin" ? result.maxChon : null,
        genGap: result.kind === "kin" ? result.genGap : null,
        at: Date.now(),
      }),
    );
    // 결과가 바뀔 때만 기록한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.headline, other.fullName, other.gen]);

  return (
    <div className="space-y-6">
      <div className="card border-l-4 border-l-accent p-6">
        <p className="text-sm text-inksoft">상대방</p>
        <p className="serif mt-1 text-2xl font-bold">
          {other.nick ? `${other.nick} · ` : ""}
          {other.fullName}
        </p>
        <p className="mt-1 text-inksoft">{other.gen}대손</p>
      </div>

      <Step n={1} title="내 본관은?">
        <ClanPicker value={clan} onChange={setClan} />
      </Step>

      <Step n={2} title="몇 대손인가요?" dim={!clan}>
        <GenPicker value={gen} onChange={setGen} />
      </Step>

      {result && (
        <>
          <AdSlot slot={2} className="!mt-4 !mb-2" />

          <div className="card fade-up p-6 text-center sm:p-8">
            {result.kind === "kin" ? (
              <>
                <KinDiagram myGen={me!.gen} otherGen={other.gen} maxChon={result.maxChon} />

                <p className="mt-4 text-lg font-medium">{result.standing}</p>

                <dl className="mt-6 grid grid-cols-2 gap-2 text-left">
                  <Fact label="세대 차이" value={result.genGap === 0 ? "없음" : `${result.genGap}세대`} />
                  <Fact label="공통 조상" value={`${result.gensToAncestor}세대 위`} />
                  <Fact label="혼인" value={result.withinEight ? "8촌 이내 — 불가" : "가능"} />
                  <Fact label="본관" value="일치" />
                </dl>
              </>
            ) : (
              <>
                <p className="serif text-3xl font-bold text-inksoft">{result.headline}</p>
                <p className="mx-auto mt-4 max-w-md text-left text-sm leading-relaxed text-inksoft">
                  {result.detail}
                </p>
              </>
            )}
          </div>

          <div className="card border-l-4 border-l-celadon p-6 text-center">
            <p className="serif font-bold">그럼 나랑은 몇 촌일까?</p>
            <p className="mt-1 text-sm text-inksoft">내 링크를 만들어 친구에게 보내보세요.</p>
            <button
              onClick={onReset}
              className="mt-4 rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
            >
              내 링크 만들기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── 내 촌수 랭킹 ───────────────────────── */

function Ranking({ log, onClear }: { log: KinLogEntry[]; onClear: () => void }) {
  if (log.length === 0) return null;
  const list = ranked(log);
  const closest = list.find((e) => e.maxChon !== null);

  return (
    <section className="card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="serif text-lg font-bold">내 촌수 랭킹</h2>
        <button onClick={onClear} className="text-xs text-inksoft underline transition hover:text-accent">
          기록 지우기
        </button>
      </div>

      {closest && (
        <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-elev p-4">
          <p className="text-xs text-inksoft">지금까지 가장 가까운 사람</p>
          <p className="serif mt-1 text-xl font-bold">
            {closest.nick || closest.fullName}{" "}
            <span className="text-accent">최대 {closest.maxChon}촌</span>
          </p>
        </div>
      )}

      <ol className="mt-4 space-y-1.5">
        {list.map((e, i) => (
          <li
            key={`${e.fullName}-${e.gen}-${e.nick}-${e.at}`}
            className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm"
          >
            <span className={`w-5 shrink-0 text-center font-bold ${i === 0 ? "text-accent" : "text-inksoft"}`}>
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {e.nick && <strong className="mr-1.5">{e.nick}</strong>}
              <span className="text-inksoft">
                {e.fullName} {e.gen}대손
              </span>
            </span>
            <span className={`shrink-0 ${e.maxChon === null ? "text-inksoft" : "font-medium text-accent"}`}>
              {e.maxChon === null ? "남남" : `${e.maxChon}촌`}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-inksoft">
        이 기록은 <strong className="text-ink">이 브라우저에만</strong> 저장됩니다. 서버로 보내지 않고, 다른
        사람은 볼 수 없으며, 브라우저 데이터를 지우면 함께 사라집니다.
      </p>
    </section>
  );
}

/* ───────────────────────────── 공용 조각 ───────────────────────────── */

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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2.5">
      <dt className="text-[11px] text-inksoft">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
