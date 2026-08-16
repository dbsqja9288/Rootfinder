import Link from "next/link";
import { SURNAMES, TOTAL_CLAN_COUNT } from "@/data/surnames";
import HomeSearch from "@/components/HomeSearch";
import JsonLd, { websiteSchema } from "@/components/JsonLd";

export default function Home() {
  const top = SURNAMES.slice(0, 12);

  return (
    <div>
      <JsonLd data={websiteSchema()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        {/* 장식: 세대를 잇는 선과 낙관 */}
        <div className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 lg:block">
          <svg width="360" height="360" viewBox="0 0 360 360" fill="none" aria-hidden>
            <g stroke="currentColor" className="text-accent" strokeWidth="1" opacity="0.28">
              <path d="M180 40 V95 M60 150 H300 M60 150 V190 M180 150 V190 M300 150 V190 M180 95 V150" />
              <path d="M60 245 H180 M60 245 V285 M180 245 V285 M120 190 V245" />
            </g>
            {[
              [180, 40],
              [60, 190],
              [180, 190],
              [300, 190],
              [60, 285],
              [180, 285],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i === 0 ? 16 : 11} className="fill-accent" opacity={0.16} />
            ))}
            <rect x="236" y="252" width="74" height="74" rx="8" className="fill-accent" opacity="0.1" />
            <text
              x="273"
              y="303"
              textAnchor="middle"
              className="fill-accent serif"
              fontSize="42"
              fontWeight="700"
              opacity="0.5"
            >
              族
            </text>
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="fade-up max-w-2xl">
            <p className="mb-4 inline-block rounded-full border border-line bg-elev px-3 py-1 text-xs text-inksoft">
              성씨 {SURNAMES.length}개 · 본관 {TOTAL_CLAN_COUNT.toLocaleString()}개 수록
            </p>
            <h1 className="serif text-4xl leading-tight font-bold sm:text-6xl">
              나의 성(姓)은
              <br />
              어디에서 왔을까
            </h1>
            <p className="mt-5 text-base leading-relaxed text-inksoft sm:text-lg">
              성씨의 유래와 본관, 시조를 찾아보고 나만의 가계도를 만들어보세요.
              <br className="hidden sm:block" />
              천 년을 건너온 이름 한 글자에 담긴 이야기를 펼쳐봅니다.
            </p>

            <div className="mt-8">
              <HomeSearch />
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="text-inksoft">인기 검색:</span>
              {["김", "이", "박", "최", "정"].map((k) => (
                <Link
                  key={k}
                  href={`/surnames?q=${encodeURIComponent(k)}`}
                  className="rounded-full border border-line px-3 py-0.5 transition hover:border-accent hover:text-accent"
                >
                  {k}씨
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 인기 성씨 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="serif text-2xl font-bold sm:text-3xl">인구가 많은 성씨</h2>
            <p className="mt-1 text-sm text-inksoft">2015년 인구주택총조사 기준</p>
          </div>
          <Link href="/surnames" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {top.map((s) => (
            <Link
              key={s.id}
              href={`/surnames/${s.id}`}
              className="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
            >
              <span className="serif flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent">
                {s.hanja}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{s.ko}씨</span>
                <span className="block truncate text-xs text-inksoft">
                  {s.rank}위 · {(s.population / 10000).toFixed(0)}만명
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/joseon",
              emoji: "🎎",
              title: "조선시대였다면 나는?",
              desc: "본관과 MBTI를 고르면 우리 가문의 등급과 내 직업이 나옵니다. 대장장이일까요, 영의정일까요.",
            },
            {
              href: "/family-tree",
              emoji: "🌳",
              title: "가계도 만들기",
              desc: "가족을 입력하면 한 장의 가계도로 그려 드립니다. 이미지로 저장해 가족 단톡방에 공유해보세요.",
            },
            {
              href: "/history",
              emoji: "📜",
              title: "역사 연대표",
              desc: "고조선부터 오늘까지, 성씨와 본관 제도가 어떻게 만들어졌는지 시대순으로 짚어봅니다.",
            },
            {
              href: "/stories",
              emoji: "🧭",
              title: "족보 이야기",
              desc: "대동보와 파보의 차이, 항렬자 읽는 법, 촌수 계산법까지. 족보를 처음 보는 사람을 위한 안내.",
            },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="card group p-6 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
            >
              <div className="mb-3 text-3xl">{f.emoji}</div>
              <h3 className="serif mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-inksoft">{f.desc}</p>
              <span className="mt-4 inline-block text-sm text-accent opacity-0 transition group-hover:opacity-100">
                바로가기 →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
