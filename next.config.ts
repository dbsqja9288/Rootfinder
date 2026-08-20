import type { NextConfig } from "next";

/**
 * 옛 주소로 들어온 사람과 검색엔진을 새 도메인으로 넘긴다.
 *
 * 308(영구 이동)로 보내야 검색엔진이 "주소가 바뀐 것"으로 알아듣고
 * 기존 주소에 쌓인 평가를 새 주소로 옮겨준다. 임시(307)로 보내면 안 옮겨진다.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rootfinder-pi.vercel.app" }],
        destination: "https://rootfinder.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
