/**
 * 구글 애널리틱스(GA4) 숫자 읽어오기.
 *
 * ┌─ 왜 라이브러리를 안 쓰는가 ──────────────────────────────────┐
 * │ 공식 SDK는 무겁고, 여기서 필요한 건 보고서 두어 개뿐이다.     │
 * │ 서비스 계정으로 JWT를 만들어 토큰을 받고 REST로 물어보면 된다.│
 * │ node:crypto만 있으면 되므로 의존성이 늘지 않는다.             │
 * └────────────────────────────────────────────────────────────┘
 *
 * 필요한 환경변수 (Vercel에 넣는다. 앞에 NEXT_PUBLIC_을 붙이면 안 된다 —
 * 브라우저로 새어나가면 안 되는 값이다):
 *   GA4_PROPERTY_ID      숫자만. 예: 123456789
 *   GA4_CLIENT_EMAIL     서비스 계정 이메일
 *   GA4_PRIVATE_KEY      -----BEGIN PRIVATE KEY----- 로 시작하는 키
 */

import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** 서비스 계정 키로 서명한 JWT를 구글에 주고 액세스 토큰을 받는다. */
async function accessToken(email: string, key: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  // Vercel 환경변수에 넣으면 줄바꿈이 \n 두 글자로 들어오는 일이 많다
  const pem = key.replace(/\\n/g, "\n");
  const jwt = `${header}.${claim}.${b64url(signer.sign(pem))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    cache: "no-store",
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body?.error_description ?? `토큰 실패 ${res.status}`);
  return body.access_token as string;
}

type Row = { keys: string[]; values: number[] };

async function runReport(
  token: string,
  propertyId: string,
  body: Record<string, unknown>,
): Promise<Row[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `보고서 실패 ${res.status}`);

  return (json.rows ?? []).map((r: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
    keys: (r.dimensionValues ?? []).map((d) => d.value),
    values: (r.metricValues ?? []).map((m) => Number(m.value) || 0),
  }));
}

export type GaDay = { date: string; users: number; views: number; sessions: number };
export type GaPage = { path: string; views: number; avgSeconds: number };
export type GaSource = { source: string; sessions: number };

export type GaData = {
  ok: boolean;
  error?: string;
  /** 최근 14일 일별 */
  days: GaDay[];
  /** 어제 기준 인기 페이지 */
  pages: GaPage[];
  /** 어제 기준 유입 경로 */
  sources: GaSource[];
};

export async function loadGa(): Promise<GaData> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const email = process.env.GA4_CLIENT_EMAIL;
  const key = process.env.GA4_PRIVATE_KEY;

  if (!propertyId || !email || !key) {
    return {
      ok: false,
      error: "GA4_PROPERTY_ID / GA4_CLIENT_EMAIL / GA4_PRIVATE_KEY 환경변수가 없습니다.",
      days: [],
      pages: [],
      sources: [],
    };
  }

  try {
    const token = await accessToken(email, key);
    const range14 = [{ startDate: "14daysAgo", endDate: "yesterday" }];
    const range1 = [{ startDate: "yesterday", endDate: "yesterday" }];

    const [daily, pages, sources] = await Promise.all([
      runReport(token, propertyId, {
        dateRanges: range14,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(token, propertyId, {
        dateRanges: range1,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "userEngagementDuration" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 12,
      }),
      runReport(token, propertyId, {
        dateRanges: range1,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
    ]);

    return {
      ok: true,
      days: daily.map((r) => ({
        date: r.keys[0],
        users: r.values[0],
        views: r.values[1],
        sessions: r.values[2],
      })),
      pages: pages.map((r) => ({
        path: r.keys[0],
        views: r.values[0],
        // 총 참여시간 ÷ 조회수 = 한 번 볼 때 머문 시간(초)
        avgSeconds: r.values[0] ? Math.round(r.values[1] / r.values[0]) : 0,
      })),
      sources: sources.map((r) => ({ source: r.keys[0], sessions: r.values[0] })),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message, days: [], pages: [], sources: [] };
  }
}
