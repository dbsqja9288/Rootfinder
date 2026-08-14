import type { Metadata } from "next";
import { SURNAMES } from "@/data/surnames";
import SurnameBrowser from "@/components/SurnameBrowser";

export const metadata: Metadata = {
  title: "성씨 찾기",
  description: "한글, 한자, 본관, 시조 이름으로 성씨를 검색하고 유래를 확인해보세요.",
};

export default async function SurnamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="serif text-3xl font-bold sm:text-4xl">성씨 찾기</h1>
        <p className="mt-2 text-inksoft">
          한글·한자는 물론 본관(예: 김해)이나 시조 이름(예: 최치원)으로도 찾을 수 있습니다.
        </p>
      </header>
      <SurnameBrowser surnames={SURNAMES} initialQuery={q ?? ""} />
    </div>
  );
}
