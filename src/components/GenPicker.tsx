"use client";

import { GEN_MAX, GEN_MIN, clampGen } from "@/lib/kinship";

/**
 * 몇 대손인지 고르는 입력.
 *
 * 대부분은 자기가 몇 대손인지 모른다. 그래서 모른다는 선택지를 앞에 두고,
 * 고르면 흔한 값인 30세를 넣어준다. 모른다고 해서 진행이 막히면 거기서 이탈한다.
 */
export default function GenPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (n: number | null) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={GEN_MIN}
          max={GEN_MAX}
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? null : clampGen(Number(raw)));
          }}
          placeholder="30"
          aria-label="몇 대손인지"
          className="w-24 rounded-xl border border-line bg-bg px-4 py-3 text-center outline-none focus:border-accent"
        />
        <span className="text-inksoft">대손 (시조로부터 몇 번째 세대인지)</span>
      </div>

      <button
        onClick={() => onChange(30)}
        className="text-sm text-inksoft underline underline-offset-2 transition hover:text-accent"
      >
        잘 모르겠어요 → 30대손으로 놓고 보기
      </button>

      <p className="text-xs leading-relaxed text-inksoft">
        족보의 세(世)·대(代)는 문중마다 세는 법이 조금씩 다릅니다. 여기서는 <strong>시조를 1세</strong>로 놓고
        셉니다. 조선 초에 갈라진 집안은 대개 25~35세 사이입니다.
      </p>
    </div>
  );
}
