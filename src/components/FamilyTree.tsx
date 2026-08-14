"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  H_GAP,
  NODE_H,
  NODE_W,
  SAMPLE,
  type Member,
  flatten,
  layout,
} from "@/lib/tree";

const STORAGE_KEY = "rootfinder.familytree.v1";
const PAD = 40;

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FamilyTree() {
  const [title, setTitle] = useState("우리 집 가계도");
  const [members, setMembers] = useState<Member[]>(SAMPLE);
  const [selected, setSelected] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // 저장된 내용 불러오기
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.members) && parsed.members.length) {
          setMembers(parsed.members);
          setTitle(parsed.title ?? "우리 집 가계도");
        }
      }
    } catch {
      /* 저장된 데이터가 손상된 경우 기본값 유지 */
    }
    setLoaded(true);
  }, []);

  // 자동 저장
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, members }));
    } catch {
      /* 저장 공간 부족 등은 무시 */
    }
  }, [title, members, loaded]);

  const { nodes, width, height } = useMemo(() => layout(members), [members]);
  const flat = useMemo(() => flatten(nodes), [nodes]);
  const positions = useMemo(
    () => new Map(flat.map((n) => [n.member.id, n])),
    [flat]
  );

  const current = members.find((m) => m.id === selected) ?? null;

  function update(id: string, patch: Partial<Member>) {
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function addChild(parentId: string | null) {
    const id = uid();
    setMembers((ms) => [...ms, { id, name: "이름", parentId }]);
    setSelected(id);
  }

  function remove(id: string) {
    // 자손까지 함께 삭제
    const doomed = new Set<string>([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const m of members) {
        if (m.parentId && doomed.has(m.parentId) && !doomed.has(m.id)) {
          doomed.add(m.id);
          changed = true;
        }
      }
    }
    setMembers((ms) => ms.filter((m) => !doomed.has(m.id)));
    setSelected(null);
  }

  function reset() {
    setMembers([{ id: uid(), name: "시조", parentId: null }]);
    setSelected(null);
  }

  async function download(format: "png" | "svg") {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });

    if (format === "svg") {
      triggerDownload(URL.createObjectURL(blob), `${title}.svg`);
      return;
    }

    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = (width + PAD * 2) * scale;
      canvas.height = (height + PAD * 2 + 40) * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      triggerDownload(canvas.toDataURL("image/png"), `${title}.png`);
    };
    img.src = url;
  }

  function triggerDownload(href: string, filename: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
  }

  const vbW = width + PAD * 2;
  const vbH = height + PAD * 2 + 40;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* 캔버스 */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-1.5 text-sm outline-none focus:border-accent"
            aria-label="가계도 제목"
          />
          <button
            onClick={() => download("png")}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 dark:text-stone-900"
          >
            PNG 저장
          </button>
          <button
            onClick={() => download("svg")}
            className="rounded-lg border border-line px-3 py-1.5 text-sm transition hover:border-accent"
          >
            SVG
          </button>
        </div>

        <div className="overflow-auto bg-[#faf7f2] p-2">
          <svg
            ref={svgRef}
            viewBox={`${-PAD} ${-PAD} ${vbW} ${vbH}`}
            width={vbW}
            height={vbH}
            style={{ maxWidth: "100%", height: "auto", minWidth: 320 }}
            role="img"
            aria-label={`${title} 가계도`}
          >
            <rect x={-PAD} y={-PAD} width={vbW} height={vbH} fill="#faf7f2" />
            <text
              x={width / 2}
              y={-14}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fill="#1c1917"
              fontFamily="serif"
            >
              {title}
            </text>

            {/* 연결선 */}
            {flat.map((n) =>
              n.children.map((c) => {
                const x1 = n.x + NODE_W / 2;
                const y1 = n.y + NODE_H;
                const x2 = c.x + NODE_W / 2;
                const y2 = c.y;
                const mid = y1 + (y2 - y1) / 2;
                return (
                  <path
                    key={`${n.member.id}-${c.member.id}`}
                    d={`M${x1},${y1} V${mid} H${x2} V${y2}`}
                    fill="none"
                    stroke="#c9c0b2"
                    strokeWidth={1.5}
                  />
                );
              })
            )}

            {/* 노드 */}
            {flat.map((n) => {
              const m = n.member;
              const isSel = m.id === selected;
              return (
                <g
                  key={m.id}
                  transform={`translate(${n.x},${n.y})`}
                  onClick={() => setSelected(m.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx={10}
                    fill={isSel ? "#7c2d12" : "#ffffff"}
                    stroke={isSel ? "#7c2d12" : "#e0d8ca"}
                    strokeWidth={isSel ? 2 : 1.2}
                  />
                  <text
                    x={NODE_W / 2}
                    y={m.spouse || m.note ? 27 : 40}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="600"
                    fill={isSel ? "#ffffff" : "#1c1917"}
                    fontFamily="sans-serif"
                  >
                    {m.name || "(이름 없음)"}
                  </text>
                  {m.spouse && (
                    <text
                      x={NODE_W / 2}
                      y={45}
                      textAnchor="middle"
                      fontSize="12"
                      fill={isSel ? "#f4e4d8" : "#78716c"}
                      fontFamily="sans-serif"
                    >
                      배우자 {m.spouse}
                    </text>
                  )}
                  {m.note && (
                    <text
                      x={NODE_W / 2}
                      y={m.spouse ? 60 : 46}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isSel ? "#e7d3c4" : "#a8a29e"}
                      fontFamily="sans-serif"
                    >
                      {m.note}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 편집 패널 */}
      <aside className="space-y-4">
        <div className="card p-4">
          <h2 className="serif mb-3 font-bold">
            {current ? "선택한 사람 편집" : "사람을 선택하세요"}
          </h2>

          {current ? (
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="mb-1 block text-inksoft">이름</span>
                <input
                  value={current.name}
                  onChange={(e) => update(current.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-inksoft">배우자 (선택)</span>
                <input
                  value={current.spouse ?? ""}
                  onChange={(e) => update(current.id, { spouse: e.target.value || undefined })}
                  placeholder="예: 김영희"
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-inksoft">메모 (관계·생몰년)</span>
                <input
                  value={current.note ?? ""}
                  onChange={(e) => update(current.id, { note: e.target.value || undefined })}
                  placeholder="예: 조부 / 1940~2012"
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
                />
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => addChild(current.id)}
                  className="flex-1 rounded-lg bg-accent px-3 py-2 font-medium text-white transition hover:opacity-90 dark:text-stone-900"
                >
                  자녀 추가
                </button>
                <button
                  onClick={() => remove(current.id)}
                  className="rounded-lg border border-line px-3 py-2 text-inksoft transition hover:border-red-400 hover:text-red-500"
                >
                  삭제
                </button>
              </div>
              <p className="text-xs text-inksoft">※ 삭제하면 그 아래 자손도 함께 사라집니다.</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-inksoft">
              가계도에서 네모 박스를 클릭하면 이름·배우자·메모를 고칠 수 있고, 자녀를 추가할 수 있어요.
            </p>
          )}
        </div>

        <div className="card space-y-2 p-4 text-sm">
          <button
            onClick={() => addChild(null)}
            className="w-full rounded-lg border border-line px-3 py-2 transition hover:border-accent"
          >
            최상단에 시조 추가
          </button>
          <button
            onClick={() => setMembers(SAMPLE)}
            className="w-full rounded-lg border border-line px-3 py-2 transition hover:border-accent"
          >
            예시 가계도 불러오기
          </button>
          <button
            onClick={reset}
            className="w-full rounded-lg border border-line px-3 py-2 text-inksoft transition hover:border-red-400 hover:text-red-500"
          >
            전부 지우고 새로 시작
          </button>
        </div>

        <div className="card p-4 text-xs leading-relaxed text-inksoft">
          작성한 가계도는 <strong className="text-ink">이 브라우저에만</strong> 저장됩니다. 서버로 전송되지 않으니
          안심하고 실명을 적어도 됩니다. 다만 브라우저 데이터를 지우면 함께 사라지니, 완성 후 PNG로 저장해 두세요.
        </div>
      </aside>
    </div>
  );
}
