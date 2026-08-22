import type { Metadata } from "next";
import KinFinder from "@/components/KinFinder";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "이 사람과 몇 촌일까",
  description:
    "본관과 대손만 넣으면 두 사람이 족보상 몇 촌인지 추정합니다. 내 링크를 만들어 친구에게 보내보세요.",
  openGraph: {
    title: "이 사람과 몇 촌일까 — 뿌리찾기",
    description: "본관과 대손을 넣으면 나와 몇 촌인지 나옵니다.",
  },
};

export default function KinPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8 text-center">
        <p className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">먼 친척찾기</p>
        <h1 className="serif text-3xl font-bold sm:text-4xl">이 사람과 몇 촌일까</h1>
        <p className="mt-3 leading-relaxed text-inksoft">
          본관과 대손만 넣으면 족보상 몇 촌인지 나옵니다.
          <br className="hidden sm:block" />
          내 링크를 만들어 보내면, 받은 사람이 자기 것만 넣고 바로 확인합니다.
        </p>
      </header>

      <KinFinder siteUrl={SITE_URL} />

      {/* 계산 방식을 숨기지 않는다. 근거를 보여주는 편이 결과를 믿게 만든다. */}
      <details className="card mt-14 p-6">
        <summary className="serif cursor-pointer font-bold">어떻게 계산하나요</summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-inksoft">
          <p>
            촌수는 <strong className="text-ink">나에서 공통 조상까지 올라간 걸음 수 + 공통 조상에서 상대까지
            내려간 걸음 수</strong>입니다. 형제는 부모까지 한 걸음씩 올라갔다 내려오니 2촌, 사촌은 할아버지까지
            두 걸음씩이라 4촌입니다.
          </p>
          <p>
            문제는 두 사람의 파(派)가 어디서 갈렸는지 모른다는 점입니다. 그래서 <strong className="text-ink">
            확실히 만나는 지점인 시조</strong>를 기준으로 계산합니다. 시조를 1세로 놓으면 <em>a</em>대손과{" "}
            <em>b</em>대손의 촌수는 <strong className="text-ink">a + b − 2</strong>가 됩니다.
          </p>
          <p>
            이 값은 <strong className="text-ink">상한선</strong>입니다. 두 집안이 시조보다 아래에서 갈렸다면
            실제 촌수는 이보다 작습니다. 그래서 &lsquo;몇 촌이다&rsquo;가 아니라 &lsquo;최대 몇 촌&rsquo;이라고
            적습니다. 없는 숫자를 지어내지 않기 위해서입니다.
          </p>
          <p>
            정확한 촌수는 양쪽 문중의 족보에서 공통 조상을 찾아야 알 수 있습니다. 이 페이지의 결과는 재미와
            어림짐작을 위한 것이며, 법적·행정적 효력이 없습니다.
          </p>
        </div>
      </details>

      <AdSlot />
    </div>
  );
}
