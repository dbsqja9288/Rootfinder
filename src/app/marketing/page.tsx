import type { Metadata } from "next";
import { loadThreads, loadRuns, summarize, type ThreadPost } from "@/lib/marketing";

/**
 * 마케팅 대시보드 — 한 화면에서 다 보기.
 *
 * 공개 페이지가 아니다. MARKETING_KEY 환경변수를 정해두고 ?key=... 로 들어와야 열린다.
 * 검색엔진에도 잡히지 않도록 noindex를 건다.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "마케팅 대시보드",
  robots: { index: false, follow: false },
};

const KST = "Asia/Seoul";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: KST,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function n(v: number) {
  return v.toLocaleString("ko-KR");
}

export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.MARKETING_KEY;

  if (!expected) {
    return (
      <Shell>
        <Notice title="아직 잠금장치가 없습니다">
          Vercel 프로젝트 설정 → Environment Variables 에 <Code>MARKETING_KEY</Code> 를 아무 문자열로 하나
          만들어 주세요. 그 값을 주소 뒤에 <Code>?key=값</Code> 으로 붙여야 이 페이지가 열립니다. 지금은 데이터를
          보여주지 않습니다.
        </Notice>
      </Shell>
    );
  }

  if (key !== expected) {
    return (
      <Shell>
        <Notice title="열쇠가 맞지 않습니다">
          주소 끝에 <Code>?key=…</Code> 를 붙여서 다시 들어와 주세요.
        </Notice>
      </Shell>
    );
  }

  const [threads, actions] = await Promise.all([loadThreads(30), loadRuns(12)]);
  const stats = summarize(threads.posts);
  const winner =
    stats[0].count && stats[1].count
      ? stats[0].avgViews === stats[1].avgViews
        ? null
        : stats[0].avgViews > stats[1].avgViews
          ? stats[0]
          : stats[1]
      : null;

  const totalViews = threads.posts.reduce((a, p) => a + p.views, 0);
  const totalLikes = threads.posts.reduce((a, p) => a + p.likes, 0);

  return (
    <Shell>
      <div className="mb-8">
        <h1 className="serif text-3xl font-bold">마케팅 대시보드</h1>
        <p className="mt-2 text-sm text-inksoft">
          {threads.username ? `@${threads.username} · ` : ""}
          이 페이지를 열 때마다 실시간으로 다시 불러옵니다 ·{" "}
          {new Date().toLocaleString("ko-KR", { timeZone: KST })}
        </p>
      </div>

      {/* 한눈에 */}
      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="팔로워" value={threads.followers != null ? n(threads.followers) : "—"} />
        <Stat label="누적 조회 (최근 글)" value={n(totalViews)} />
        <Stat label="누적 좋아요" value={n(totalLikes)} />
        <Stat label="수집된 글" value={`${threads.posts.length}개`} />
      </section>

      {!threads.ok && (
        <Notice title="스레드 데이터를 못 불러왔습니다">
          {threads.error}
          <br />
          토큰이 만료됐을 수 있습니다(60일). 아래 &lsquo;토큰 갱신&rsquo; 카드를 보세요.
        </Notice>
      )}

      {/* A/B */}
      <section className="mb-10">
        <h2 className="serif mb-1 text-xl font-bold">A/B 소재 성적표</h2>
        <p className="mb-4 text-sm text-inksoft">
          같은 시각에 번갈아 올린 두 소재를 비교합니다. 평균 조회수가 판단 기준입니다.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((s) => (
            <div
              key={s.key}
              className={`card p-5 ${winner?.key === s.key ? "border-accent ring-1 ring-accent/30" : ""}`}
            >
              <div className="flex items-baseline justify-between">
                <p className="serif text-lg font-bold">
                  소재 {s.key} <span className="text-sm font-normal text-inksoft">{s.label}</span>
                </p>
                {winner?.key === s.key && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-white dark:text-stone-900">
                    앞서는 중
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-bold text-accent">{n(s.avgViews)}</p>
              <p className="text-sm text-inksoft">글당 평균 조회수 ({s.count}개 기준)</p>

              <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-4 text-center text-sm">
                <Cell k="조회" v={n(s.views)} />
                <Cell k="좋아요" v={n(s.likes)} />
                <Cell k="댓글" v={n(s.replies)} />
                <Cell k="리포스트" v={n(s.reposts)} />
              </dl>

              <p className="mt-3 text-xs text-inksoft">
                반응률 {(s.engagement * 100).toFixed(2)}% · (좋아요+댓글+리포스트) ÷ 조회수
              </p>
            </div>
          ))}
        </div>

        {stats.every((s) => s.count === 0) && (
          <p className="mt-3 text-sm text-inksoft">
            아직 소재를 구분할 글이 없습니다. 자동 게시가 몇 번 돌고 나면 채워집니다.
          </p>
        )}
      </section>

      {/* 글별 */}
      <section className="mb-10">
        <h2 className="serif mb-4 text-xl font-bold">올라간 글</h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-elev text-left text-xs text-inksoft">
              <tr>
                <th className="px-3 py-2.5">시각 (KST)</th>
                <th className="px-3 py-2.5">소재</th>
                <th className="px-3 py-2.5 text-right">조회</th>
                <th className="px-3 py-2.5 text-right">좋아요</th>
                <th className="px-3 py-2.5 text-right">댓글</th>
                <th className="px-3 py-2.5 text-right">리포스트</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {threads.posts.map((p: ThreadPost) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="whitespace-nowrap px-3 py-2.5">{fmtTime(p.timestamp)}</td>
                  <td className="px-3 py-2.5">
                    {p.variant ? (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        {p.variant}
                      </span>
                    ) : (
                      <span className="text-xs text-inksoft">직접 올린 글</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium">{n(p.views)}</td>
                  <td className="px-3 py-2.5 text-right">{n(p.likes)}</td>
                  <td className="px-3 py-2.5 text-right">{n(p.replies)}</td>
                  <td className="px-3 py-2.5 text-right">{n(p.reposts)}</td>
                  <td className="px-3 py-2.5">
                    {p.permalink && (
                      <a
                        href={p.permalink}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-accent underline underline-offset-2"
                      >
                        보기
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {threads.posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-inksoft">
                    아직 수집된 글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 자동 게시 상태 */}
      <section className="mb-10">
        <h2 className="serif mb-1 text-xl font-bold">자동 게시가 잘 돌고 있나</h2>
        <p className="mb-4 text-sm text-inksoft">
          GitHub Actions 실행 이력입니다. 스레드에 하루 6번 올라갑니다. (X는 유료로 바뀌어 꺼둔 상태)
        </p>
        <div className="space-y-1.5">
          {actions.runs.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm transition hover:border-accent"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  background:
                    r.conclusion === "success"
                      ? "#16a34a"
                      : r.conclusion === null
                        ? "#d97706"
                        : "#dc2626",
                }}
              />
              <span className="flex-1 truncate">{r.name}</span>
              <span className="text-xs text-inksoft">{fmtTime(r.createdAt)}</span>
              <span className="w-14 text-right text-xs text-inksoft">
                {r.conclusion === "success" ? "성공" : r.conclusion === null ? "실행 중" : "실패"}
              </span>
            </a>
          ))}
          {!actions.ok && <p className="text-sm text-inksoft">불러오지 못했습니다: {actions.error}</p>}
        </div>
      </section>

      {/* 밖에서 봐야 하는 것들 */}
      <section className="mb-10">
        <h2 className="serif mb-1 text-xl font-bold">여기선 못 가져오는 숫자</h2>
        <p className="mb-4 text-sm text-inksoft">
          두 곳은 무료 등급에서 조회 API를 열어주지 않아 링크로 둡니다. 클릭 한 번이면 바로 열립니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <LinkCard
            href="https://vercel.com/dashboard"
            title="사이트 트래픽"
            desc="Vercel → 프로젝트 → Analytics. 방문자·페이지뷰·유입 경로."
          />
          <LinkCard
            href="https://analytics.x.com/"
            title="X 성적"
            desc="손으로 올린 글의 노출·참여. X는 API가 유료로 바뀌어 자동 게시를 꺼뒀습니다."
          />
          <LinkCard
            href="https://search.google.com/search-console"
            title="검색 유입"
            desc="구글에서 어떤 검색어로 들어오는지."
          />
        </div>
      </section>

      {/* 정비 */}
      <section>
        <h2 className="serif mb-4 text-xl font-bold">정기 점검</h2>
        <div className="card p-5 text-sm leading-relaxed">
          <p className="font-medium">스레드 토큰은 60일마다 만료됩니다.</p>
          <p className="mt-1 text-inksoft">
            위 &lsquo;스레드 데이터를 못 불러왔습니다&rsquo; 가 뜨면 갱신할 때입니다. 아래 주소를 브라우저에
            열고 나온 <Code>access_token</Code> 값을 GitHub Secrets 의 <Code>THREADS_ACCESS_TOKEN</Code> 과
            Vercel 환경변수 양쪽에 넣으면 됩니다.
          </p>
          <p className="mt-3 break-all rounded-lg bg-elev p-3 font-mono text-xs">
            https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&amp;access_token=지금쓰는토큰
          </p>
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-12">{children}</div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-inksoft">{label}</p>
      <p className="serif mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-inksoft">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card mb-6 border-accent/40 p-5">
      <p className="serif font-bold text-accent">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-inksoft">{children}</p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-elev px-1.5 py-0.5 font-mono text-xs text-ink">{children}</code>;
}

function LinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="card p-5 transition hover:border-accent hover:shadow-sm"
    >
      <p className="serif font-bold">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-inksoft">{desc}</p>
      <p className="mt-3 text-xs text-accent">열기 →</p>
    </a>
  );
}
