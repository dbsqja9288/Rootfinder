import { ImageResponse } from "next/og";
import { SURNAMES, TOTAL_CLAN_COUNT } from "@/data/surnames";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFont } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "뿌리찾기 — 나의 성씨와 가계를 찾아서";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        seal="族"
        title="나의 성(姓)은 어디에서 왔을까"
        subtitle="성씨의 유래와 본관, 시조를 찾아보고 나만의 가계도를 만들어보세요"
        meta={[`성씨 ${SURNAMES.length}개`, `본관 ${TOTAL_CLAN_COUNT}개`, "가계도 만들기"]}
      />
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: await ogFont(), weight: 700, style: "normal" }],
    }
  );
}
