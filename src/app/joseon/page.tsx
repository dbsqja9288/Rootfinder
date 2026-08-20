import type { Metadata } from "next";
import JoseonQuiz from "@/components/JoseonQuiz";
import { JOSEON_DISCLAIMER, TIERS, TIER_ORDER } from "@/data/joseon";
import TierArt from "@/components/TierArt";
import { SITE_URL } from "@/lib/site";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "조선시대였다면 나는?",
  description:
    "본관과 MBTI를 고르면 조선시대 우리 가문의 등급과 내 직업이 나옵니다. 대장장이부터 영의정까지, 재미로 보는 콘텐츠입니다.",
  openGraph: {
    title: "조선시대였다면 나는? — 뿌리찾기",
    description: "본관 + MBTI로 알아보는 조선시대 나의 가문과 직업",
  },
};

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

      {/* 본문 중간 광고. 공유 버튼과 멀리 떨어뜨려 실수 클릭을 막는다. */}
      <AdSlot slot={2} />

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

      <AdSlot />
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
