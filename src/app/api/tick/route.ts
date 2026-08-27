/**
 * 예약 게시의 **심장**.
 *
 * ┌─ 왜 이게 생겼나 ────────────────────────────────────────────────────┐
 * │ 깃허브 액션의 예약 실행(cron)이 신뢰할 수 없다는 게 드러났다.        │
 * │   2026-08-26  12시간 무게시                                          │
 * │   2026-08-27  20시간 무게시 (분을 흩어도 살아나지 않음)              │
 * │ 워크플로는 켜져 있고, 사용량도 0/2,000분이고, 설정도 멀쩡한데        │
 * │ 깃허브가 그냥 안 걸어준다. 무료 등급 예약 실행의 알려진 한계다.      │
 * │                                                                      │
 * │ 그래서 시계를 **Vercel Cron**으로 옮겼다. Pro 요금제는 분 단위로     │
 * │ 정확히 돈다. Vercel이 시간 맞춰 이 주소를 두드리면, 이 코드가        │
 * │ 깃허브 워크플로를 **사람이 Run workflow를 누른 것처럼** 실행시킨다.  │
 * │                                                                      │
 * │ 수동 실행(workflow_dispatch)은 지금까지 한 번도 실패한 적이 없다.    │
 * │ 못 믿을 건 '예약'이지 '실행'이 아니다.                               │
 * │                                                                      │
 * │   Vercel Cron ──(GET /api/tick?w=social)──> 여기 ──> 깃허브 워크플로 │
 * │                                                                      │
 * │ 게시 코드(scripts/social-post.mjs)는 한 줄도 안 바뀐다. 스레드 토큰도 │
 * │ 깃허브 Secrets에 그대로 둔다. 이 파일은 방아쇠만 당긴다.             │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * 필요한 환경변수 (Vercel에 넣는다):
 *   CRON_SECRET           아무 긴 문자열. Vercel이 이 값을 Bearer 토큰으로 붙여 보낸다.
 *   GITHUB_DISPATCH_TOKEN 깃허브 토큰. 이 저장소의 Actions 실행 권한만 있으면 된다.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REPO = process.env.GITHUB_REPO ?? "dbsqja9288/Rootfinder";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

/** 부를 수 있는 워크플로는 여기 적힌 것뿐이다. 주소로 아무 워크플로나 돌릴 수 없게 막는다. */
const ALLOWED: Record<string, string> = {
  social: "social.yml", // 스레드 게시
  metrics: "metrics.yml", // 스레드 성적 수집
};

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  });
}

/**
 * 방금 돌지 않았는지 확인한다.
 *
 * 깃허브 예약(cron)을 아직 지우지 않았다. 지금은 죽어 있지만 되살아날 수 있고,
 * 그러면 같은 시각에 깃허브와 Vercel이 **둘 다** 게시해 하루 36번이 된다.
 * 그건 아무것도 안 올라가는 것만큼이나 나쁘다.
 *
 * 그래서 부르기 전에 "최근 20분 안에 이미 돌았나"를 본다. 돌았으면 건너뛴다.
 * 예약 사이 간격이 가장 좁은 곳이 32분이라 20분 창은 안전하다.
 */
async function ranRecently(file: string, token: string, minutes = 20) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${file}/runs?per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "rootfinder-tick",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null; // 확인 못 했으면 막지 않는다 — 안 올라가는 쪽이 더 나쁘다
    const body = await res.json();
    const last = body?.workflow_runs?.[0]?.created_at;
    if (!last) return null;
    const ago = (Date.now() - new Date(last).getTime()) / 60000;
    return ago < minutes ? { last, agoMinutes: Math.round(ago) } : null;
  } catch {
    return null;
  }
}

/** 깃허브에게 "이 워크플로 지금 돌려라"라고 시킨다. 성공하면 204가 돌아온다. */
async function dispatch(file: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${file}/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "rootfinder-tick",
      },
      body: JSON.stringify({ ref: BRANCH }),
      cache: "no-store",
    },
  );

  if (res.status === 204) return { ok: true as const };

  // 토큰이 오류 메시지에 섞여 나갈 일은 없지만, 길이를 잘라 로그를 깨끗하게 둔다
  const detail = (await res.text().catch(() => "")).slice(0, 300);
  return { ok: false as const, status: res.status, detail };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const which = url.searchParams.get("w") ?? "social";
  const file = ALLOWED[which];
  if (!file) return json(400, { ok: false, error: `모르는 워크플로: ${which}` });

  // ── 문지기 ────────────────────────────────────────────────
  // Vercel Cron은 CRON_SECRET 값을 Authorization: Bearer 로 붙여 보낸다.
  // 이 열쇠가 없으면 아무나 이 주소를 두드려 스레드에 글을 쏟아낼 수 있다.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return json(503, {
      ok: false,
      error: "CRON_SECRET 환경변수가 없습니다. Vercel에 넣어 주세요.",
    });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return json(401, { ok: false, error: "열쇠가 맞지 않습니다." });
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    return json(503, {
      ok: false,
      error: "GITHUB_DISPATCH_TOKEN 환경변수가 없습니다. Vercel에 넣어 주세요.",
    });
  }

  const recent = await ranRecently(file, token);
  if (recent) {
    return json(200, {
      ok: true,
      skipped: "최근에 이미 돌았습니다 (중복 게시 방지)",
      lastRunAt: recent.last,
      minutesAgo: recent.agoMinutes,
      workflow: file,
      at: new Date().toISOString(),
    });
  }

  const result = await dispatch(file, token);

  return json(result.ok ? 200 : 502, {
    ...result,
    workflow: file,
    repo: REPO,
    ref: BRANCH,
    // 어느 예약이 이 호출을 일으켰는지. 여러 시각이 같은 주소를 쓰므로 로그에서 이걸로 가른다.
    schedule: req.headers.get("x-vercel-cron-schedule") ?? null,
    at: new Date().toISOString(),
  });
}
