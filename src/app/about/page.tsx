import type { Metadata } from "next";
import Link from "next/link";
import { SURNAMES, TOTAL_CLAN_COUNT } from "@/data/surnames";

export const metadata: Metadata = {
  title: "사이트 소개",
  description:
    "뿌리찾기는 한국인의 성씨와 본관, 시조의 유래를 찾아보는 무료 서비스입니다. 자료의 출처와 만든 이유를 소개합니다.",
};

const EMAIL = "dbsqja9288@gmail.com";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="serif text-3xl font-bold sm:text-4xl">사이트 소개</h1>
        <p className="mt-2 leading-relaxed text-inksoft">
          내 성씨가 어디서 시작됐는지, 본관이 지금 어디인지 찾아보는 곳입니다.
        </p>
      </header>

      <div className="space-y-10 leading-relaxed">
        <section className="space-y-3">
          <h2 className="serif text-xl font-bold">왜 만들었나</h2>
          <p className="text-inksoft">
            &ldquo;너 본관이 어디니?&rdquo; 라는 질문에 선뜻 답하는 사람은 많지 않습니다. 안다고 해도 그곳이 지금
            어디인지, 시조가 누구인지까지 아는 경우는 드뭅니다. 족보는 집안 어른의 서랍에 있고, 인터넷에 흩어진
            정보는 문중 홈페이지마다 형식이 달라 읽기가 어렵습니다.
          </p>
          <p className="text-inksoft">
            그래서 <strong className="text-ink">본관 하나를 페이지 하나로</strong> 삼았습니다. &lsquo;해평 윤씨&rsquo;를
            검색하면 해평 윤씨의 시조와 그 고을이 오늘날 어디인지, 같은 성씨의 다른 본관은 무엇이 있는지 한 화면에서
            보입니다. 지금 {SURNAMES.length}개 성씨, {TOTAL_CLAN_COUNT.toLocaleString()}개 본관을 다룹니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="serif text-xl font-bold">자료는 어디서 왔나</h2>
          <ul className="space-y-2 text-inksoft [&>li]:ml-5 [&>li]:list-disc">
            <li>
              인구와 본관 목록: 통계청 「2015 인구주택총조사 성씨·본관 집계」
            </li>
            <li>시조와 유래: 각 문중·종친회가 공개한 기록과 공개 사전류</li>
            <li>본관의 현재 행정구역: 공개된 지명 연혁 자료</li>
          </ul>
          <p className="text-inksoft">
            정리하면서 가장 신경 쓴 것은 <strong className="text-ink">모르는 것을 아는 척하지 않는 일</strong>입니다.
            기록이 갈리는 부분은 &lsquo;∼로 전한다&rsquo;고 적었고, 관직 기록이 남지 않은 본관은 그 사실을 그대로
            적었습니다. 없는 것을 채워 넣는 것보다 비워두는 편이 낫다고 생각합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="serif text-xl font-bold">이것만은 분명히</h2>
          <p className="text-inksoft">
            이 사이트는 교육·참고용 요약본입니다. 문중별 공식 족보와 다를 수 있고,{" "}
            <strong className="text-ink">법적 효력을 갖지 않습니다.</strong> 정확한 확인은 해당 종친회·대종회를 통해
            주시기 바랍니다.
          </p>
          <p className="text-inksoft">
            「조선시대였다면 나는?」은 재미를 위한 콘텐츠입니다. 공개 기록의 양을 임의로 점수화한 것일 뿐, 실제
            신분이나 혈통, 사람의 가치와는 아무 관련이 없습니다. 가문을 줄 세우려고 만든 것이 아니라, 오늘의 우리
            대부분이 이름 없이 살아간 사람들의 후손이라는 걸 보여주고 싶었습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="serif text-xl font-bold">오류를 발견하셨다면</h2>
          <p className="text-inksoft">
            사실과 다른 부분이 있으면 알려주십시오. 특히 문중 관계자분들의 정정 요청은 우선해서 반영하겠습니다.
            삭제를 원하시는 경우에도 같은 메일로 연락 주시면 검토 후 조치하겠습니다.
          </p>
          <p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-accent underline underline-offset-2 transition hover:opacity-80"
            >
              {EMAIL}
            </a>
          </p>
        </section>

        <section className="space-y-3 border-t border-line pt-8">
          <h2 className="serif text-xl font-bold">둘러보기</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <NavCard href="/surnames" title="성씨 찾기" desc="내 성씨와 본관을 검색합니다" />
            <NavCard href="/joseon" title="조선시대 나는?" desc="본관과 MBTI로 보는 재미 콘텐츠" />
            <NavCard href="/stories" title="족보 이야기" desc="본관·항렬·촌수를 처음부터" />
            <NavCard href="/history" title="역사 연대표" desc="성씨가 만들어진 흐름" />
          </div>
        </section>
      </div>
    </div>
  );
}

function NavCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-4 transition hover:border-accent">
      <p className="serif font-bold">{title}</p>
      <p className="mt-1 text-sm text-inksoft">{desc}</p>
    </Link>
  );
}
