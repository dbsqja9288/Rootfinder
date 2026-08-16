import type { Metadata } from "next";
import Link from "next/link";
import { CORRECTIONS } from "@/data/corrections";

export const metadata: Metadata = {
  title: "정정 내역",
  description:
    "이용자 제보로 바로잡은 성씨·본관 정보를 공개합니다. 무엇이 어떻게 틀렸고 어떻게 고쳤는지 기록합니다.",
};

const EMAIL = "dbsqja9288@gmail.com";

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="serif text-3xl font-bold sm:text-4xl">정정 내역</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-inksoft">
          제보를 받아 바로잡은 내용을 공개로 남깁니다. 무엇이 틀렸는지 감추지 않는 편이, 남은 자료를 믿을 수 있게
          하는 길이라고 생각합니다.
        </p>
      </header>

      <div className="card mb-10 border-l-4 border-l-celadon p-5 text-sm leading-relaxed">
        <p>
          <strong>제보하신 내용이 여기 있는지 먼저 확인해 주세요.</strong> 이미 고친 것일 수 있습니다. 없다면 각 본관
          페이지 아래 &lsquo;잘못된 정보 알려주기&rsquo; 버튼을 눌러 주십시오. 어느 항목인지 미리 채워진 메일이
          열립니다.
        </p>
        <p className="mt-2 text-inksoft">
          문의:{" "}
          <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-2">
            {EMAIL}
          </a>
        </p>
      </div>

      <ol className="space-y-4">
        {CORRECTIONS.map((c, i) => (
          <li key={i} className="card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="serif font-bold">{c.target}</p>
              <time className="text-xs text-inksoft">{c.date}</time>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-inksoft">이전</dt>
                <dd className="text-inksoft line-through decoration-inksoft/40">{c.before}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-inksoft">수정</dt>
                <dd className="font-medium text-accent">{c.after}</dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-inksoft">{c.reason}</p>

            {c.href && (
              <Link
                href={c.href}
                className="mt-3 inline-block text-sm text-accent underline underline-offset-2"
              >
                해당 페이지 보기 →
              </Link>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm leading-relaxed text-inksoft">
        제보해 주신 분들께 감사드립니다. 특히 문중 기록을 알고 계신 분들의 지적이 이 사이트를 정확하게 만듭니다.
      </p>
    </div>
  );
}
