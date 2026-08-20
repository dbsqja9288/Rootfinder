/**
 * ads.txt — 광고 판매 권한을 밝히는 표준 파일.
 *
 * 애드센스는 이 파일이 없으면 "수익 손실 위험" 경고를 띄우고,
 * 일부 광고주는 아예 입찰하지 않아 단가가 떨어진다.
 *
 * NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)를 넣으면 자동으로 만들어진다.
 * 값이 없으면 404를 낸다 — 빈 파일을 두면 오히려 "판매 권한 없음"으로 읽힌다.
 */
export const dynamic = "force-static";

// 구글 애드센스의 고정 인증 ID. 모든 사이트가 동일하다.
const GOOGLE_TAG_ID = "f08c47fec0942fa0";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  if (!client) {
    return new Response("Not Found", { status: 404 });
  }

  // ca-pub-0000000000000000 → pub-0000000000000000
  const pub = client.replace(/^ca-/, "");

  const body = `# 이 사이트의 광고를 판매할 권한이 있는 곳
google.com, ${pub}, DIRECT, ${GOOGLE_TAG_ID}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
