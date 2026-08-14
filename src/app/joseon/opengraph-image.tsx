import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFont } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "조선시대였다면 나는? — 뿌리찾기";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        seal="姓"
        title="조선시대였다면 나는?"
        subtitle="본관과 MBTI를 고르면 우리 가문의 등급과 내 직업이 나옵니다"
        meta={["대장장이", "역관", "영의정", "재미로 보는 콘텐츠"]}
      />
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: await ogFont(), weight: 700, style: "normal" }],
    }
  );
}
