/**
 * X(트위터) 자동 게시 스크립트.
 *
 * 소재는 scripts/variants.mjs에서 스레드와 함께 관리한다.
 * 같은 시각에 스레드와 X에 같은 소재가 나가고, A/B가 번갈아 교대한다.
 *
 * 인증은 OAuth 1.0a 유저 컨텍스트를 쓴다.
 * (OAuth 2.0은 토큰이 2시간마다 만료돼 자동화에 불리하다. 1.0a 토큰은 만료가 없다.)
 *
 * 환경변수(4개 전부 필요):
 *   X_API_KEY            = Consumer Key (API Key)
 *   X_API_SECRET         = Consumer Secret (API Key Secret)
 *   X_ACCESS_TOKEN       = Access Token
 *   X_ACCESS_SECRET      = Access Token Secret
 * 선택:
 *   SITE_URL, SERVICE=조선|촌수|운세|성씨, POST_ID=..., X_SKIP_MEDIA=1 (이미지 없이 텍스트만)
 *
 * 하나라도 없으면 초안만 출력하고 정상 종료한다(dry-run).
 */

import crypto from "node:crypto";
import { pickPost } from "./variants.mjs";

const KEY = process.env.X_API_KEY;
const SECRET = process.env.X_API_SECRET;
const TOKEN = process.env.X_ACCESS_TOKEN;
const TOKEN_SECRET = process.env.X_ACCESS_SECRET;

const TWEETS_URL = "https://api.x.com/2/tweets";
const MEDIA_URL = "https://api.x.com/2/media/upload";

/** RFC 3986 퍼센트 인코딩. OAuth 서명은 이 규칙을 정확히 지켜야 통과한다. */
function enc(s) {
  return encodeURIComponent(String(s)).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

/**
 * OAuth 1.0a Authorization 헤더를 만든다.
 * 서명 기준 문자열에는 쿼리 파라미터만 들어간다. JSON 본문은 서명 대상이 아니다.
 */
function authHeader(method, url, extraParams = {}) {
  const oauth = {
    oauth_consumer_key: KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: TOKEN,
    oauth_version: "1.0",
  };

  const all = { ...oauth, ...extraParams };
  const paramString = Object.keys(all)
    .sort()
    .map((k) => `${enc(k)}=${enc(all[k])}`)
    .join("&");

  const base = [method.toUpperCase(), enc(url.split("?")[0]), enc(paramString)].join("&");
  const signingKey = `${enc(SECRET)}&${enc(TOKEN_SECRET)}`;
  oauth.oauth_signature = crypto.createHmac("sha1", signingKey).update(base).digest("base64");

  return (
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${enc(k)}="${enc(oauth[k])}"`)
      .join(", ")
  );
}

/**
 * 이미지를 X에 올리고 media_id를 받는다.
 * 실패하면 null을 돌려주고, 호출한 쪽은 텍스트만 올린다.
 */
async function uploadMedia(imageUrl) {
  const res = await fetch(imageUrl);
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) {
    console.log(`이미지 접근 불가 (${res.status} ${type}) — 텍스트만 올립니다`);
    return null;
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  console.log(`이미지 내려받음: ${(bytes.length / 1024).toFixed(0)}KB (${type})`);

  const form = new FormData();
  form.append("media", new Blob([bytes], { type }), "card.png");
  form.append("media_category", "tweet_image");

  const up = await fetch(MEDIA_URL, {
    method: "POST",
    headers: { Authorization: authHeader("POST", MEDIA_URL) },
    body: form,
  });

  const body = await up.text();
  if (!up.ok) {
    console.log(`이미지 업로드 실패 (${up.status}): ${body.slice(0, 300)} — 텍스트만 올립니다`);
    return null;
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    console.log("이미지 업로드 응답을 해석하지 못했습니다 — 텍스트만 올립니다");
    return null;
  }

  const id = json?.data?.id ?? json?.id ?? json?.media_id_string;
  if (!id) {
    console.log(`media_id를 찾지 못했습니다: ${body.slice(0, 300)} — 텍스트만 올립니다`);
    return null;
  }
  return String(id);
}

async function tweet(text, mediaId) {
  const payload = mediaId ? { text, media: { media_ids: [mediaId] } } : { text };

  const res = await fetch(TWEETS_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader("POST", TWEETS_URL),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`게시 실패 ${res.status}: ${body.slice(0, 500)}`);
  return JSON.parse(body);
}

// ── 실행 ──

const v = pickPost();
const text = v.textX ?? v.text;

console.log(`[X] ${v.label} / 문구 "${v.id}"`);
console.log("─".repeat(50));
console.log(text);
console.log("─".repeat(50));
console.log(`이미지: ${v.image}`);

if (!KEY || !SECRET || !TOKEN || !TOKEN_SECRET) {
  const missing = [
    ["X_API_KEY", KEY],
    ["X_API_SECRET", SECRET],
    ["X_ACCESS_TOKEN", TOKEN],
    ["X_ACCESS_SECRET", TOKEN_SECRET],
  ]
    .filter(([, val]) => !val)
    .map(([name]) => name);
  console.log(`\n비어 있는 값: ${missing.join(", ")}`);
  console.log("X 키가 아직 없어 초안만 출력했습니다 (dry-run). 스레드 게시에는 영향 없습니다.");
  process.exit(0);
}

try {
  let mediaId = null;
  if (!process.env.X_SKIP_MEDIA) {
    try {
      mediaId = await uploadMedia(v.image);
    } catch (e) {
      console.log(`이미지 처리 중 오류: ${e.message} — 텍스트만 올립니다`);
    }
  }

  const res = await tweet(text, mediaId);
  const id = res?.data?.id;
  console.log(`\n[X] 게시 완료 [${v.label} / ${v.id}]: ${id} (이미지 ${mediaId ? "첨부됨" : "없음"})`);
  if (id) console.log(`확인: https://x.com/i/status/${id}`);
} catch (e) {
  console.error("\n[X] 실패:", e.message);
  process.exit(1);
}
