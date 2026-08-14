import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "뿌리찾기 — 나의 성씨와 가계를 찾아서",
    template: "%s | 뿌리찾기",
  },
  description:
    "한국인의 성씨와 본관, 시조의 유래를 찾아보고 나만의 가계도를 만들어보세요. 성씨 검색, 항렬 이야기, 역사 연대표까지.",
  keywords: ["족보", "성씨", "본관", "시조", "가계도", "항렬", "뿌리찾기"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.vercel.app"),
  openGraph: {
    title: "뿌리찾기 — 나의 성씨와 가계를 찾아서",
    description: "성씨의 유래와 본관, 시조를 찾아보고 나만의 가계도를 만들어보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "뿌리찾기",
  },
  twitter: {
    card: "summary_large_image",
    title: "뿌리찾기 — 나의 성씨와 가계를 찾아서",
    description: "성씨 75개, 본관 604개. 내 본관이 어디인지 찾아보세요.",
  },
};

const NAV = [
  { href: "/surnames", label: "성씨 찾기" },
  { href: "/joseon", label: "조선시대 나는?" },
  { href: "/family-tree", label: "가계도 만들기" },
  { href: "/history", label: "역사 연대표" },
  { href: "/stories", label: "족보 이야기" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3.5 sm:gap-6">
              <Link href="/" className="serif shrink-0 text-lg font-bold tracking-tight sm:text-xl">
                <span className="text-accent">뿌리</span>찾기
              </Link>
              <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm sm:gap-2">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="shrink-0 rounded-full px-3 py-1.5 text-inksoft transition hover:bg-line/60 hover:text-ink"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-20 border-t border-line bg-elev">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-inksoft">
              <p className="serif mb-3 text-base font-semibold text-ink">뿌리찾기</p>
              <p className="max-w-2xl leading-relaxed">
                성씨·본관 데이터는 통계청 「2015 인구주택총조사 성씨·본관 집계」와 공개된 문중 기록을 바탕으로 정리한
                교육·참고용 요약본입니다. 문중별 공식 족보와 세부 내용이 다를 수 있으며, 법적 효력을 갖지 않습니다.
              </p>
              <p className="mt-4">
                문의·오류 제보:{" "}
                <a
                  href="mailto:dbsqja9288@gmail.com"
                  className="text-accent underline underline-offset-2 transition hover:opacity-80"
                >
                  dbsqja9288@gmail.com
                </a>
              </p>
              <p className="mt-2 text-xs leading-relaxed opacity-80">
                「조선시대였다면 나는?」은 재미를 위한 콘텐츠이며, 실제 신분·혈통·가치와 무관합니다. 수록 내용에 사실과
                다른 부분이 있으면 위 메일로 알려주시면 확인 후 수정하겠습니다.
              </p>
              <p className="mt-4 text-xs opacity-70">© {new Date().getFullYear()} 뿌리찾기</p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
