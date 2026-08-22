"use client";

/**
 * 촌수 그림.
 *
 * 숫자만 던지면 "58촌"이 얼마나 먼 것인지 감이 안 온다.
 * 시조에서 두 갈래로 내려오는 모양을 그려주면, 촌수가 어디서 나온 값인지가
 * 설명 없이 보인다. 글을 줄이는 가장 빠른 방법은 그림이다.
 */
export default function KinDiagram({
  myGen,
  otherGen,
  maxChon,
}: {
  myGen: number;
  otherGen: number;
  maxChon: number;
}) {
  const W = 320;
  const H = 236;
  const topY = 30;
  const botY = 190;
  const cx = W / 2;
  const leftX = 52;
  const rightX = W - 52;

  // 세대를 점으로 다 찍으면 30개가 넘어 지저분해진다. 최대 6개만 찍고
  // 나머지는 '…'으로 접는다. 실제 세대 수는 숫자로 따로 적는다.
  const dots = (n: number, x1: number) => {
    const k = Math.min(6, Math.max(1, n - 1));
    return Array.from({ length: k }, (_, i) => {
      const t = (i + 1) / (k + 1);
      return { x: cx + (x1 - cx) * t, y: topY + (botY - topY) * t };
    });
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-[320px]"
      role="img"
      aria-label={`시조에서 갈라져 나와 최대 ${maxChon}촌`}
    >
      {/* 두 갈래 */}
      <line x1={cx} y1={topY} x2={leftX} y2={botY} stroke="currentColor" strokeWidth="1.5" className="text-line" />
      <line x1={cx} y1={topY} x2={rightX} y2={botY} stroke="currentColor" strokeWidth="1.5" className="text-line" />

      {/* 세대 점 */}
      {dots(myGen, leftX).map((p, i) => (
        <circle key={`l${i}`} cx={p.x} cy={p.y} r="3" className="fill-line" />
      ))}
      {dots(otherGen, rightX).map((p, i) => (
        <circle key={`r${i}`} cx={p.x} cy={p.y} r="3" className="fill-line" />
      ))}

      {/* 시조 */}
      <circle cx={cx} cy={topY} r="9" className="fill-accent" />
      <text x={cx} y={topY - 15} textAnchor="middle" className="fill-current text-[11px] text-inksoft">
        시조
      </text>

      {/* 촌수 */}
      <text
        x={cx}
        y={botY - 42}
        textAnchor="middle"
        className="fill-accent text-[26px] font-bold"
        style={{ fontFamily: "var(--font-serif, serif)" }}
      >
        {maxChon}촌
      </text>
      <text x={cx} y={botY - 26} textAnchor="middle" className="fill-current text-[10px] text-inksoft">
        최대
      </text>

      {/*
        양 끝. 본관 이름은 넣지 않는다 —
        여기서 다루는 건 늘 같은 본관이라 양쪽에 같은 글자가 두 번 찍히고,
        10px로 줄어들어 겹쳐 보이기만 한다. 본관은 카드 위쪽에 이미 적혀 있다.
      */}
      <End x={leftX} y={botY} title="나" sub={`${myGen}대손`} filled />
      <End x={rightX} y={botY} title="상대" sub={`${otherGen}대손`} />
    </svg>
  );
}

function End({
  x,
  y,
  title,
  sub,
  filled,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  filled?: boolean;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="7"
        className={filled ? "fill-accent" : "fill-bg stroke-accent"}
        strokeWidth="2"
      />
      <text x={x} y={y + 22} textAnchor="middle" className="fill-current text-[12px] font-bold">
        {title}
      </text>
      <text x={x} y={y + 37} textAnchor="middle" className="fill-current text-[11px] text-inksoft">
        {sub}
      </text>
    </g>
  );
}
