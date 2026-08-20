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

  // 주석 없이 순수 레코드만 내보낸다.
  // 한글 주석이 들어가면 일부 파서가 파일 전체를 못 읽는 경우가 있다.
  const body = `google.com, ${pub}, DIRECT, ${GOOGLE_TAG_ID}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
