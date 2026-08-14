import { ImageResponse } from "next/og";
import { SURNAMES, getSurname } from "@/data/surnames";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFont } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "성씨 유래와 본관";

export function generateStaticParams() {
  return SURNAMES.map((s) => ({ id: s.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSurname(id);

  return new ImageResponse(
    (
      <OgCard
        seal={s?.hanja ?? "族"}
        title={s ? `${s.ko}씨는 어디에서 왔을까` : "성씨 찾기"}
        subtitle={s?.origin.slice(0, 60).concat("…")}
        meta={
          s
            ? [`인구 ${s.rank}위`, `${s.population.toLocaleString()}명`, `본관 ${s.allClans?.length ?? 0}개`]
            : []
        }
      />
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: await ogFont(), weight: 700, style: "normal" }],
    }
  );
}
