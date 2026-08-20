import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SURNAMES, getSurname, CLAN_DISCLAIMER } from "@/data/surnames";
import ClanList from "@/components/ClanList";
import DeepDive from "@/components/DeepDive";
import { isDeepDiveEnabled } from "@/lib/ai";

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
  return {
    title: `${s.ko}씨(${s.hanja}) 유래와 본관`,
    description: s.origin.slice(0, 120),
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

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
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
