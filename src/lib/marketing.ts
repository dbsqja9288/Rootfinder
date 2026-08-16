/**
 * 마케팅 대시보드가 쓰는 데이터 수집기.
 *
 * 스레드는 공식 API로 지표를 바로 가져올 수 있다.
 * X는 무료 등급에서 조회 API가 막혀 있어(쓰기만 가능) 링크로 안내한다.
 * 사이트 트래픽은 Vercel Analytics 대시보드로 안내한다(조회 API는 유료).
 */

const API = "https://graph.threads.net/v1.0";

/** 어떤 소재로 올린 글인지 본문으로 되짚는다. scripts/variants.mjs와 짝을 이룬다. */
export const VARIANT_SIGNS: { key: "A" | "B"; label: string; needle: string }[] = [
  { key: "A", label: "MBTI 자극", needle: "삼도수군통제사" },
  { key: "B", label: "정보 욕구", needle: "상위 몇퍼센트" },
];

export function variantOf(text: string): "A" | "B" | null {
  return VARIANT_SIGNS.find((v) => text.includes(v.needle))?.key ?? null;
}

export type ThreadPost = {
  id: string;
  text: string;
  timestamp: string;
  permalink?: string;
  variant: "A" | "B" | null;
  views: number;
  likes: number;
  replies: number;
  reposts: number;
  quotes: number;
};

export type ThreadsData = {
  ok: boolean;
  error?: string;
  username?: string;
  followers?: number | null;
  posts: ThreadPost[];
};

async function j(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

function metric(insights: unknown, name: string): number {
  const data = (insights as { data?: { name: string; values?: { value: number }[]; total_value?: { value: number } }[] })
    ?.data;
  const row = data?.find((d) => d.name === name);
  return row?.values?.[0]?.value ?? row?.total_value?.value ?? 0;
}

export async function loadThreads(limit = 30): Promise<ThreadsData> {
  const userId = process.env.THREADS_USER_ID;
  const token = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !token) {
    return { ok: false, error: "THREADS_USER_ID / THREADS_ACCESS_TOKEN 환경변수가 없습니다.", posts: [] };
  }

  try {
    const me = await j(`${API}/me?fields=username&access_token=${token}`);

    // 팔로워 수는 threads_manage_insights 권한이 있어야 나온다. 없으면 그냥 비운다.
    let followers: number | null = null;
    try {
      const f = await j(`${API}/${userId}/threads_insights?metric=followers_count&access_token=${token}`);
      followers = metric(f, "followers_count") || null;
    } catch {
      followers = null;
    }

    const list = await j(
      `${API}/${userId}/threads?fields=id,text,timestamp,permalink&limit=${limit}&access_token=${token}`
    );

    const raw: { id: string; text?: string; timestamp: string; permalink?: string }[] = list?.data ?? [];

    const posts = await Promise.all(
      raw.map(async (p) => {
        let ins: unknown = null;
        try {
          ins = await j(
            `${API}/${p.id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${token}`
          );
        } catch {
          // 올린 지 얼마 안 된 글은 지표가 아직 없다
        }
        const text = p.text ?? "";
        return {
          id: p.id,
          text,
          timestamp: p.timestamp,
          permalink: p.permalink,
          variant: variantOf(text),
          views: metric(ins, "views"),
          likes: metric(ins, "likes"),
          replies: metric(ins, "replies"),
          reposts: metric(ins, "reposts"),
          quotes: metric(ins, "quotes"),
        };
      })
    );

    return { ok: true, username: me?.username, followers, posts };
  } catch (e) {
    return { ok: false, error: (e as Error).message, posts: [] };
  }
}

export type VariantStat = {
  key: "A" | "B";
  label: string;
  count: number;
  views: number;
  likes: number;
  replies: number;
  reposts: number;
  avgViews: number;
  engagement: number; // (좋아요+댓글+리포스트) / 조회수
};

export function summarize(posts: ThreadPost[]): VariantStat[] {
  return VARIANT_SIGNS.map(({ key, label }) => {
    const mine = posts.filter((p) => p.variant === key);
    const sum = (f: (p: ThreadPost) => number) => mine.reduce((a, p) => a + f(p), 0);
    const views = sum((p) => p.views);
    const likes = sum((p) => p.likes);
    const replies = sum((p) => p.replies);
    const reposts = sum((p) => p.reposts);
    return {
      key,
      label,
      count: mine.length,
      views,
      likes,
      replies,
      reposts,
      avgViews: mine.length ? Math.round(views / mine.length) : 0,
      engagement: views ? (likes + replies + reposts) / views : 0,
    };
  });
}

export type RunRow = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  createdAt: string;
  url: string;
};

/**
 * GitHub Actions 실행 이력. 공개 저장소라 토큰 없이 읽을 수 있다.
 * "어젯밤 여섯 번 다 올라갔나?"를 한눈에 보기 위한 것이다.
 */
export async function loadRuns(limit = 12): Promise<{ ok: boolean; error?: string; runs: RunRow[] }> {
  const repo = process.env.GITHUB_REPO ?? "dbsqja9288/Rootfinder";
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/actions/runs?per_page=${limit}`,
      { cache: "no-store", headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const runs: RunRow[] = (data?.workflow_runs ?? []).map(
      (r: { id: number; name: string; status: string; conclusion: string | null; created_at: string; html_url: string }) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        conclusion: r.conclusion,
        createdAt: r.created_at,
        url: r.html_url,
      })
    );
    return { ok: true, runs };
  } catch (e) {
    return { ok: false, error: (e as Error).message, runs: [] };
  }
}
