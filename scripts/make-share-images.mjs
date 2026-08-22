/**
 * 스레드 홍보용 이미지를 **실제 화면에서** 다시 찍는다.
 *
 * 만들어 그린 그림이 아니라 진짜 결과 화면이라, 보는 사람이 "이걸 넣으면 저게 나오는구나"를
 * 바로 안다. 대신 화면 디자인이 바뀌면 이미지도 낡는다. 그때 이 스크립트를 다시 돌리면 된다.
 *
 * 쓰는 법
 *   1) npm run build && npx next start -p 3300
 *   2) node scripts/make-share-images.mjs
 *
 * 만들어지는 것
 *   public/share-kin.png      — 촌수 결과 + 내 촌수 랭킹
 *   public/share-fortune.png  — 사주 명식 + 오행 분포
 */

import { chromium } from "playwright";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3300";
// 예시 링크(길동 · 김해 김씨 30대손). 실명 대신 누구나 아는 이름을 쓴다.
const SAMPLE = "a2ltH-q5gO2VtB8zMB_quLjrj5k";

/** 홍보 이미지에 있을 필요가 없는 것들 */
const HIDE = `header.sticky, footer, aside[aria-label="광고"] { display: none !important }`;

const browser = await chromium.launch();
const page = await browser.newPage({
  // 540 × 2배 = 1080px. 스레드에서 선명하게 보이는 크기다.
  viewport: { width: 540, height: 1400 },
  deviceScaleFactor: 2,
});

// 광고 스크립트는 부르지 않는다 (느려지고 화면에 빈칸이 생긴다)
await page.route("**/ba.min.js", (r) => r.fulfill({ status: 200, body: "" }));

/* ── 1. 몇 촌일까 ── */
await page.goto(`${BASE}/kin?c=${SAMPLE}`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: HIDE });
await page.locator('input[aria-label="본관 검색"]').fill("김해");
await page.waitForTimeout(500);
await page.locator("ul li button").first().click();
await page.locator('input[aria-label="몇 대손인지"]').fill("33");
await page.waitForTimeout(900);
await page.evaluate(() => {
  // 결과만 남긴다 — 입력 단계와 안내 문구는 홍보 이미지에서 군더더기다
  document.querySelectorAll("main header, details").forEach((el) => el.remove());
  document.querySelectorAll("section.card").forEach((el) => {
    const t = el.textContent ?? "";
    if (t.includes("내 본관은?") || t.includes("몇 대손인가요?")) el.remove();
  });
  document.querySelectorAll("div.card").forEach((el) => {
    if ((el.textContent ?? "").includes("그럼 나랑은 몇 촌일까?")) el.remove();
  });
  document.querySelectorAll("p").forEach((el) => {
    if ((el.textContent ?? "").includes("이 브라우저에만")) el.remove();
  });
});
await page.waitForTimeout(200);
await page.locator("main > div").first().screenshot({ path: "public/share-kin.png" });
console.log("public/share-kin.png");

/* ── 2. 가문 운세 ── */
await page.goto(`${BASE}/fortune`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: HIDE });
await page.locator('input[aria-label="본관 검색"]').fill("김해");
await page.waitForTimeout(500);
await page.locator("ul li button").first().click();
await page.locator('input[aria-label="몇 대손인지"]').fill("30");
await page.locator("button", { hasText: "남자" }).click();
await page.locator('input[aria-label="양력 생년월일"]').fill("1995-03-21");
await page.waitForTimeout(300);
await page.locator("button", { hasText: "13~15 미시" }).click();
await page.waitForTimeout(900);
const article = page.locator("article");
await article.evaluate((el) => {
  // 명식과 오행 분포까지만. 해석 문단은 길어서 이미지가 세로로 늘어진다.
  el.querySelectorAll("section.mt-7").forEach((s, i) => {
    if (i > 1) s.remove();
  });
  el.querySelectorAll("ul.mt-8, div.mt-7").forEach((s) => s.remove());
});
await page.waitForTimeout(200);
await article.screenshot({ path: "public/share-fortune.png" });
console.log("public/share-fortune.png");

await browser.close();
