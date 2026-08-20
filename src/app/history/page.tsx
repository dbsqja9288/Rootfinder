import type { Metadata } from "next";
import { ERAS } from "@/data/timeline";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "역사 연대표",
  description: "고조선부터 현대까지, 한국의 성씨와 본관 제도가 어떻게 만들어졌는지 시대순으로 정리했습니다.",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="serif text-3xl font-bold sm:text-4xl">역사 연대표</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-inksoft">
          성씨와 본관은 어느 날 갑자기 생긴 것이 아닙니다. 나라가 바뀔 때마다 이름을 짓는 방식도 함께 달라졌습니다.
        </p>
      </header>

      <div className="relative">
        {/* 세로선 */}
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-line sm:left-[11px]" />

        <ol className="space-y-10">
          {ERAS.map((era) => (
            <li key={era.id} className="relative pl-8 sm:pl-12">
              <span
                className={`absolute top-1.5 left-0 size-4 rounded-full bg-gradient-to-br sm:size-6 ${era.color} ring-4 ring-bg`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="serif text-2xl font-bold">{era.name}</h2>
                <span className="text-sm text-inksoft">{era.period}</span>
              </div>
              <p className="mt-3 leading-loose text-ink/90">{renderBold(era.summary)}</p>

              <ul className="mt-4 space-y-2">
                {era.events.map((e) => (
                  <li key={e.year + e.text} className="card flex gap-3 p-3 text-sm">
                    <span className="w-24 shrink-0 font-medium text-accent tabular-nums">{e.year}</span>
                    <span className="text-inksoft">{e.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <AdSlot />
    </div>
  );
}

/** **굵게** 표시를 <strong>으로 바꿔주는 아주 작은 헬퍼 */
function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
