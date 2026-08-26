import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SURNAMES, getSurname, CLAN_DISCLAIMER } from "@/data/surnames";
import ClanList from "@/components/ClanList";
import DeepDive from "@/components/DeepDive";
import { isDeepDiveEnabled } from "@/lib/ai";
import AdSlot from "@/components/AdSlot";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import Faq from "@/components/Faq";
import { CLAN_ENTRIES } from "@/lib/clan-index";

export function generateStaticParams() {
  return SURNAMES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = getSurname(id);
  if (!s) return { title: "찾을 수 없는 성씨" };
  const clanCount = s.allClans?.length ?? s.clans.length;
  const top = (s.allClans ?? []).slice(0, 5).join(", ");

  return {
    title: `${s.ko}씨(${s.hanja}) 유래와 본관 ${clanCount}개`,
    // 사람이 검색 결과에서 읽고 누를지 정하는 문장이다. 숫자와 지명을 앞에 둔다.
    description:
      `${s.ko}씨는 인구 ${s.rank}위, 약 ${s.population.toLocaleString()}명입니다. ` +
      `본관 ${clanCount}개를 하나씩 정리했습니다${top ? ` (${top} 등)` : ""}. ` +
      `${s.origin.slice(0, 60)}`,
    keywords: [
      `${s.ko}씨`,
      `${s.ko}씨 본관`,
      `${s.ko}씨 유래`,
      `${s.ko}씨 시조`,
      `${s.ko}씨 항렬`,
      `${s.ko}씨 인구`,
      "본관", "족보", "성씨",
    ],
    alternates: { canonical: `/surnames/${s.id}` },
    openGraph: {
      title: `${s.ko}씨(${s.hanja}) 유래와 본관 ${clanCount}개`,
      description: `${s.ko}씨 본관 ${clanCount}개와 시조·유래를 정리했습니다.`,
      type: "article",
      url: `/surnames/${s.id}`,
    },
  };
}

export default async function SurnameDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSurname(id);
  if (!s) notFound();

  const idx = SURNAMES.findIndex((x) => x.id === id);
  const prev = SURNAMES[idx - 1];
  const next = SURNAMES[idx + 1];
  const maxClan = Math.max(...s.clans.map((c) => c.population ?? 0), 1);

  // 이 성씨에 딸린 본관 페이지들 — 검색엔진에 "여기가 목록"이라고 알려주는 데 쓴다
  const entries = CLAN_ENTRIES.filter((c) => c.surnameId === s.id);
  const clanCount = s.allClans?.length ?? s.clans.length;

  /**
   * 자주 묻는 질문.
   * 아래 화면에 그대로 보여주는 내용과 **같은 문답**만 넣는다.
   * (화면에 없는 답을 구조화 데이터에만 넣으면 구글 정책 위반이다.)
   */
  const faq = [
    {
      q: `${s.ko}씨는 몇 명인가요?`,
      a: `${s.ko}(${s.hanja})씨는 약 ${s.population.toLocaleString()}명으로 국내 인구 ${s.rank}위입니다. 통계청 「2015 인구주택총조사 성씨·본관 집계」 기준입니다.`,
    },
    {
      q: `${s.ko}씨 본관은 몇 개인가요?`,
      a:
        `이 사이트가 확인한 ${s.ko}씨 본관은 ${clanCount}개입니다.` +
        ((s.allClans?.length ?? 0) > 0
          ? ` ${s.allClans!.slice(0, 6).join(", ")}${clanCount > 6 ? " 등" : ""}이 있습니다.`
          : ""),
    },
    {
      q: `본관이 다르면 같은 ${s.ko}씨라도 남인가요?`,
      a: `네. 본관이 다르면 시조가 다르므로 계통이 전혀 다른 가문입니다. 성씨가 같아도 혈연으로 이어져 있지 않습니다. 한 고을에서 여러 성씨가 일어나기도 했고, 한 성씨가 여러 고을로 퍼지기도 했습니다.`,
    },
    {
      q: `${s.ko}씨의 유래는 무엇인가요?`,
      a: s.origin,
    },
    ...(s.hangryeol
      ? [{ q: `${s.ko}씨 항렬자는 어떻게 되나요?`, a: s.hangryeol }]
      : []),
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: "성씨 찾기", href: "/surnames" },
          { name: `${s.ko}씨`, href: `/surnames/${s.id}` },
        ])}
      />
      {entries.length > 0 && (
        <JsonLd
          data={itemListSchema({
            name: `${s.ko}씨 본관 ${entries.length}개`,
            items: entries.map((c) => ({ name: c.fullName, href: c.href })),
          })}
        />
      )}
      <Link prefetch={false} href="/surnames" className="text-sm text-inksoft transition hover:text-accent">
        ← 성씨 목록
      </Link>

      {/* 헤더 */}
      <header className="fade-up mt-4 flex flex-wrap items-center gap-6 border-b border-line pb-8">
        <div className="serif flex size-24 items-center justify-center rounded-2xl bg-accent/10 text-5xl font-bold text-accent">
          {s.hanja}
        </div>
        <div>
          <h1 className="serif text-3xl font-bold sm:text-4xl">{s.ko}씨</h1>
          <p className="mt-1 text-inksoft">
            {s.hanja} · {s.reading}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">인구 {s.rank}위</span>
            <span className="rounded-full border border-line px-3 py-1 text-inksoft">
              {s.population.toLocaleString()}명
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-inksoft">
              수록 본관 {s.allClans?.length ?? s.clans.length}개
            </span>
          </div>
        </div>
      </header>

      {/* 유래 */}
      <section className="mt-10">
        <h2 className="serif mb-3 text-xl font-bold">유래</h2>
        <p className="leading-loose whitespace-pre-line text-ink/90">{s.origin}</p>
      </section>

      {/* 본관 */}
      <section className="mt-10">
        <h2 className="serif mb-4 text-xl font-bold">주요 본관과 시조</h2>
        <div className="space-y-3">
          {s.clans.map((c) => (
            <div key={`${c.name}-${c.founder}`} className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium">
                  {c.name}
                  {c.hanja && <span className="ml-2 text-sm text-inksoft">{c.hanja}</span>}
                </h3>
                {c.population && (
                  <span className="text-sm text-inksoft">약 {c.population.toLocaleString()}명</span>
                )}
              </div>
              <p className="mt-1 text-sm text-inksoft">
                시조 <span className="text-ink">{c.founder}</span>
              </p>
              {c.note && <p className="mt-2 text-sm leading-relaxed text-inksoft">{c.note}</p>}
              {c.population && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accentsoft to-accent"
                    style={{ width: `${Math.max(4, (c.population / maxClan) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 전체 본관 목록 */}
      {s.allClans && s.allClans.length > s.clans.length && (
        <section className="mt-10">
          <h2 className="serif mb-1 text-xl font-bold">
            {s.ko}씨 본관 전체 <span className="text-accent">{s.allClans.length}</span>개
          </h2>
          <p className="mb-4 text-sm text-inksoft">
            본관을 누르면 그 본관만의 상세 페이지로 들어갑니다. 색이 진한 {s.clans.length}개가 주요 본관입니다.
          </p>
          <ClanList clans={s.allClans} detailed={s.clans.map((c) => c.name)} surnameKo={s.ko} surnameId={s.id} />
          <p className="mt-3 text-xs leading-relaxed text-inksoft">※ {CLAN_DISCLAIMER}</p>
        </section>
      )}

      {/* AI 심층 해설 (API 키가 설정된 경우에만 노출) */}
      {isDeepDiveEnabled() && (
        <section className="mt-10">
          <h2 className="serif mb-1 text-xl font-bold">더 깊이 알아보기</h2>
          <p className="mb-4 text-sm text-inksoft">
            궁금한 본관을 고르면 역사적 배경과 인물을 자세히 풀어 드립니다.
          </p>
          <DeepDive surname={`${s.ko}(${s.hanja})`} clans={s.allClans ?? []} />
        </section>
      )}

      {/* 항렬 */}
      {s.hangryeol && (
        <section className="mt-10">
          <h2 className="serif mb-3 text-xl font-bold">항렬자</h2>
          <div className="card border-l-4 border-l-celadon p-5 text-sm leading-relaxed text-inksoft">
            {s.hangryeol}
            <p className="mt-3 text-xs opacity-80">
              ※ 항렬자는 파(派)마다 다릅니다. 정확한 내용은 문중 항렬표를 확인하세요.
            </p>
          </div>
        </section>
      )}

      {/* 인물 */}
      {s.figures && s.figures.length > 0 && (
        <section className="mt-10">
          <h2 className="serif mb-3 text-xl font-bold">대표 인물</h2>
          <ul className="flex flex-wrap gap-2">
            {s.figures.map((f) => (
              <li key={f} className="rounded-lg border border-line bg-elev px-3 py-1.5 text-sm">
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <Faq title={`${s.ko}씨에 대해 자주 묻는 것`} items={faq} />

      <section className="card mt-12 flex flex-wrap items-center justify-between gap-4 bg-accent/5 p-6">
        <div>
          <h3 className="serif font-bold">{s.ko}씨 가계도를 만들어볼까요?</h3>
          <p className="mt-1 text-sm text-inksoft">가족을 입력하면 한 장의 그림으로 정리해 드립니다.</p>
        </div>
        <Link prefetch={false}
          href="/family-tree"
          className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
        >
          가계도 만들기
        </Link>
      </section>

      <AdSlot />

      {/* 이전/다음 */}
      <nav className="mt-10 flex justify-between gap-4 border-t border-line pt-6 text-sm">
        {prev ? (
          <Link prefetch={false} href={`/surnames/${prev.id}`} className="text-inksoft transition hover:text-accent">
            ← {prev.ko}씨 ({prev.hanja})
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link prefetch={false} href={`/surnames/${next.id}`} className="text-inksoft transition hover:text-accent">
            {next.ko}씨 ({next.hanja}) →
          </Link>
        )}
      </nav>
    </article>
  );
}
