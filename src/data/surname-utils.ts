/**
 * "문화 류씨" → "문화", "함열 남궁씨" → "함열" 처럼 본관 이름만 떼어낸다.
 *
 * 두 가지를 신경 써야 한다.
 *  - 복성(남궁·황보·제갈·사공·선우·서문·독고)은 성이 두 글자다.
 *  - 표기가 둘인 성씨는 ko가 "유(류)" 처럼 들어온다. 괄호 안 표기로도 끊어봐야 한다.
 */
export function stripSurnameSuffix(clanName: string, surnameKo: string): string {
  const base = surnameKo.replace(/\(.*\)/, "").trim();
  const alt = surnameKo.match(/\(([^)]+)\)/)?.[1] ?? "";
  const candidates = [base, ...alt.split(/[/·,]/)].map((c) => c.trim()).filter(Boolean);

  for (const c of candidates) {
    const re = new RegExp(`\\s*${c}씨$`);
    if (re.test(clanName)) return clanName.replace(re, "").trim();
  }
  // 어느 표기와도 안 맞으면 마지막 한두 글자를 성으로 보고 떼어낸다
  return clanName.replace(/\s+[가-힣]{1,2}씨$/, "").trim();
}
