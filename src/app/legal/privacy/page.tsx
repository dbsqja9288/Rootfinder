import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "뿌리찾기가 수집하는 정보와 처리 방식, 쿠키 사용, 이용자의 권리를 안내합니다.",
};

/** 방침을 고칠 때 이 날짜도 함께 올린다. */
const UPDATED = "2026년 8월 16일";
const EMAIL = "dbsqja9288@gmail.com";

export default function PrivacyPage() {
  return (
    <>
      <header>
        <h1 className="serif text-3xl font-bold">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-inksoft">최종 개정일: {UPDATED}</p>
      </header>

      <p>
        뿌리찾기(이하 &lsquo;사이트&rsquo;)는 이용자의 개인정보를 소중히 다룹니다. 이 방침은 사이트가 어떤 정보를
        어떻게 다루는지 설명합니다.
      </p>

      <Section title="1. 회원가입을 받지 않습니다">
        <p>
          사이트는 회원가입, 로그인 기능이 없습니다. 따라서 이름, 생년월일, 연락처, 주소와 같은 개인을 식별할 수
          있는 정보를 <strong>수집하지도, 저장하지도 않습니다.</strong>
        </p>
      </Section>

      <Section title="2. 입력하신 내용은 저장되지 않습니다">
        <p>
          성씨·본관 검색, 「조선시대였다면 나는?」의 본관·MBTI 선택, 가계도 만들기에 입력하신 내용은 모두{" "}
          <strong>이용자의 브라우저 안에서만 처리</strong>되며 서버로 전송되거나 저장되지 않습니다. 브라우저를 닫으면
          사라집니다.
        </p>
      </Section>

      <Section title="3. 방문 통계">
        <p>
          사이트 개선을 위해 Vercel Analytics로 방문 통계를 봅니다. 이 도구는 개인을 식별하지 않는 형태로 페이지 조회
          수, 유입 경로, 대략적인 국가·기기 정보만 집계하며, 이용자를 추적하는 쿠키를 사용하지 않습니다.
        </p>
      </Section>

      <Section title="4. 광고와 쿠키">
        <p>
          사이트는 운영 비용을 위해 Google AdSense, 카카오 AdFit 등의 광고를 게재할 수 있습니다. 이때 해당 광고
          사업자는 이용자의 관심사에 맞는 광고를 보여주기 위해 쿠키를 사용할 수 있습니다.
        </p>
        <ul>
          <li>
            Google의 광고 쿠키 사용 방식과 거부 방법:{" "}
            <ExtLink href="https://policies.google.com/technologies/ads?hl=ko">
              Google 광고 및 개인정보처리방침
            </ExtLink>
          </li>
          <li>
            맞춤 광고 일괄 거부:{" "}
            <ExtLink href="https://www.aboutads.info/choices/">aboutads.info</ExtLink>
          </li>
          <li>브라우저 설정에서 쿠키를 직접 차단하실 수도 있습니다.</li>
        </ul>
        <p>
          광고 쿠키는 광고 사업자가 관리하며, 사이트 운영자는 이를 통해 수집되는 정보에 접근하지 않습니다.
        </p>
      </Section>

      <Section title="5. 제3자 제공 및 위탁">
        <p>
          수집하는 개인정보가 없으므로 제3자에게 제공하거나 처리를 위탁하는 개인정보도 없습니다. 다만 사이트는 Vercel
          Inc.의 호스팅 환경에서 운영되며, 서버 접속 과정에서 접속 기록이 일시적으로 남을 수 있습니다.
        </p>
      </Section>

      <Section title="6. 이용자의 권리">
        <p>
          사이트가 보관하는 개인정보가 없어 열람·정정·삭제를 요청할 대상이 없습니다. 다만 사이트에 게시된 내용 중
          본인 또는 문중과 관련해 사실과 다르거나 삭제가 필요한 부분이 있다면 아래 메일로 알려주시기 바랍니다. 확인
          후 신속히 조치하겠습니다.
        </p>
      </Section>

      <Section title="7. 아동의 개인정보">
        <p>
          사이트는 만 14세 미만 아동을 대상으로 하지 않으며, 아동으로부터 의도적으로 개인정보를 수집하지 않습니다.
        </p>
      </Section>

      <Section title="8. 문의처">
        <p>
          개인정보 관련 문의 및 오류 제보:{" "}
          <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-2">
            {EMAIL}
          </a>
        </p>
      </Section>

      <Section title="9. 방침의 변경">
        <p>
          이 방침이 바뀌면 이 페이지에 개정 내용과 시행일을 알립니다. 중요한 변경이 있을 경우 시행 7일 전부터
          알리겠습니다.
        </p>
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

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2"
    >
      {children}
    </a>
  );
}
