/**
 * 사이트 주소 한 곳에서 정하기.
 *
 * 사이트맵·구조화 데이터·OG 이미지·공유 링크가 전부 이 값을 쓴다.
 * 여기가 틀리면 검색엔진에 엉뚱한 주소가 등록되므로 한 곳에서만 정한다.
 *
 *  1) NEXT_PUBLIC_SITE_URL — 직접 지정한 값이 있으면 무조건 우선.
 *  2) 정식 도메인 — 환경변수를 하나도 안 넣어도 배포판은 항상 이 주소를 쓴다.
 *  3) 로컬 개발 중이면 localhost.
 *
 * 도메인을 또 바꾸게 되면 아래 CANONICAL 한 줄만 고치면 된다.
 */
const CANONICAL = "https://rootfinder.kr";

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // 로컬 개발(next dev)에서는 localhost를 써야 링크를 눌러볼 수 있다
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    return "http://localhost:3000";
  }

  return CANONICAL;
}

export const SITE_URL = resolve();
