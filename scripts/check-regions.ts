/**
 * 본관 지역이 잘못 붙는 것을 막는 검사기.
 *
 * "광주 이씨(廣州, 경기)"와 "광주 노씨(光州, 전라)"처럼 한글 이름이 같은데 고을이 다른 본관은
 * 한자로 갈라줘야 한다. 갈라주지 않으면 둘 중 하나는 반드시 틀린 지역이 표시된다.
 *
 * 실제로 이 문제로 정정 요청을 받았다(광주 이씨). 그래서 사람이 아니라 기계가 잡게 한다.
 *
 *   npm run check:regions
 *
 * 새 본관을 넣다가 한글이 겹치면 여기서 걸린다.
 * 그때 src/data/regions.ts 의 REGIONS_BY_HANJA 에 한자별 지역을 추가하면 된다.
 */
import { SURNAMES } from "../src/data/surnames";
import { stripSurnameSuffix } from "../src/data/surname-utils";
import { REGIONS_BY_HANJA } from "../src/data/regions";

const byName = new Map<string, Map<string, string[]>>();

for (const s of SURNAMES) {
  for (const c of s.clans) {
    if (!c.hanja) continue;
    const name = stripSurnameSuffix(c.name, s.ko).replace(/\(.*\)$/, "").trim();
    if (!byName.has(name)) byName.set(name, new Map());
    const m = byName.get(name)!;
    if (!m.has(c.hanja)) m.set(c.hanja, []);
    m.get(c.hanja)!.push(`${name} ${s.ko}씨`);
  }
}

const problems: string[] = [];
let ambiguous = 0;

for (const [name, m] of byName) {
  if (m.size < 2) continue;
  ambiguous++;
  for (const [hanja, list] of m) {
    if (!REGIONS_BY_HANJA[hanja]) {
      problems.push(`  ${name} (${hanja}) — ${list.join(", ")}`);
    }
  }
}

if (problems.length) {
  console.error("❌ 한자로 갈라주지 않은 동음이의 본관이 있습니다:\n");
  console.error(problems.join("\n"));
  console.error("\nsrc/data/regions.ts 의 REGIONS_BY_HANJA 에 한자별 지역을 추가하세요.");
  process.exit(1);
}

console.log(`✅ 본관 지역 검사 통과 — 동음이의 본관 ${ambiguous}건이 모두 한자로 갈려 있습니다.`);
