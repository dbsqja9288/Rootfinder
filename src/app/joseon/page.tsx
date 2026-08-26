import type { Metadata } from "next";
import JoseonQuiz from "@/components/JoseonQuiz";
import { JOSEON_DISCLAIMER, TIERS, TIER_ORDER } from "@/data/joseon";
import TierArt from "@/components/TierArt";
import { SITE_URL } from "@/lib/site";
import AdSlot from "@/components/AdSlot";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  // 정식 주소. 미리보기 도메인·물음표 붙은 주소가 따로 색인되지 않게 한다.
  alternates: { canonical: "/joseon" },
  title: "조선시대였다면 나는?",
  description:
    "본관과 MBTI를 고르면 조선시대 우리 가문의 등급과 내 직업이 나옵니다. 대장장이부터 영의정까지, 재미로 보는 콘텐츠입니다.",
  openGraph: {
    title: "조선시대였다면 나는? — 뿌리찾기",
    description: "본관 + MBTI로 알아보는 조선시대 나의 가문과 직업",
  },
};


/**
 * 검색창에 실제로 치는 문장을 그대로 질문으로 뒀다.
 * 답은 전부 이 페이지의 「꼭 읽어주세요」에 이미 적힌 내용과 같은 얘기다 —
 * 새로운 주장을 여기서 만들어내지 않는다.
 */
const FAQ = [
  {
    q: "조선시대였다면 내 신분은 어떻게 정해지나요?",
    a: "본관에 남아 있는 공개 기록의 양(정승·왕비 배출, 문과 급제자 수 등)을 점수화해 700여 개 본관을 줄 세운 결과입니다. 집계 기준은 자료마다 달라 근사치이며, 학술적 근거로 인용할 수 없습니다.",
  },
  {
    q: "MBTI는 왜 물어보나요?",
    a: "등급은 가문 쪽, 직업은 성향 쪽입니다. MBTI 16가지에 실제 조선시대 관직·생업을 대응시킨 창작이며, 심리학적·역사학적 근거는 없습니다. 어떤 유형이 더 우월하다는 뜻도 결코 아닙니다.",
  },
  {
    q: "결과가 우리 집안의 실제 신분인가요?",
    a: "아닙니다. 조선 후기 신분제가 해체되고 1909년 민적법으로 전 국민이 성과 본관을 등록하면서 본관과 실제 혈통의 연결은 상당 부분 끊어졌습니다. 지금의 본관으로 조상의 신분을 알아내는 것은 원칙적으로 불가능합니다.",
  },
  {
    q: "등급이 낮게 나왔는데 뿌리가 얕은 건가요?",
    a: "아닙니다. 기록이 적다고 뿌리가 얕은 것이 아니고, 기록이 많다고 더 나은 가문인 것도 아닙니다. 조선 인구의 대다수는 기록을 남기지 못한 사람들이었고, 오늘의 우리는 대부분 그분들의 후손입니다.",
  },
  {
    q: "내 본관이 목록에 없어요.",
    a: "이 사이트는 본관 761개를 수록하고 있습니다. 찾으시는 본관이 없으면 아래 문의 메일로 알려주세요. 확인 후 추가합니다.",
  },
];

export default function JoseonPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8 text-center">
        <p className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">재미로 보는 콘텐츠</p>
        <h1 className="serif text-3xl font-bold sm:text-4xl">조선시대였다면 나는?</h1>
        <p className="mt-3 leading-relaxed text-inksoft">
          본관과 MBTI를 고르면 우리 가문의 등급과 내 직업이 나옵니다.
          <br className="hidden sm:block" />
          대장장이일까요, 영의정일까요.
        </p>
      </header>

      <JoseonQuiz siteUrl={SITE_URL} />

      {/*
        퀴즈와 등급 소개 사이의 큰 광고(4번 자리).
        결과를 다 보고 아래로 내려가는 길목이라 이 페이지에서 가장 오래 머무는 구간이다.
        MBTI 버튼과는 결과 카드 하나만큼 떨어져 있어 실수 클릭 위험도 낮다.
        이걸로 이 페이지 광고가 4개 — 애드핏 상한이라 여기서 더 늘리면 안 된다.
      */}
      <AdSlot slot={4} />

      {/* 등급 소개 */}
      <section className="mt-16">
        <h2 className="serif mb-1 text-xl font-bold">등급은 이렇게 나뉩니다</h2>
        <p className="mb-5 text-sm text-inksoft">
          본관에 남은 공개 기록의 양(정승·왕비 배출, 문과 급제자 수 등)을 점수화해 700여 개 본관을 줄 세운 결과입니다.
        </p>
        <ul className="space-y-3">
          {TIER_ORDER.map((id) => {
            const t = TIERS[id];
            return (
              <li key={id} className="card flex items-center gap-4 p-4">
                <TierArt tier={id} size={64} />
                <div className="min-w-0">
                  <p className="font-medium" style={{ color: t.color }}>
                    {t.name} <span className="text-xs text-inksoft">{t.hanja}</span>
                  </p>
                  <p className="text-sm text-inksoft">{t.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="card mt-4 border-l-4 border-l-celadon p-5 text-sm leading-relaxed text-inksoft">
          <p className="mb-2 font-medium text-ink">왜 &lsquo;천민&rsquo; 등급이 없나요?</p>
          <p>
            조선시대 노비는 성과 본관을 갖지 못했습니다. 지금 본관이 있다는 것 자체가 노비가 아니었거나, 신분 해방 이후
            새로 본관을 정했다는 뜻입니다. 어느 쪽이든 본관으로는 천민 여부를 알 수 없기에 등급에서 제외했습니다.
          </p>
        </div>
      </section>

      {/* 면책 */}
      <section className="mt-12">
        <div className="card border-l-4 border-l-accent p-6">
          <h2 className="serif mb-4 flex items-center gap-2 font-bold">
            <span aria-hidden>⚠️</span> 꼭 읽어주세요
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-inksoft">
            {JOSEON_DISCLAIMER.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">·</span>
                <span>{renderBold(line)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq
        title="조선시대 신분에 대해 자주 묻는 것"
        note="이 페이지가 무엇을 하는 물건인지 숨기지 않고 적었습니다."
        items={FAQ}
      />

      {/*
        하단 광고는 애드센스 심사 기간 동안 꺼 둔다.

        이 페이지는 최상단·결과앞·등급표앞까지 광고가 3개다. 여기에 하단까지 넣으면 4개가 되는데,
        애드핏 상한이자 애드센스가 "콘텐츠보다 광고가 많다"고 볼 수 있는 선이다.
        심사에 걸린 게 애드핏 하루 몇백 원보다 훨씬 크므로 그동안만 뺀다.

        ★ 애드센스 통과하면 아래 한 줄의 주석만 풀면 원래대로 돌아온다.
      */}
      {/* <AdSlot /> */}
    </div>
  );
}

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
