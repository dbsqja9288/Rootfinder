import type { Metadata } from "next";

export const metadata: Metadata = {
  // 정식 주소. 미리보기 도메인·물음표 붙은 주소가 따로 색인되지 않게 한다.
  alternates: { canonical: "/legal/terms" },
  title: "이용약관",
  description: "뿌리찾기 서비스의 이용 조건과 콘텐츠의 성격, 책임의 범위를 안내합니다.",
};

const UPDATED = "2026년 8월 16일";
const EMAIL = "dbsqja9288@gmail.com";

export default function TermsPage() {
  return (
    <>
      <header>
        <h1 className="serif text-3xl font-bold">이용약관</h1>
        <p className="mt-2 text-sm text-inksoft">최종 개정일: {UPDATED}</p>
      </header>

      <p>
        이 약관은 뿌리찾기(이하 &lsquo;사이트&rsquo;)를 이용하실 때 적용되는 조건을 정합니다. 사이트를 이용하시면 이
        약관에 동의한 것으로 봅니다.
      </p>

      <Section title="1. 서비스의 성격">
        <p>
          사이트는 한국인의 성씨와 본관, 시조의 유래를 찾아보는 <strong>무료 교육·참고용 서비스</strong>입니다.
          회원가입이나 결제 없이 누구나 이용할 수 있습니다.
        </p>
      </Section>

      <Section title="2. 자료의 출처와 한계">
        <p>
          수록된 성씨·본관 자료는 통계청 「2015 인구주택총조사 성씨·본관 집계」와 공개된 문중 기록을 바탕으로 정리한
          요약본입니다. 다음을 유의해 주십시오.
        </p>
        <ul>
          <li>문중별 공식 족보와 세부 내용이 다를 수 있습니다.</li>
          <li>실전(實傳) 본관과 문헌에만 남은 본관이 함께 실려 있습니다.</li>
          <li>같은 이름의 본관이라도 계통이 다를 수 있습니다.</li>
          <li>완전한 목록이 아니며, 누락된 성씨·본관이 있을 수 있습니다.</li>
        </ul>
        <p>
          <strong>사이트의 내용은 어떠한 법적 효력도 갖지 않습니다.</strong> 정확한 확인은 해당 종친회·대종회를 통해
          주시기 바랍니다.
        </p>
      </Section>

      <Section title="3. 「조선시대였다면 나는?」에 대하여">
        <p>
          이 콘텐츠는 <strong>순전히 재미를 위한 것</strong>입니다. 공개된 기록의 양을 임의의 기준으로 점수화한
          결과일 뿐, 특정 가문이나 개인의 실제 신분·혈통·능력·가치와는 아무런 관련이 없습니다. 어떤 형태로든 사람을
          평가하거나 차별하는 근거로 사용될 수 없습니다.
        </p>
      </Section>

      <Section title="4. 이용자의 의무">
        <p>이용자는 사이트를 이용하면서 다음 행위를 해서는 안 됩니다.</p>
        <ul>
          <li>자동화된 수단으로 과도한 부하를 일으키거나 자료를 대량 수집하는 행위</li>
          <li>사이트의 내용을 특정 개인·집단을 비방하거나 차별하는 데 사용하는 행위</li>
          <li>사이트의 정상적인 운영을 방해하는 행위</li>
        </ul>
      </Section>

      <Section title="5. 저작권">
        <p>
          사이트가 직접 작성한 해설·구성·디자인의 저작권은 운영자에게 있습니다. 개인적·비영리 목적의 인용은 출처를
          밝히면 자유롭게 하실 수 있습니다. 다만 자료 전체 또는 상당 부분을 복제해 별도의 서비스를 만드는 행위는
          삼가 주십시오.
        </p>
        <p>
          사이트에 인용된 역사적 사실과 공공 통계 자료 자체에는 저작권이 미치지 않습니다.
        </p>
      </Section>

      <Section title="6. 책임의 한계">
        <p>
          사이트는 자료의 정확성을 위해 노력하지만, 내용의 완전성이나 최신성을 보증하지 않습니다. 사이트의 정보를
          신뢰해 내린 판단으로 발생한 손해에 대해 운영자는 책임을 지지 않습니다.
        </p>
        <p>
          사이트는 무료로 제공되며, 서비스의 중단·변경·종료가 있을 수 있습니다.
        </p>
      </Section>

      <Section title="7. 오류 제보와 정정">
        <p>
          사실과 다른 내용을 발견하시면{" "}
          <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-2">
            {EMAIL}
          </a>
          로 알려주십시오. 확인 후 수정하겠습니다. 특정 문중에서 삭제를 요청하시는 경우에도 같은 메일로 연락 주시면
          검토 후 조치하겠습니다.
        </p>
      </Section>

      <Section title="8. 약관의 변경">
        <p>이 약관이 바뀌면 이 페이지에 개정 내용과 시행일을 알립니다.</p>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-line pt-6">
      <h2 className="serif text-lg font-bold">{title}</h2>
      <div className="space-y-3 text-inksoft [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">{children}</div>
    </section>
  );
}
