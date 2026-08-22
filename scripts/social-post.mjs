/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * 소재(A/B 문안)는 scripts/variants.mjs 한 곳에서 관리한다.
 * 문안을 바꾸려면 그 파일만 고치면 스레드와 X에 함께 반영된다.
 *
 * 환경변수:
 *   THREADS_USER_ID / THREADS_ACCESS_TOKEN / SITE_URL
 *   SERVICE=조선|촌수|운세|성씨   (수동 지정. 없으면 시간대에 따라 자동 교대)
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

const v = pickPost();

console.log(`${v.label} / 문구 "${v.id}"`);
console.log("─".repeat(50));
console.log(v.text);
console.log("─".repeat(50));
console.log(`이미지: ${v.image}`);

if (!USER_ID || !TOKEN) {
  console.log("\n토큰이 없어 초안만 출력했습니다 (dry-run).");
  process.exit(0);
}

try {
  const res = await post(v);
  console.log(`\n게시 완료 [변형 ${key}]: ${res.id} (이미지 ${res.withImage ? "첨부됨" : "없음"})`);
} catch (e) {
  console.error("\n실패:", e.message);
  process.exit(1);
}
