import { ImageResponse } from "next/og";
import { CLAN_ENTRIES } from "@/lib/clan-index";
import { judge } from "@/lib/joseon";
import { MBTI_LIST, type Mbti } from "@/data/joseon";
import { ogFont } from "@/lib/og";

/**
 * 조선시대 결과 카드 이미지.
 *
 * 주소가 순수 ASCII여야 외부 서비스(스레드 등)가 이미지를 가져올 수 있어서,
 * 본관·MBTI를 이름이 아니라 **인덱스 숫자**로 받는다.
 *   /api/joseon-card?c=0&m=8
 */
export const runtime = "nodejs";

const W = 1080;
const H = 1080;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const c = Number(searchParams.get("c") ?? 0);
  const m = Number(searchParams.get("m") ?? 0);

  const clan = CLAN_ENTRIES[((c % CLAN_ENTRIES.length) + CLAN_ENTRIES.length) % CLAN_ENTRIES.length];
  const mbti: Mbti = MBTI_LIST[((m % MBTI_LIST.length) + MBTI_LIST.length) % MBTI_LIST.length];
  const r = judge(clan, mbti);

  const font = await ogFont();
  const accent = r.tier.color;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf7f2",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 14,
            display: "flex",
            backgroundColor: accent,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 190,
            height: 190,
            borderRadius: 44,
            backgroundColor: "rgba(124,45,18,0.08)",
            color: accent,
            fontSize: 110,
          }}
        >
          {r.clan.surnameHanja}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#78716c", marginTop: 28 }}>
          {r.clan.fullName} · {r.mbti}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a8a29e", marginTop: 14 }}>조선시대였다면 당신은</div>

        <div style={{ display: "flex", fontSize: r.job.name.length > 7 ? 76 : 96, color: accent, marginTop: 10 }}>
          {r.job.name}
        </div>
        {r.job.hanja && (
          <div style={{ display: "flex", fontSize: 28, color: "#a8a29e", marginTop: 8 }}>{r.job.hanja}</div>
        )}

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#44403c",
            marginTop: 30,
            lineHeight: 1.55,
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          {r.job.desc.length > 62 ? r.job.desc.slice(0, 60) + "…" : r.job.desc}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 44,
            padding: "28px 52px",
            border: "2px solid #e0d8ca",
            borderRadius: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#78716c" }}>가문 등급</div>
          <div style={{ display: "flex", fontSize: 58, color: accent, marginTop: 8 }}>
            {r.tier.name} {r.tier.hanja}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#78716c", marginTop: 12 }}>
            {r.rawScore > 0 ? `기록이 남은 본관 중 상위 ${r.percentile}%` : "조선 인구의 대다수가 속했던 신분"}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#a8a29e", marginTop: 40 }}>
          뿌리찾기 · 재미로 보는 콘텐츠입니다
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 14,
            display: "flex",
            backgroundColor: accent,
          }}
        />
      </div>
    ),
    { width: W, height: H, fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }] }
  );
}
