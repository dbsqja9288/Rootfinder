import { chromium } from "playwright";

const B = "http://localhost:3000";
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1180, height: 1050 } });

// 샌드박스에서 구글 폰트가 막혀 hydration이 지연되므로 요청을 잘라낸다
await page.route("**fonts.g**", (r) => r.abort());

const results = [];
const P = (s) => {
  results.push(s);
  console.log(s);
};

const input = () => page.locator('input[aria-label="성씨 검색"]');

async function openList() {
  await page.goto(B + "/surnames", { waitUntil: "domcontentloaded" });
  // hydration 완료 대기: 초성 필터가 실제로 반응하는지로 확인
  await page.waitForLoadState("load");
  for (let i = 0; i < 40; i++) {
    await page.getByRole("button", { name: "ㅎ", exact: true }).click();
    await page.waitForTimeout(250);
    if ((await page.locator("ul > li").count()) < 40) break;
  }
  await page.getByRole("button", { name: "전체", exact: true }).click();
  await page.waitForTimeout(200);
}

async function type(q) {
  await input().fill("");
  await input().pressSequentially(q, { delay: 30 });
  await page.waitForTimeout(350);
  const n = await page.locator("ul > li").count();
  const first = n ? await page.locator("ul > li").first().innerText() : "";
  const name = first.split("\n")[1] ?? "없음";
  const badge = first.match(/(성씨|한자|로마자|본관|시조|인물|본문) 일치/)?.[0] ?? "-";
  P(`"${q}" → ${n}건 | 1위: ${name} (${badge})`);
  return n;
}

await openList();

P("── 검색어별 결과 ──");
await type("김");
await page.screenshot({ path: "/tmp/t_kim.png" });

await type("김해");
await page.screenshot({ path: "/tmp/t_gimhae.png" });

await type("최치원");
await page.screenshot({ path: "/tmp/t_choi.png" });

await type("鄭");
await type("Park");
await type("허황옥");
await type("사육신");

await type("스미스");
await page.screenshot({ path: "/tmp/t_empty.png" });

P("── 초성 필터 ──");
await input().fill("");
await page.waitForTimeout(200);
await page.getByRole("button", { name: "ㅅ", exact: true }).click();
await page.waitForTimeout(300);
P(`초성 ㅅ → ${await page.locator("ul > li").count()}건`);
await page.screenshot({ path: "/tmp/t_chosung.png" });

await input().pressSequentially("경주", { delay: 30 });
await page.waitForTimeout(350);
P(`초성 ㅅ + "경주" → ${await page.locator("ul > li").count()}건`);
await page.screenshot({ path: "/tmp/t_combo.png" });

P("── 홈 → 결과 → 상세 이동 ──");
await page.goto(B + "/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await input().fill("김해");
await page.getByRole("button", { name: "검색" }).click();
await page.waitForURL("**/surnames?q=*");
await page.waitForTimeout(800);
P(`홈에서 "김해" 검색 → ${await page.locator("ul > li").count()}건 (URL 파라미터 전달 OK)`);
await page.screenshot({ path: "/tmp/t_homeflow.png" });

const href = await page.locator("ul > li a").first().getAttribute("href");
await page.locator("ul > li a").first().click();
await page.waitForURL(`**${href}`);
await page.waitForTimeout(500);
P(`첫 카드 클릭 → ${new URL(page.url()).pathname} | 제목: ${await page.locator("h1").innerText()}`);

P("── 촌수 계산기 ──");
await page.goto(B + "/stories#calculator", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
for (const [label, expect] of [
  ["아버지", "1촌"],
  ["형·오빠·남동생", "3촌"],
  ["아들", "4촌"],
]) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.waitForTimeout(200);
  const txt = await page.locator("#calculator").innerText();
  const chon = txt.match(/(무촌 \(배우자\)|\d+촌)/)?.[0];
  const hoching = txt.match(/호칭:\s*(.+)/)?.[1];
  P(`"${label}" 추가 → ${chon} / 호칭: ${hoching} (기대: ${expect})`);
}
await page.screenshot({ path: "/tmp/t_chonsu.png" });

await browser.close();
