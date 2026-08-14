import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CLAN_ENTRIES,
  getClan,
  sameRegionClans,
  siblingClans,
  surnameOf,
} from "@/lib/clan-index";
import { CLAN_DISCLAIMER } from "@/data/surnames";
import { isDeepDiveEnabled } from "@/lib/ai";
import DeepDive from "@/components/DeepDive";

export function generateStaticParams() {
  return CLAN_ENTRIES.map((c) => ({ id: c.surnameId, clan: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; clan: string }>;
}): Promise<Metadata> {
  const { id, clan } = await params;
  const entry = getClan(id, clan);
  if (!entry) return { title: "찾을 수 없는 본관" };

  const where = entry.region ? ` 본관은 ${entry.region.now}입니다.` : "";
  const founder = entry.detail ? ` 시조는 ${entry.detail.founder}입니다.` : "";

  return {
    title: `${entry.fullName} — 시조와 유래`,
    description: `${entry.fullName}(${entry.surnameHanja})의 시조, 본관 지역, 인구를 정리했습니다.${where}${founder}`,
    openGraph: { title: `${entry.fullName} — 시조와 유래`, type: "article" },
  };
}

export default async function ClanPage({
  params,
}: {
  params: Promise<{ id: string; clan: string }>;
}) {
  const { id, clan } = await params;
  const entry = getClan(id, clan);
  if (!entry) notFound();

  const surname = surnameOf(entry);
  const siblings = siblingClans(entry);
  const others = sameRegionClans(entry);
  const d = entry.detail;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      {/* 빵부스러기 */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-inksoft">
        <Link href="/surnames" className="transition hover:text-accent">
          성씨 찾기
        </Link>
        <span>›</span>
        <Link href={`/surnames/${entry.surnameId}`} className="transition hover:text-accent">
          {entry.surnameKo}씨
        </Link>
        <span>›</span>
        <span className="text-ink">{entry.clanName}</span>
      </nav>

      {/* 헤더 */}
      <header className="fade-up mt-4 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="serif flex size-20 items-center justify-center rounded-2xl bg-accent/10 text-4xl font-bold text-accent">
            {entry.surnameHanja}
          </div>
          <div>
            <h1 className="serif text-3xl font-bold sm:text-4xl">{entry.fullName}</h1>
            <p className="mt-1 text-inksoft">
              {d?.hanja && <span className="mr-2">{d.hanja}</span>}
              {entry.surnameKo}({entry.surnameHanja})씨의 본관
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="card p-4">
            <dt className="text-xs text-inksoft">시조</dt>
            <dd className="mt-1 font-medium">{d?.founder ?? "기록 확인 필요"}</dd>
          </div>
          <div className="card p-4">
            <dt className="text-xs text-inksoft">본관 지역</dt>
            <dd className="mt-1 font-medium">{entry.region?.now ?? "확인 필요"}</dd>
          </div>
          <div className="card p-4">
            <dt className="text-xs text-inksoft">인구</dt>
            <dd className="mt-1 font-medium">
              {d?.population ? `약 ${d.population.toLocaleString()}명` : "집계 자료 없음"}
            </dd>
          </div>
        </dl>
      </header>

      {/* 본관 지역 해설 */}
      {entry.region && (
        <section className="mt-10">
          <h2 className="serif mb-3 text-xl font-bold">{entry.clanName}은 어디인가</h2>
          <div className="card border-l-4 border-l-celadon p-5">
            <p className="leading-loose">
              <strong>{entry.clanName}</strong>은 오늘날의 <strong>{entry.region.now}</strong>입니다.
            </p>
            {entry.region.note && (
              <p className="mt-2 leading-relaxed text-inksoft">{entry.region.note}</p>
            )}
            <p className="mt-3 text-sm text-inksoft">
              본관은 지금 사는 곳이 아니라 <strong className="text-ink">시조가 터를 잡은 곳</strong>입니다. 서울에
              살아도 본관이 {entry.clanName}이면 {entry.fullName}입니다.
            </p>
          </div>
        </section>
      )}

      {/* 이 본관 이야기 */}
      <section className="mt-10">
        <h2 className="serif mb-3 text-xl font-bold">{entry.fullName} 이야기</h2>
        {d?.note ? (
          <p className="leading-loose text-ink/90">{d.note}</p>
        ) : (
          <div className="card p-5 text-sm leading-relaxed text-inksoft">
            <p>
              <strong className="text-ink">{entry.fullName}</strong>은 {entry.surnameKo}씨의 본관 가운데 하나로
              전해집니다. 다만 이 본관에 대한 상세한 시조·세계(世系) 기록은 아직 이 사이트에 수록되지 않았습니다.
            </p>
            <p className="mt-3">
              정확한 내용은 {entry.surnameKo}씨 대종회나 {entry.clanName} {entry.surnameKo}씨 종친회에 문의하시거나,
              국립중앙도서관·한국학중앙연구원 장서각의 족보 자료를 확인하시는 것이 확실합니다.
            </p>
          </div>
        )}

        {surname && (
          <details className="card mt-4 p-5">
            <summary className="cursor-pointer font-medium">
              {entry.surnameKo}씨(<span className="serif">{entry.surnameHanja}</span>) 전체는 어떻게 시작됐나
            </summary>
            <p className="mt-3 leading-loose text-inksoft">{surname.origin}</p>
            {surname.hangryeol && (
              <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-inksoft">
                <strong className="text-ink">항렬자</strong> — {surname.hangryeol}
              </p>
            )}
          </details>
        )}
      </section>

      {/* AI 심층 해설 */}
      {isDeepDiveEnabled() && (
        <section className="mt-10">
          <h2 className="serif mb-3 text-xl font-bold">더 깊이 알아보기</h2>
          <DeepDive surname={`${entry.surnameKo}(${entry.surnameHanja})`} clans={[entry.clanName]} />
        </section>
      )}

      {/* 조선시대 콘텐츠 진입 */}
      <section className="card mt-10 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-accent p-6">
        <div>
          <h3 className="serif font-bold">조선시대였다면 {entry.fullName}은 어떤 가문이었을까?</h3>
          <p className="mt-1 text-sm text-inksoft">MBTI까지 고르면 내 직업도 나옵니다 · 재미로 보는 콘텐츠</p>
        </div>
        <Link
          href="/joseon"
          className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
        >
          확인하기
        </Link>
      </section>

      {/* 같은 본관, 다른 성씨 */}
      {others.length > 0 && (
        <section className="mt-10">
          <h2 className="serif mb-1 text-xl font-bold">같은 &lsquo;{entry.slug}&rsquo;을 본관으로 쓰는 다른 성씨</h2>
          <p className="mb-4 text-sm text-inksoft">
            본관이 같아도 성씨가 다르면 완전히 다른 가문입니다. 같은 고을에서 여러 성씨가 일어난 것뿐입니다.
          </p>
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.href}>
                <Link
                  href={o.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-elev px-3 py-1.5 text-sm transition hover:border-accent hover:text-accent"
                >
                  <span className="serif font-bold text-accent">{o.surnameHanja}</span>
                  {o.fullName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 형제 본관 */}
      {siblings.length > 0 && (
        <section className="mt-10">
          <h2 className="serif mb-1 text-xl font-bold">
            {entry.surnameKo}씨의 다른 본관 {siblings.length}개
          </h2>
          <p className="mb-4 text-sm text-inksoft">뿌리가 같거나, 갈라져 나온 갈래들입니다.</p>
          <ul className="flex flex-wrap gap-1.5">
            {siblings.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={`inline-block rounded-lg px-2.5 py-1 text-sm transition hover:border-accent hover:text-accent ${
                    s.detail
                      ? "border border-accent/40 bg-accent/5 font-medium text-accent"
                      : "border border-line text-inksoft"
                  }`}
                >
                  {s.slug}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-inksoft">※ {CLAN_DISCLAIMER}</p>
        </section>
      )}

      {/* CTA */}
      <section className="card mt-12 flex flex-wrap items-center justify-between gap-4 bg-accent/5 p-6">
        <div>
          <h3 className="serif font-bold">{entry.fullName} 가계도를 만들어볼까요?</h3>
          <p className="mt-1 text-sm text-inksoft">시조부터 나까지, 한 장의 그림으로 정리해 드립니다.</p>
        </div>
        <Link
          href="/family-tree"
          className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
        >
          가계도 만들기
        </Link>
      </section>
    </article>
  );
}
