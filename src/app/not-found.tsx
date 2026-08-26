import type { Metadata } from "next";
import Link from "next/link";

/**
 * 없는 주소로 들어왔을 때.
 *
 * 검색엔진 관점에서 중요한 건 두 가지다.
 *  1) 이 페이지는 **진짜 404 상태코드**로 나가야 한다. (Next가 알아서 해 준다)
 *     200으로 나가면 구글이 "빈 페이지가 잔뜩 있는 사이트"로 본다.
 *  2) 여기서 길이 끊기면 안 된다. 크롤러도 사람도 갈 곳을 줘야 한다.
 */
export const metadata: Metadata = {
  title: "찾는 페이지가 없습니다",
  description: "주소가 바뀌었거나 아직 만들지 않은 페이지입니다. 성씨 찾기·조선시대 신분·촌수 계산으로 이동하실 수 있습니다.",
  robots: { index: false, follow: true },
};

const GO = [
  { href: "/surnames", label: "성씨 찾기", desc: "성씨 141개 · 본관 761개" },
  { href: "/joseon", label: "조선시대였다면 나는?", desc: "본관 + MBTI로 보는 가문 등급" },
  { href: "/kin", label: "이 사람과 몇 촌일까", desc: "본관과 대손으로 촌수 짐작하기" },
  { href: "/fortune", label: "우리 가문 운세", desc: "사주 여덟 글자와 본관" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <p className="serif text-6xl font-bold text-accent/30">404</p>
      <h1 className="serif mt-3 text-3xl font-bold">찾는 페이지가 없습니다</h1>
      <p className="mt-3 leading-relaxed text-inksoft">
        주소가 바뀌었거나, 아직 만들지 않은 페이지입니다. 아래에서 원하시는 곳으로 가실 수 있습니다.
      </p>

      <ul className="mt-8 space-y-3">
        {GO.map((g) => (
          <li key={g.href}>
            <Link
              prefetch={false}
              href={g.href}
              className="card flex items-center justify-between p-5 transition hover:border-accent"
            >
              <span>
                <span className="font-medium">{g.label}</span>
                <span className="mt-0.5 block text-sm text-inksoft">{g.desc}</span>
              </span>
              <span className="text-inksoft">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-inksoft">
        찾으시던 본관이 없어서 오셨다면{" "}
        <a
          href="mailto:dbsqja9288@gmail.com"
          className="text-accent underline underline-offset-2 transition hover:opacity-80"
        >
          알려주세요
        </a>
        . 확인 후 추가하겠습니다.
      </p>
    </div>
  );
}
