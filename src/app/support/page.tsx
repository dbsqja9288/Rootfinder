import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { SURNAMES, TOTAL_CLAN_COUNT } from "@/data/surnames";

export const metadata: Metadata = {
  // 정식 주소. 미리보기 도메인·물음표 붙은 주소가 따로 색인되지 않게 한다.
  alternates: { canonical: "/support" },
  title: "후원하기",
  description: "뿌리찾기는 광고 없이 무료로 운영됩니다. 계속 다듬을 수 있도록 도와주세요.",
};

const BANK = "국민은행";
const ACCOUNT = "94290200649406";
const HOLDER = "윤범진";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="serif text-3xl font-bold sm:text-4xl">후원하기</h1>
        <p className="mt-2 leading-relaxed text-inksoft">
          뿌리찾기는 한 사람이 만들고 고치는 사이트입니다.
        </p>
      </header>

      <div className="space-y-6 leading-relaxed">
        <p>
          지금 {SURNAMES.length}개 성씨, {TOTAL_CLAN_COUNT.toLocaleString()}개 본관을 다루고 있습니다. 처음에는
          훨씬 적었는데, &ldquo;우리 성씨가 없어요&rdquo;, &ldquo;이 본관 지역이 틀렸어요&rdquo; 하고 알려주신
          분들 덕분에 하나씩 늘고 정확해졌습니다.
        </p>
        <p>
          자료를 확인하고 고치는 데는 시간이 듭니다. 도메인과 서버 비용도 듭니다. 커피 한 잔 값이라도 보태주시면
          더 오래, 더 정확하게 만들 수 있습니다.
        </p>
        <p className="text-inksoft">
          <strong className="text-ink">후원하지 않으셔도 모든 기능은 그대로 무료입니다.</strong> 잠그거나 가리는
          내용은 없습니다.
        </p>
      </div>

      {/* 계좌 */}
      <section className="card mt-10 p-6">
        <p className="serif text-lg font-bold">계좌로 보내기</p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-elev p-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-inksoft">{BANK}</p>
              <p className="mt-0.5 truncate font-mono text-lg font-medium tracking-tight">{ACCOUNT}</p>
              <p className="mt-0.5 text-sm text-inksoft">예금주 {HOLDER}</p>
            </div>
            <CopyButton value={ACCOUNT} label="계좌 복사" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-line p-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-inksoft">은행 앱에 붙여넣기 좋은 형태</p>
              <p className="mt-0.5 truncate text-sm">
                {BANK} {ACCOUNT}
              </p>
            </div>
            <CopyButton value={`${BANK} ${ACCOUNT}`} label="전체 복사" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-inksoft">
          보내실 때 <strong className="text-ink">보내는 분 이름 뒤에 한 마디</strong>를 남겨주시면 큰 힘이 됩니다.
          &ldquo;해평윤씨&rdquo; 처럼 본관을 적어주셔도 좋고요.
        </p>
      </section>

      {/* 돈 말고도 */}
      <section className="mt-10">
        <h2 className="serif mb-3 text-xl font-bold">돈이 아니어도 도울 수 있습니다</h2>
        <p className="mb-4 text-sm leading-relaxed text-inksoft">
          솔직히 말하면 이쪽이 더 도움이 됩니다.
        </p>
        <ul className="space-y-3">
          <li className="card p-4 text-sm leading-relaxed">
            <strong>틀린 내용을 알려주세요.</strong> 각 본관 페이지 아래 &lsquo;잘못된 정보 알려주기&rsquo;
            버튼이 있습니다. 실제로 이 제보들로 여러 건을 바로잡았습니다.{" "}
            <Link prefetch={false} href="/corrections" className="text-accent underline underline-offset-2">
              정정 내역
            </Link>
            에서 보실 수 있습니다.
          </li>
          <li className="card p-4 text-sm leading-relaxed">
            <strong>없는 성씨를 알려주세요.</strong> 통계에 잡히지 않는 희귀 성씨는 아직 빠진 것이 있습니다.
          </li>
          <li className="card p-4 text-sm leading-relaxed">
            <strong>친구에게 알려주세요.</strong> 본관을 모르는 사람이 생각보다 많습니다.
          </li>
        </ul>
      </section>

      <p className="mt-10 text-sm leading-relaxed text-inksoft">
        후원은 대가 없는 선물로 받습니다. 별도의 혜택이나 상품을 드리지 않으며, 세금계산서·현금영수증은 발행하지
        않습니다. 문의는{" "}
        <a href="mailto:dbsqja9288@gmail.com" className="text-accent underline underline-offset-2">
          dbsqja9288@gmail.com
        </a>
        으로 주세요.
      </p>
    </div>
  );
}
