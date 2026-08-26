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

/**
 * 원글에는 링크를 넣지 않고 해시태그만 둔다(링크는 마지막 댓글에 있다).
 * 그래서 서비스는 **태그**로 가르고, 태그가 없는 옛 글은 링크로 가른다.
 */
const TAG_TO_SERVICE: [string, ServiceKey][] = [
  ["#MBTI", "조선"],
  ["#조선시대", "조선"], // 태그를 #MBTI로 바꾸기 전에 올린 글
  ["#가족", "촌수"],
  ["#사주", "운세"],
  ["#족보", "성씨"],
  ["#본관", "성씨"], // A/B 시절 B 소재가 쓰던 태그
];

export function serviceOf(text: string): ServiceKey | null {
  for (const [tag, svc] of TAG_TO_SERVICE) {
    if (text.includes(tag)) return svc;
  }
  // 태그 방식 이전에 올라간 글들(본문에 링크가 있던 시절)
  if (!text.includes("rootfinder")) return null;
  if (text.includes("/joseon")) return "조선";
  if (text.includes("/kin")) return "촌수";
  if (text.includes("/fortune")) return "운세";
  return "성씨";
}

/**
 * 링크가 든 마지막 댓글인지.
 * 댓글은 원글의 성적이 아니므로 집계에서 뺀다. 섞이면 평균 조회수가 왜곡된다.
 */
export function isLinkReply(text: string): boolean {
  return text.includes("rootfinder.kr") && !TAG_TO_SERVICE.some(([t]) => text.includes(t));
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
  /** 숫자를 어디서 가져왔는지. "file"이면 깃허브 액션이 받아 둔 것을 읽은 것이다. */
  source?: "live" | "file";
  /** source가 "file"일 때, 그 파일이 만들어진 시각 */
  generatedAt?: string | null;
};

/** data/threads-metrics.json 의 생김새 */
type Snapshot = {
  ok?: boolean;
  generatedAt?: string | null;
  username?: string | null;
  followers?: number | null;
  posts?: {
    id: string;
    text: string;
    timestamp: string;
    permalink?: string | null;
    views: number;
    likes: number;
    replies: number;
    reposts: number;
    quotes: number;
  }[];
};

/**
 * 깃허브 액션이 받아 저장소에 커밋해 둔 파일에서 읽는다.
 *
 * ┌─ 왜 이 길이 있나 ────────────────────────────────────────────────┐
 * │ 스레드 토큰은 깃허브 Secrets에 있고, 한 번 넣으면 다시 꺼내볼 수  │
 * │ 없다. 그래서 같은 값을 Vercel에 또 넣으려면 메타에서 새로 발급받아│
 * │ 야 하고, 비밀 사본만 하나 더 늘어난다.                            │
 * │                                                                   │
 * │ 그래서 토큰을 이미 가진 쪽(깃허브 액션)이 하루 한 번 숫자를 받아  │
 * │ data/threads-metrics.json 에 커밋한다. 사이트는 그 파일만 읽는다. │
 * │ 토큰은 한 군데에만 남고, 사람이 손댈 일도 없다.                   │
 * │   → .github/workflows/metrics.yml, scripts/collect-metrics.mjs    │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * 어느 서비스·어느 문구인지는 **파일에 적혀 있지 않다.** 그 분류 규칙은
 * 이 파일 위쪽에 한 벌만 두고, 읽을 때마다 다시 적용한다.
 * 그래야 규칙을 고쳤을 때 예전에 모아 둔 글까지 새 규칙으로 다시 읽힌다.
 */
async function fromRepoFile(limit: number): Promise<ThreadsData> {
  try {
    const mod = await import("../../data/threads-metrics.json");
    const snap = ((mod as { default?: unknown }).default ?? mod) as unknown as Snapshot;

    if (!snap?.ok || !snap.posts?.length) {
      return {
        ok: false,
        error:
          "스레드 토큰이 없고, 깃허브 액션이 받아 둔 파일도 아직 비어 있습니다. " +
          "Actions 탭에서 '스레드 성적 수집'을 한 번 실행해 보세요.",
        posts: [],
      };
    }

    return {
      ok: true,
      source: "file",
      generatedAt: snap.generatedAt ?? null,
      username: snap.username ?? undefined,
      followers: snap.followers ?? null,
      posts: snap.posts.slice(0, limit).map((p) => ({
        id: p.id,
        text: p.text,
        timestamp: p.timestamp,
        permalink: p.permalink ?? undefined,
        service: serviceOf(p.text),
        copyKey: copyKeyOf(p.text),
        views: p.views,
        likes: p.likes,
        replies: p.replies,
        reposts: p.reposts,
        quotes: p.quotes,
      })),
    };
  } catch (e) {
    return { ok: false, error: `저장된 성적 파일을 읽지 못했습니다: ${(e as Error).message}`, posts: [] };
  }
}

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

  // 토큰이 없으면 깃허브 액션이 받아 둔 파일로 간다. 이게 기본 경로다.
  if (!userId || !token) return fromRepoFile(limit);

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

    return { ok: true, source: "live", username: me?.username, followers, posts };
  } catch (e) {
    // 토큰이 만료됐거나 스레드가 잠시 안 될 때도 화면이 비지 않게 파일로 물러선다
    const saved = await fromRepoFile(limit);
    if (saved.ok) return { ...saved, error: `실시간 조회 실패(${(e as Error).message}) — 저장된 값으로 대신합니다.` };
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
  const roots = posts.filter((p) => !isLinkReply(p.text));
  return SERVICE_ORDER.map((k) => agg(k, SERVICE_LABEL[k], roots.filter((p) => p.service === k)));
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
    const mine = posts.filter((p) => p.service === svc && !isLinkReply(p.text));
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
