import type { Metadata } from "next";
import FortuneQuiz from "@/components/FortuneQuiz";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "우리 가문 운세",
  description:
    "생년월일시로 사주 여덟 글자를 세우고, 본관·대손을 더해 이 달의 리포트를 만듭니다. 재미로 보는 콘텐츠입니다.",
  openGraph: {
    title: "우리 가문 운세 — 뿌리찾기",
    description: "사주 여덟 글자와 본관으로 보는 이 달의 리포트.",
  },
};

export default function FortunePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8 text-center">
        <p className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">재미로 보는 콘텐츠</p>
        <h1 className="serif text-3xl font-bold sm:text-4xl">우리 가문 운세</h1>
        <p className="mt-3 leading-relaxed text-inksoft">
          생년월일시로 사주 여덟 글자를 세우고, 여기에 본관과 대손을 더합니다.
          <br className="hidden sm:block" />
          같은 입력이면 이번 달 내내 같은 결과가 나옵니다.
        </p>
      </header>

      <FortuneQuiz siteUrl={SITE_URL} />

      {/* 무엇을 하는 물건인지 숨기지 않는다. 점집 흉내를 내는 순간 사이트 전체의 신뢰가 깎인다. */}
      <section className="mt-14">
        <div className="card border-l-4 border-l-accent p-6">
          <h2 className="serif mb-4 flex items-center gap-2 font-bold">
            <span aria-hidden>⚠️</span> 꼭 읽어주세요
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-inksoft">
            <li className="flex gap-2">
              <span className="text-accent">·</span>
              <span>
                <strong className="text-ink">&lsquo;계산&rsquo; 딱지가 붙은 것만 계산입니다.</strong> 사주 여덟
                글자와 오행 개수는 정해진 규칙대로 세운 값이라 만세력과 대조해 보실 수 있습니다. 일주와 시주는
                근사 없이 정확합니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">·</span>
              <span>
                <strong className="text-ink">다만 연주·월주는 하루 어긋날 수 있습니다.</strong> 절기가 드는 정확한
                시각은 해마다 달라서, 절기 전환일 근처 출생이면 화면에 그 사실을 따로 적어 드립니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">·</span>
              <span>
                <strong className="text-ink">&lsquo;해석&rsquo;은 미래를 맞히지 않습니다.</strong> 전통 해석의
                방향을 따라 쓴 글이며, 점(占)이 아닙니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">·</span>
              <span>
                <strong className="text-ink">&lsquo;기록&rsquo;은 지어내지 않습니다.</strong> 시조와 본관 지역은
                사이트가 정리한 자료에서 그대로 가져오고, 기록이 없으면 그 자리를 비웁니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">·</span>
              <span>건강·재산·진로처럼 중요한 결정은 이 글이 아니라 전문가와 상의해 주십시오.</span>
            </li>
          </ul>
        </div>
      </section>

      <AdSlot />
    </div>
  );
}
