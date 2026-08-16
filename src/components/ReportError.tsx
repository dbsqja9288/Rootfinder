import { SITE_URL } from "@/lib/site";

const EMAIL = "dbsqja9288@gmail.com";

/**
 * 오류 제보 버튼.
 *
 * 그냥 메일 주소만 걸어두면 "광주 이씨가 틀렸어요" 같은 한 줄 메일이 오고,
 * 어느 페이지인지·무엇이 어떻게 틀렸는지 되묻느라 왕복이 생긴다.
 *
 * 그래서 메일 제목과 본문을 미리 채워서 연다.
 * 페이지 주소, 현재 화면에 표시된 값이 이미 적혀 있으니 제보자는 아는 것만 채우면 되고,
 * 받는 쪽은 한 번에 판단할 수 있다.
 */
export default function ReportError({
  fullName,
  href,
  hanja,
  founder,
  region,
}: {
  fullName: string;
  href: string;
  hanja?: string;
  founder?: string;
  region?: string;
}) {
  const subject = `[정보 정정] ${fullName}`;

  const body = [
    `${fullName} 정보에 대한 정정 요청입니다.`,
    "",
    "─── 아래는 현재 사이트에 표시된 내용입니다 (수정하지 마세요) ───",
    `페이지: ${SITE_URL}${href}`,
    `본관 한자: ${hanja || "표시 없음"}`,
    `시조: ${founder || "표시 없음"}`,
    `본관 지역: ${region || "표시 없음"}`,
    "──────────────────────────────────────────",
    "",
    "■ 어느 항목이 잘못되었나요?",
    "   (예: 본관 지역)",
    "",
    "■ 올바른 내용은 무엇인가요?",
    "   ",
    "",
    "■ 근거가 되는 자료가 있다면 알려주세요 (선택)",
    "   (예: 대종회 홈페이지 주소, 족보 이름, 문헌명 등)",
    "",
    "",
    "확인 후 수정하고 회신드리겠습니다. 제보해주셔서 감사합니다.",
  ].join("\n");

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="mt-12 rounded-2xl border border-line bg-elev p-5">
      <p className="serif font-bold">이 내용이 문중 기록과 다른가요?</p>
      <p className="mt-1.5 text-sm leading-relaxed text-inksoft">
        공개된 자료를 정리한 요약본이라 문중 기록과 다를 수 있습니다. 알려주시면 확인 후 수정하고 회신드립니다.
        아래 버튼을 누르면 어느 항목인지 미리 채워진 메일이 열립니다.
      </p>
      <a
        href={mailto}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-accent px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-white dark:hover:text-stone-900"
      >
        잘못된 정보 알려주기
      </a>
    </section>
  );
}
