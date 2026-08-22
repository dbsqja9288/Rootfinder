/**
 * 마케팅 대시보드가 쓰는 데이터 수집기.
 *
 * 스레드는 공식 API로 지표를 바로 가져올 수 있다.
 * X는 무료 등급에서 조회 API가 막혀 있어(쓰기만 가능) 링크로 안내한다.
 * 사이트 트래픽은 Vercel Analytics 대시보드로 안내한다(조회 API는 유료).
 */

const API = "https://graph.threads.net/v1.0";

/**
 * 어떤 서비스를 홍보한 글인지, 어느 문구였는지 되짚는다.
 * scripts/variants.mjs와 짝을 이룬다.
 *
 * 서비스는 **링크 주소**로 가른다. 문구를 바꿔도 이 규칙은 안 깨진다.
 * 문구는 **첫 줄**로 가른다. 문구마다 첫 줄이 다르기 때문에 그것으로 충분하고,
 * 새 문구를 추가해도 코드를 고칠 필요가 없다.
 */
export type ServiceKey = "조선" | "촌수" | "운세" | "성씨";

export const SERVICE_LABEL: Record<ServiceKey, string> = {
  조선: "조선시대 나는?",
  촌수: "몇 촌일까",
  운세: "가문 운세",
  성씨: "성씨 찾기",
};

export const SERVICE_ORDER: ServiceKey[] = ["조선", "촌수", "운세", "성씨"];

export function serviceOf(text: string): ServiceKey | null {
  if (!text.includes("rootfinder")) return null; // 우리가 올린 글이 아님
  if (text.includes("/joseon")) return "조선";
  if (text.includes("/kin")) return "촌수";
  if (text.includes("/fortune")) return "운세";
  return "성씨";
}

/** 문구를 구분하는 열쇠 = 첫 줄. 표에 그대로 보여줘도 읽히는 길이다. */
export function copyKeyOf(text: string): string {
  return (text.split("\n").find((l) => l.trim().length > 0) ?? "").trim().slice(0, 40);
}

export type ThreadPost = {
  id: string;
  text: string;
  timestamp: string;
  permalink?: string;
  service: ServiceKey | null;
  copyKey: string;
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
          service: serviceOf(text),
          copyKey: copyKeyOf(text),
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

export type Stat = {
  key: string;
  label: string;
  count: number;
  views: number;
  likes: number;
  replies: number;
  reposts: number;
  avgViews: number;
  engagement: number;
};

function agg(key: string, label: string, mine: ThreadPost[]): Stat {
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
    // 반응률 = (좋아요+댓글+리포스트) ÷ 조회수
    engagement: views ? (likes + replies + reposts) / views : 0,
  };
}

/** 서비스별 성적. */
export function summarize(posts: ThreadPost[]): Stat[] {
  return SERVICE_ORDER.map((k) => agg(k, SERVICE_LABEL[k], posts.filter((p) => p.service === k)));
}

/**
 * 서비스 안에서 문구별 성적.
 *
 * 1주일 테스트가 끝나면 이 표에서 위 두 개만 남기면 된다.
 * 판단 기준은 **글당 평균 조회수**다. 총합은 올린 횟수가 많은 쪽이 유리해서 못 쓴다.
 * 조회수가 비슷하면 반응률(좋아요+댓글+리포스트 비율)이 높은 쪽이 바이럴에 가깝다.
 */
export function byCopy(posts: ThreadPost[]): Record<ServiceKey, Stat[]> {
  const out = {} as Record<ServiceKey, Stat[]>;
  for (const svc of SERVICE_ORDER) {
    const mine = posts.filter((p) => p.service === svc);
    const groups = new Map<string, ThreadPost[]>();
    for (const p of mine) {
      const k = p.copyKey || "(빈 글)";
      groups.set(k, [...(groups.get(k) ?? []), p]);
    }
    out[svc] = [...groups.entries()]
      .map(([k, list]) => agg(k, k, list))
      .sort((a, b) => b.avgViews - a.avgViews || b.engagement - a.engagement);
  }
  return out;
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
