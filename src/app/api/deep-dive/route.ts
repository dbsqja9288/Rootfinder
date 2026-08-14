import { NextResponse } from "next/server";
import { generate, getCached, isDeepDiveEnabled, setCached } from "@/lib/ai";

export const runtime = "nodejs";

// 아주 단순한 IP 단위 호출 제한 (비용 폭주 방지)
const hits = new Map<string, number[]>();
const WINDOW = 60_000;
const LIMIT = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
}

export async function POST(req: Request) {
  if (!isDeepDiveEnabled()) {
    return NextResponse.json({ error: "AI 해설이 설정되지 않았습니다." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  let body: { surname?: string; clan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const surname = (body.surname ?? "").slice(0, 40).trim();
  const clan = (body.clan ?? "").slice(0, 40).trim();
  if (!surname) return NextResponse.json({ error: "성씨가 필요합니다." }, { status: 400 });

  const key = `${surname}|${clan}`;
  const cached = getCached(key);
  if (cached) return NextResponse.json({ text: cached, cached: true });

  const prompt = clan
    ? `${clan} ${surname}씨에 대해 설명해주세요. 시조와 본관의 유래, 이 본관이 역사에서 어떤 위치였는지, 대표적인 인물과 세거지를 중심으로 알려주세요.`
    : `${surname}씨의 유래와 갈래를 설명해주세요. 성씨가 생겨난 배경과 주요 본관이 어떻게 나뉘었는지 중심으로 알려주세요.`;

  try {
    const text = await generate(prompt);
    setCached(key, text);
    return NextResponse.json({ text });
  } catch (e) {
    console.error("deep-dive failed:", e);
    return NextResponse.json({ error: "해설을 불러오지 못했습니다." }, { status: 502 });
  }
}
