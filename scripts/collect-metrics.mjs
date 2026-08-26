/**
 * 스레드 성적표를 받아 저장소에 파일로 남긴다.
 *
 * ┌─ 왜 이걸 만들었나 ────────────────────────────────────────────────┐
 * │ 사이트(Vercel)가 스레드 숫자를 보려면 토큰이 필요한데, 토큰은      │
 * │ 이미 깃허브 Secrets 안에 있고 **한 번 넣으면 다시 꺼내볼 수 없다.**│
 * │ 그래서 같은 토큰을 Vercel에 또 넣으려면 메타에서 새로 발급받아야   │
 * │ 하는데, 그건 사람 손이 가는 일이고 비밀 사본만 하나 더 늘어난다.  │
 * │                                                                   │
 * │ 방향을 뒤집었다. 토큰을 이미 가진 쪽(깃허브 액션)이 숫자를 받아    │
 * │ 저장소에 **평범한 JSON 파일**로 떨궈 둔다. 사이트는 그 파일만 읽고,│
 * │ 사람도 깃허브에서 그냥 열어볼 수 있다. 토큰은 한 군데에만 남는다. │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * 분류(어느 서비스 글인가, 어느 문구인가)는 **여기서 하지 않는다.**
 * 그 규칙은 src/lib/marketing.ts 한 곳에만 두고, 이 파일은 원본만 옮긴다.
 * 규칙이 바뀌어도 예전에 모아둔 데이터를 다시 해석할 수 있어야 하기 때문이다.
 *
 * 필요한 환경변수(깃허브 Secrets):
 *   THREADS_USER_ID
 *   THREADS_ACCESS_TOKEN
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://graph.threads.net/v1.0";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "data", "threads-metrics.json");

/** 한 번에 받아올 글 수. 하루 18개씩 올라가므로 100이면 대엿새치다. */
const LIMIT = 100;
/** 파일에 쌓아 둘 최대 글 수. 이걸 넘으면 오래된 것부터 버린다. */
const KEEP = 400;

const userId = process.env.THREADS_USER_ID;
const token = process.env.THREADS_ACCESS_TOKEN;

if (!userId || !token) {
  console.error("THREADS_USER_ID / THREADS_ACCESS_TOKEN 이 없습니다. 아무것도 하지 않고 끝냅니다.");
  process.exit(0); // 실패로 만들지 않는다 — 이건 있으면 좋은 것이지 필수가 아니다
}

async function j(url) {
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
  return body;
}

/** insights 응답에서 숫자 하나 꺼내기 */
function metric(ins, name) {
  const row = ins?.data?.find((d) => d.name === name);
  return row?.values?.[0]?.value ?? row?.total_value?.value ?? 0;
}

/** 토큰이 로그에 새어나가지 않게, 오류 메시지에서 토큰 문자열을 지운다. */
function safe(msg) {
  return String(msg).split(token).join("[토큰가림]");
}

async function main() {
  const me = await j(`${API}/me?fields=username&access_token=${token}`);

  let followers = null;
  try {
    const f = await j(`${API}/${userId}/threads_insights?metric=followers_count&access_token=${token}`);
    followers = metric(f, "followers_count") || null;
  } catch {
    // threads_manage_insights 권한이 없으면 안 나온다. 없어도 그만이다.
  }

  const list = await j(
    `${API}/${userId}/threads?fields=id,text,timestamp,permalink&limit=${LIMIT}&access_token=${token}`
  );

  const fresh = [];
  for (const p of list?.data ?? []) {
    let ins = null;
    try {
      ins = await j(`${API}/${p.id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${token}`);
    } catch {
      // 올린 지 얼마 안 된 글은 지표가 아직 없다
    }
    fresh.push({
      id: p.id,
      text: p.text ?? "",
      timestamp: p.timestamp,
      permalink: p.permalink ?? null,
      views: metric(ins, "views"),
      likes: metric(ins, "likes"),
      replies: metric(ins, "replies"),
      reposts: metric(ins, "reposts"),
      quotes: metric(ins, "quotes"),
    });
  }

  // 예전에 모은 것과 합친다.
  // 같은 글이면 **새 숫자로 덮는다** — 조회수는 시간이 지나며 계속 오르기 때문이다.
  let old = [];
  try {
    old = JSON.parse(await readFile(OUT, "utf-8"))?.posts ?? [];
  } catch {
    // 첫 실행
  }

  const byId = new Map();
  for (const p of old) byId.set(p.id, p);
  for (const p of fresh) byId.set(p.id, p);

  const posts = [...byId.values()]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, KEEP);

  const out = {
    ok: true,
    generatedAt: new Date().toISOString(),
    username: me?.username ?? null,
    followers,
    count: posts.length,
    posts,
  };

  await mkdir(dirname(OUT), { recursive: true });
  // 줄바꿈을 넣어 저장한다 — 깃 diff에서 무엇이 바뀌었는지 사람이 읽을 수 있어야 한다
  await writeFile(OUT, JSON.stringify(out, null, 1) + "\n", "utf-8");

  console.log(`글 ${posts.length}개 저장 (이번에 새로 받은 것 ${fresh.length}개, 팔로워 ${followers ?? "?"})`);
}

main().catch((e) => {
  console.error("실패:", safe(e.message));
  process.exit(1);
});
