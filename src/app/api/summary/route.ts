/**
 * 성과 요약을 한 번에 JSON으로 내보낸다.
 *
 * 사람이 보는 화면은 /marketing 이고, 이건 **기계가 읽는 쪽**이다.
 * 매일 자동으로 이 주소를 읽어 어제와 비교하고 이상한 점을 찾아내는 용도다.
 *
 *   GET /api/summary?key=MARKETING_KEY
 *
 * 대시보드와 같은 열쇠를 쓴다. 열쇠가 없거나 틀리면 아무것도 주지 않는다.
 * 검색엔진에도 잡히지 않게 robots 헤더를 붙인다.
 */

import { loadRuns, loadThreads, summarize, byCopy, SERVICE_LABEL, SERVICE_ORDER } from "@/lib/marketing";
import { loadGa } from "@/lib/ga4";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function deny(status: number, message: string) {
  return Response.json(
    { ok: false, error: message },
    { status, headers: { "X-Robots-Tag": "noindex" } },
  );
}

export async function GET(req: Request) {
  const expected = process.env.MARKETING_KEY;
  if (!expected) return deny(503, "MARKETING_KEY 환경변수가 없습니다.");

  const key = new URL(req.url).searchParams.get("key");
  if (key !== expected) return deny(401, "열쇠가 맞지 않습니다.");

  const [threads, runs, ga] = await Promise.all([loadThreads(60), loadRuns(24), loadGa()]);

  const services = summarize(threads.posts);
  const copies = byCopy(threads.posts);

  // 자동 게시가 제대로 돌고 있는지. 실패가 쌓이면 여기서 먼저 드러난다.
  const failed = runs.runs.filter((r) => r.conclusion && r.conclusion !== "success");

  return Response.json(
    {
      ok: true,
      generatedAt: new Date().toISOString(),

      threads: {
        ok: threads.ok,
        error: threads.error ?? null,
        /** "file"이면 깃허브 액션이 받아 둔 값을 읽은 것 */
        source: threads.source ?? null,
        collectedAt: threads.generatedAt ?? null,
        username: threads.username ?? null,
        followers: threads.followers ?? null,
        /** 서비스별 성적 */
        services: services.map((s) => ({
          key: s.key,
          label: s.label,
          posts: s.count,
          avgViews: s.avgViews,
          views: s.views,
          likes: s.likes,
          replies: s.replies,
          reposts: s.reposts,
          engagement: Number((s.engagement * 100).toFixed(2)),
        })),
        /** 문구별 순위 — 어떤 문구를 남길지 판단하는 자료 */
        copies: Object.fromEntries(
          SERVICE_ORDER.map((k) => [
            SERVICE_LABEL[k],
            (copies[k] ?? []).map((c) => ({
              copy: c.label,
              posts: c.count,
              avgViews: c.avgViews,
              engagement: Number((c.engagement * 100).toFixed(2)),
            })),
          ]),
        ),
        /** 최근 글 원본 — 시간대별 편차를 보기 위해 */
        recent: threads.posts.slice(0, 30).map((p) => ({
          at: p.timestamp,
          service: p.service,
          copy: p.copyKey,
          views: p.views,
          likes: p.likes,
          replies: p.replies,
        })),
      },

      traffic: ga,

      automation: {
        ok: runs.ok,
        error: runs.error ?? null,
        total: runs.runs.length,
        failed: failed.length,
        recentFailures: failed.slice(0, 5).map((r) => ({
          at: r.createdAt,
          name: r.name,
          conclusion: r.conclusion,
          url: r.url,
        })),
      },
    },
    { headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } },
  );
}
