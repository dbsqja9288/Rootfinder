import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** OG 이미지용 한글 폰트 (필요한 글자만 담은 서브셋, 약 390KB) */
export async function ogFont() {
  return readFile(join(process.cwd(), "src/assets/NotoSansKR-Bold-subset.otf"));
}

const INK = "#1c1917";
const SOFT = "#78716c";
const ACCENT = "#7c2d12";
const BG = "#faf7f2";

/**
 * OG 이미지 공통 레이아웃.
 * 왼쪽에 한자 낙관, 오른쪽에 제목·부제·메타 정보를 둔다.
 */
export function OgCard({
  seal,
  title,
  subtitle,
  meta = [],
}: {
  seal: string;
  title: string;
  subtitle?: string;
  meta?: string[];
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: BG,
        padding: 72,
        alignItems: "center",
        gap: 56,
        position: "relative",
      }}
    >
      {/* 좌측 낙관 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 260,
          height: 260,
          borderRadius: 40,
          backgroundColor: "rgba(124,45,18,0.09)",
          color: ACCENT,
          fontSize: seal.length > 1 ? 96 : 150,
          flexShrink: 0,
        }}
      >
        {seal}
      </div>

      {/* 우측 텍스트 */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 26, color: ACCENT, marginBottom: 14 }}>뿌리찾기</div>
        <div style={{ fontSize: title.length > 12 ? 68 : 88, color: INK, lineHeight: 1.15 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 32, color: SOFT, marginTop: 20, lineHeight: 1.4 }}>{subtitle}</div>
        )}
        {meta.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            {meta.map((m) => (
              <div
                key={m}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: SOFT,
                  border: "1px solid #e0d8ca",
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 띠 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 10,
          display: "flex",
          backgroundColor: ACCENT,
        }}
      />
    </div>
  );
}
