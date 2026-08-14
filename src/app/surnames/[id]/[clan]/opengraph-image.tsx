import { ImageResponse } from "next/og";
import { CLAN_ENTRIES, getClan } from "@/lib/clan-index";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFont } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "본관과 시조";

export function generateStaticParams() {
  // 이미지 생성 비용을 감안해, 해설이 있는 주요 본관만 사전 생성한다
  return CLAN_ENTRIES.filter((c) => c.detail).map((c) => ({ id: c.surnameId, clan: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ id: string; clan: string }> }) {
  const { id, clan } = await params;
  const entry = getClan(id, clan);

  const meta: string[] = [];
  if (entry?.detail?.founder) meta.push(`시조 ${entry.detail.founder.replace(/\(.*\)/, "")}`);
  if (entry?.region) meta.push(entry.region.now);
  if (entry?.detail?.population) meta.push(`약 ${entry.detail.population.toLocaleString()}명`);

  return new ImageResponse(
    (
      <OgCard
        seal={entry?.surnameHanja ?? "族"}
        title={entry?.fullName ?? "본관 찾기"}
        subtitle={entry ? `${entry.surnameKo}씨의 본관 · 시조와 유래` : undefined}
        meta={meta}
      />
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: await ogFont(), weight: 700, style: "normal" }],
    }
  );
}
