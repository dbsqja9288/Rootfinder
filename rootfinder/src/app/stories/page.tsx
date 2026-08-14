import type { Metadata } from "next";
import { ARTICLES } from "@/data/timeline";
import ChonsuCalculator from "@/components/ChonsuCalculator";

export const metadata: Metadata = {
  title: "족보 이야기",
  description: "대동보와 파보의 차이, 본관과 시조, 항렬자 읽는 법, 촌수 계산법까지 족보 입문 가이드.",
};

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="serif text-3xl font-bold sm:text-4xl">족보 이야기</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-inksoft">
          족보를 처음 펼쳐본 사람을 위한 안내. 용어만 알아도 절반은 읽힙니다.
        </p>
      </header>

      {/* 목차 */}
      <nav className="card mb-10 p-5">
        <p className="mb-3 text-sm font-medium">목차</p>
        <ol className="grid gap-2 text-sm sm:grid-cols-2">
          {ARTICLES.map((a, i) => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="text-inksoft transition hover:text-accent">
                {i + 1}. {a.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#calculator" className="text-inksoft transition hover:text-accent">
              {ARTICLES.length + 1}. 촌수 계산기
            </a>
          </li>
        </ol>
      </nav>

      <div className="space-y-14">
        {ARTICLES.map((a) => (
          <section key={a.id} id={a.id} className="scroll-mt-24">
            <h2 className="serif text-2xl font-bold">{a.title}</h2>
            <p className="mt-1 text-sm text-inksoft">{a.summary}</p>
            <div className="mt-4 space-y-4">
              {a.body.map((p, i) => (
                <p key={i} className="leading-loose text-ink/90">
                  {renderBold(p)}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section id="calculator" className="scroll-mt-24">
          <h2 className="serif text-2xl font-bold">촌수 계산기</h2>
          <p className="mt-1 text-sm text-inksoft">관계를 하나씩 따라가면 촌수와 호칭이 나옵니다.</p>
          <div className="mt-4">
            <ChonsuCalculator />
          </div>
        </section>
      </div>
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
