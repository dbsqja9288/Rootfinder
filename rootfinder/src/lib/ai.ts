/**
 * AI 심층 해설 — 선택 기능.
 *
 * 환경변수에 API 키가 없으면 UI에 버튼 자체가 나타나지 않으므로 비용이 0원이다.
 * 나중에 Vercel 환경변수에 ANTHROPIC_API_KEY 또는 OPENAI_API_KEY를 넣으면 자동으로 켜진다.
 */

export function isDeepDiveEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

const SYSTEM_PROMPT = `당신은 한국 성씨와 족보를 설명하는 해설자입니다.

규칙:
- 한국어 존댓말로, 일반인이 읽기 쉽게 씁니다.
- 확실하지 않은 내용은 "전해집니다", "…라는 기록이 있습니다"처럼 전언(傳言)임을 밝힙니다.
- 연도·인물·관직을 지어내지 않습니다. 모르면 "문중 기록 확인이 필요합니다"라고 씁니다.
- 마크다운 제목(#)은 쓰지 않고, 3~4개 문단의 평문으로 씁니다. 각 문단은 3문장 내외입니다.
- 전체 600자 이내로 씁니다.`;

/** 같은 질문을 반복 호출하지 않도록 하는 메모리 캐시 (서버 인스턴스 단위) */
const cache = new Map<string, { text: string; at: number }>();
const TTL = 1000 * 60 * 60 * 24; // 24시간

export function getCached(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL) {
    cache.delete(key);
    return null;
  }
  return hit.text;
}

export function setCached(key: string, text: string) {
  if (cache.size > 500) cache.clear(); // 무한 증식 방지
  cache.set(key, { text, at: Date.now() });
}

export async function generate(prompt: string): Promise<string> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? "claude-haiku-4-5",
        max_tokens: 900,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  if (openaiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? "gpt-4o-mini",
        max_tokens: 900,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  throw new Error("API 키가 설정되지 않았습니다.");
}
