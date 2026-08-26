import type { Metadata } from "next";
import FortuneQuiz from "@/components/FortuneQuiz";
import AdSlot from "@/components/AdSlot";
import Faq from "@/components/Faq";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // 정식 주소. 미리보기 도메인·물음표 붙은 주소가 따로 색인되지 않게 한다.
  alternates: { canonical: "/fortune" },
  title: "우리 가문 운세",
  description:
    "생년월일시로 사주 여덟 글자를 세우고, 본관·대손을 더해 이 달의 리포트를 만듭니다. 재미로 보는 콘텐츠입니다.",
  openGraph: {
    title: "우리 가문 운세 — 뿌리찾기",
    description: "사주 여덟 글자와 본관으로 보는 이 달의 리포트.",
  },
};


/** 답은 전부 아래 「꼭 읽어주세요」와 같은 얘기다. 점집 흉내를 내지 않는다. */
const FAQ = [
  {
    q: "사주 여덟 글자가 뭔가요?",
    a: "태어난 해·달·날·시각을 각각 천간 한 글자와 지지 한 글자로 나타낸 것입니다. 네 기둥에 두 글자씩이라 여덟 글자, 사주팔자라고 부릅니다. 정해진 규칙대로 세우는 값이라 만세력과 대조해 보실 수 있습니다.",
  },
  {
    q: "태어난 시간을 모르면 못 보나요?",
    a: "볼 수 있습니다. 시각을 '모름'으로 두면 시주(時柱) 없이 여섯 글자로 계산합니다. 다만 시주가 빠지면 그만큼 정보가 줄어듭니다.",
  },
  {
    q: "생일은 양력으로 넣나요, 음력으로 넣나요?",
    a: "양력으로 넣어 주세요. 음력 생일만 아신다면 달력 앱에서 양력으로 바꿔 확인하신 뒤 입력하시면 됩니다.",
  },
  {
    q: "만세력과 결과가 다르게 나와요.",
    a: "일주와 시주는 근사 없이 정확합니다. 다만 연주·월주는 하루 어긋날 수 있습니다. 절기가 드는 정확한 시각은 해마다 달라서, 절기 전환일 근처에 태어나신 경우 화면에 그 사실을 따로 적어 드립니다.",
  },
  {
    q: "본관과 대손은 왜 넣나요?",
    a: "사주만으로는 '우리 가문'이라는 부분이 빠지기 때문입니다. 시조와 본관 지역은 사이트가 정리한 자료에서 그대로 가져오고, 기록이 없으면 그 자리를 비웁니다. 지어내지 않습니다.",
  },
  {
    q: "결과가 매번 바뀌나요?",
    a: "같은 내용을 넣으면 이번 달 내내 같은 결과가 나옵니다. 달이 바뀌면 그 달의 리포트로 새로 만들어집니다.",
  },
];

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

      <Faq
        title="가문 운세에 대해 자주 묻는 것"
        note="계산인 것과 해석인 것을 구분해 적었습니다."
        items={FAQ}
      />

      <AdSlot />
    </div>
  );
}
