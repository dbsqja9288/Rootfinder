/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * 소재(A/B 문안)는 scripts/variants.mjs 한 곳에서 관리한다.
 * 문안을 바꾸려면 그 파일만 고치면 스레드와 X에 함께 반영된다.
 *
 * 환경변수:
 *   THREADS_USER_ID / THREADS_ACCESS_TOKEN / SITE_URL
 *   SERVICE=조선|촌수|운세|성씨   (수동 지정. 없으면 시간대에 따라 자동 교대)
 *
 * 원글(궁금증) → 댓글 5개(이야기) → 마지막 댓글에 링크 순으로 올린다.
 *   POST_ID=질문                  (수동 지정. 없으면 날짜에 따라 자동 교대)
 */

import { pickPost } from "./variants.mjs";

const USER_ID = process.env.THREADS_USER_ID;
const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = "https://graph.threads.net/v1.0";

/** 이미지 컨테이너는 처리에 시간이 걸리므로 준비될 때까지 확인한다 */
async function waitReady(id, tries = 12) {
  for (let i = 0; i < tries; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const url = new URL(`${API}/${id}`);
    url.searchParams.set("fields", "status,error_message");
    url.searchParams.set("access_token", TOKEN);
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === "FINISHED") return true;
    if (data.status === "ERROR" || data.status === "EXPIRED") {
      throw new Error(`컨테이너 처리 실패: ${data.error_message ?? data.status}`);
    }
  }
  throw new Error("컨테이너가 준비되지 않음 (타임아웃)");
}

async function post({ text, image }) {
  let img = image;

  // 이미지가 실제로 접근 가능한지 먼저 확인한다
  if (img) {
    try {
      const probe = await fetch(img);
      const type = probe.headers.get("content-type") ?? "";
      if (!probe.ok || !type.startsWith("image/")) {
        console.log(`이미지 접근 불가 (${probe.status} ${type}) — 텍스트로 전환`);
        img = null;
      }
    } catch (e) {
      console.log(`이미지 확인 실패: ${e.message} — 텍스트로 전환`);
      img = null;
    }
  }

  const create = async (withImage) => {
    const u = new URL(`${API}/${USER_ID}/threads`);
    u.searchParams.set("text", text);
    u.searchParams.set("access_token", TOKEN);
    if (withImage) {
      u.searchParams.set("media_type", "IMAGE");
      u.searchParams.set("image_url", withImage);
    } else {
      u.searchParams.set("media_type", "TEXT");
    }
    return fetch(u, { method: "POST" });
  };

  let res = await create(img);
  if (!res.ok && img) {
    console.log(`이미지 첨부 거부 (${res.status}) — 텍스트로 재시도`);
    img = null;
    res = await create(null);
  }
  if (!res.ok) throw new Error(`컨테이너 생성 실패 ${res.status}: ${await res.text()}`);

  const { id } = await res.json();
  if (img) await waitReady(id);
  else await new Promise((r) => setTimeout(r, 2000));

  const pub = new URL(`${API}/${USER_ID}/threads_publish`);
  pub.searchParams.set("creation_id", id);
  pub.searchParams.set("access_token", TOKEN);
  const published = await fetch(pub, { method: "POST" });
  if (!published.ok) throw new Error(`게시 실패 ${published.status}: ${await published.text()}`);

  return { ...(await published.json()), withImage: Boolean(img) };
}

/**
 * 원글 아래에 댓글을 단다.
 *
 * 원글에는 링크를 넣지 않고 궁금증만 남긴다. 이야기는 댓글로 풀고
 * **마지막 댓글에만 링크**를 둔다. 댓글이 몇 개 달려 있는 글에 사람들이
 * 더 들어오기도 하고, 본문에 링크가 박힌 글보다 광고처럼 덜 읽힌다.
 *
 * 스레드 한도: 게시물 250개/일, 답글 1000개/일 (따로 센다).
 * 하루 96회 × 댓글 5개 = 480개라 답글 한도의 절반이다.
 */
async function reply(rootId, text) {
  const u = new URL(`${API}/${USER_ID}/threads`);
  u.searchParams.set("media_type", "TEXT");
  u.searchParams.set("text", text);
  u.searchParams.set("reply_to_id", rootId);
  u.searchParams.set("access_token", TOKEN);

  const res = await fetch(u, { method: "POST" });
  if (!res.ok) throw new Error(`댓글 컨테이너 실패 ${res.status}: ${await res.text()}`);
  const { id } = await res.json();

  await new Promise((r) => setTimeout(r, 1500));

  const pub = new URL(`${API}/${USER_ID}/threads_publish`);
  pub.searchParams.set("creation_id", id);
  pub.searchParams.set("access_token", TOKEN);
  const done = await fetch(pub, { method: "POST" });
  if (!done.ok) throw new Error(`댓글 게시 실패 ${done.status}: ${await done.text()}`);
  return (await done.json()).id;
}

const v = pickPost();

console.log(`${v.label} / 문구 "${v.id}"`);
console.log("─".repeat(50));
console.log(v.text);
v.replies.forEach((r, i) => {
  console.log("─".repeat(50));
  console.log(`[댓글 ${i + 1}] ${r}`);
});
console.log("─".repeat(50));
console.log(`이미지: ${v.image}`);

if (!USER_ID || !TOKEN) {
  console.log("\n토큰이 없어 초안만 출력했습니다 (dry-run).");
  process.exit(0);
}

let res;
try {
  res = await post(v);
} catch (e) {
  console.error("\n실패:", e.message);
  process.exit(1);
}

// 게시가 끝난 뒤의 코드는 try 밖에 둔다.
// 안에 두면 로그 한 줄이 잘못돼도 "게시 실패"로 잡혀서,
// 실제로는 올라간 글을 실패로 착각하게 된다.
console.log(
  `\n게시 완료 [${v.label} / ${v.id}]: ${res.id} (이미지 ${res.withImage ? "첨부됨" : "없음"})`,
);

// 댓글은 하나씩 순서대로. 중간에 하나가 실패해도 나머지는 계속 시도한다.
// 원글은 이미 올라갔으므로 여기서 죽으면 링크 없는 글만 남는다.
let posted = 0;
for (const [i, text] of v.replies.entries()) {
  try {
    await reply(res.id, text);
    posted++;
    console.log(`  댓글 ${i + 1}/${v.replies.length} 완료`);
  } catch (e) {
    console.error(`  댓글 ${i + 1} 실패: ${e.message}`);
  }
  // 다섯 개를 한꺼번에 쏟아내면 사람이 쓴 것처럼 보이지 않는다
  await new Promise((r) => setTimeout(r, 2500));
}

if (posted < v.replies.length) {
  console.error(`\n댓글 ${v.replies.length - posted}개가 실패했습니다. 링크 댓글이 빠졌을 수 있습니다.`);
  process.exit(1);
}
