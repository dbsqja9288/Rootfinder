/**
 * 사이트 주소 한 곳에서 정하기.
 *
 * 사이트맵·구조화 데이터·OG 이미지가 전부 이 값을 쓴다.
 * 여기가 틀리면 검색엔진에 엉뚱한 주소가 등록되므로, 설정을 깜빡해도 맞도록 3단계로 받는다.
 *
 *  1) NEXT_PUBLIC_SITE_URL — 직접 지정한 값. 커스텀 도메인을 붙이면 여기에 넣는다.
 *  2) Vercel이 자동으로 넣어주는 배포 주소 — 아무 설정을 안 해도 최소한 진짜 주소가 나온다.
 *  3) 로컬 개발 주소.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel이 빌드 때 자동으로 채워준다 (예: rootfinder-pi.vercel.app)
  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolve();
