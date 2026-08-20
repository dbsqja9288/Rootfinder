/**
 * 스레드와 X가 함께 쓰는 게시 소재.
 *
 * 소재는 A/B 두 개로 고정한다. 실행할 때마다 번갈아 올려서 어느 쪽이 잘 먹히는지 비교한다.
 *
 * ┌─ 문구를 바꾸고 싶을 때 ─────────────────────────────┐
 * │ 아래 A_PICK 값만 바꾸면 된다. 다른 건 손댈 필요 없다.  │
 * │   예) const A_PICK = "가족반응";                      │
 * └──────────────────────────────────────────────────┘
 */

export const SITE = (process.env.SITE_URL ?? "https://rootfinder.kr").replace(/\/$/, "");

/**
 * ★ A 소재 문구 고르기
 *
 *   "rotate"  → 아래 6개를 돌아가며 쓴다 (기본값, 권장)
 *   "질문"     → 그 하나만 계속 쓴다
 *
 * 하루에 여러 번 올릴 때 같은 문장을 반복하면 스팸으로 보인다.
 * 사람도 지겨워하고, 플랫폼도 반복 게시물의 노출을 줄인다.
 * 소재(조선시대 신분)는 그대로 두고 말만 바꾸는 것이라 A/B 비교에는 지장이 없다.
 */
const A_PICK = "rotate";

/**
 * A 소재 후보들 — 조선시대 신분 확인이 미끼다.
 *
 * 톤은 전부 "광고가 아니라 그냥 해보고 신기해서 올린 글"에 맞췄다.
 * 짧은 줄, ㅋㅋ, 존댓말 없음. 광고 같아 보이는 순간 스크롤로 넘어간다.
 */
const A_VERSIONS = {
  // 몰랐던 사실로 끌고, 신분 소재의 거부감도 같이 눌러준다
  천민없는이유: `조선시대 신분 알려주는 사이트 해봤는데
천민 등급이 없길래 왜지 했더니

노비는 성이랑 본관이 아예 없었대
본관 있다는거 자체가 노비는 아니었다는 뜻이라고 ㅋㅋ

암튼 나는 향반 나옴`,

  // 낮게 나온 걸 웃음으로 푼다. 댓글 달기 제일 쉬움
  자조: `조선시대 신분 알려주는 사이트 해봤는데
나 양인 나옴 ㅋㅋㅋㅋㅋ

근데 조선 인구 대부분이 양인이었다고 위로해주네

종친 사대부 향반 중인 양인
다들 뭐 나옴?`,

  // 엄마 반응으로 이야기를 만든다
  가족반응: `엄마한테 본관 물어봐서 넣어봤는데
조선시대 신분이 나옴 ㅋㅋㅋ

우리집 향반이래니까
엄마가 갑자기 자세 고쳐앉음`,

  // 대놓고 물어본다. 참여 유도가 제일 셈
  질문: `님들 조선시대였으면 무슨 신분이었을거같음?

종친 / 사대부 / 향반 / 중인 / 양인
본관 하나만 넣으면 바로 나옴 ㅋㅋ
상위 몇퍼센트인지까지 알려줌

다들 뭐 나올거같음?`,

  // 기대보다 높게 나온 반전
  반전: `우리집 그냥 평범한줄 알았는데
조선시대 기준 상위 몇퍼센트래 ㅋㅋ

본관만 넣으면
종친 사대부 향반 중인 양인 중에 뭐였는지 나옴
생각보다 정교해서 놀람`,

  // 제일 짧게. 스크롤 중에 눈에 걸리는 용도
  짧게: `조선시대였으면 나 향반이었대 ㅋㅋ

본관만 넣으면 나오고
상위 몇퍼센트인지까지 알려줌

다들 해보셈`,
};

/**
 * 예약된 실행 시각(UTC). 한국시간 -9시간. 하루 18회.
 *
 *  UTC 15 → KST 00   자정
 *  UTC 16 → KST 01   새벽 (잠 안 오는 시간, 스레드가 의외로 활발하다)
 *  UTC 17 → KST 02   새벽
 *  UTC 18 → KST 03   새벽
 *  UTC 20 → KST 05   이른 아침
 *  UTC 22 → KST 07   출근 준비
 *  UTC 00 → KST 09   출근 직후
 *  UTC 01 → KST 10   오전
 *  UTC 02 → KST 11   오전
 *  UTC 03 → KST 12   점심
 *  UTC 04 → KST 13   점심 후
 *  UTC 06 → KST 15   오후
 *  UTC 08 → KST 17   퇴근 전
 *  UTC 10 → KST 19   저녁
 *  UTC 11 → KST 20   저녁
 *  UTC 12 → KST 21   황금시간
 *  UTC 13 → KST 22   황금시간
 *  UTC 14 → KST 23   자기 전
 *
 * 한국시간 0시부터 순서대로 적어서 하루 흐름과 맞췄다.
 * 워크플로의 cron과 같은 값을 유지해야 A/B 교대가 정확히 맞는다.
 */
export const SLOTS = [15, 16, 17, 18, 20, 22, 0, 1, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14];

/** 오늘 몇 번째 슬롯인지. 예약 시각이 아니면(수동 실행) 날짜로 대신한다. */
function slotIndex() {
  const now = new Date();
  const i = SLOTS.indexOf(now.getUTCHours());
  return i >= 0 ? i : now.getUTCDate();
}

export function pickVariant() {
  const forced = (process.env.VARIANT ?? "").toUpperCase();
  if (forced === "A" || forced === "B") return forced;
  return slotIndex() % 2 === 0 ? "A" : "B";
}

/** A 문구 고르기. rotate면 날짜+슬롯으로 돌려서 같은 날 같은 문장이 안 겹치게 한다. */
function pickAText() {
  const forced = process.env.A_VERSION;
  if (forced && A_VERSIONS[forced]) return A_VERSIONS[forced];
  if (A_PICK !== "rotate") return A_VERSIONS[A_PICK] ?? A_VERSIONS["질문"];

  const names = Object.keys(A_VERSIONS);
  const day = Math.floor(Date.now() / 86400000);
  // 슬롯 순서를 2로 나눈 값 = 그날 A가 몇 번째로 나가는지
  const nth = Math.floor(slotIndex() / 2);
  return A_VERSIONS[names[(day + nth) % names.length]];
}

const aText = pickAText();

/**
 * B 소재 후보들 — 가문 정보를 알려준다는 게 미끼다.
 * A와 마찬가지로 돌아가며 쓴다.
 */
const B_VERSIONS = {
  기본: `여기 사이트 들어가면 우리 가문에 몇명있는지랑 어디서 시작된 가문인지도 알려줌
ㅋㅋㅋㅋ 심지어 여러가문중 상위 몇퍼센트 정도인지도 알려준다는데 ㅋㅋㅋ`,

  // 본관이 지금 어디인지 — 의외로 아무도 모른다
  본관위치: `본관이 지금 어디 붙어있는 동네인지 몰랐는데
검색하니까 딱 나옴 ㅋㅋ

해평이 구미였음
다들 본관 어디인지는 앎?`,

  // 시조 이름을 처음 알게 되는 순간
  시조: `우리 가문 시조 이름 오늘 처음 알았음 ㅋㅋ

본관만 치면 시조가 누구고
전국에 몇명이나 있는지 다 나옴

부모님한테 물어봐도 모르시던데`,

  // 같은 성씨인데 남남이라는 사실
  동명이본: `같은 김씨여도 본관 다르면 완전 남남인거 알고있었음?

김해 김씨랑 경주 김씨는 아예 다른 집안임
본관 치면 우리 갈래가 어디서 갈라졌는지 나옴`,

  // 숫자 궁금증
  인구: `우리 성씨 전국에 몇명인지 궁금해서 찾아봤는데
본관별로도 나눠서 나옴 ㅋㅋ

생각보다 적어서 놀람`,
};

/** B 문구 고르기. A와 같은 방식으로 돌린다. */
function pickBText() {
  const forced = process.env.B_VERSION;
  if (forced && B_VERSIONS[forced]) return B_VERSIONS[forced];

  const names = Object.keys(B_VERSIONS);
  const day = Math.floor(Date.now() / 86400000);
  const nth = Math.floor(slotIndex() / 2);
  return B_VERSIONS[names[(day + nth) % names.length]];
}

const bText = pickBText();


/**
 * image는 반드시 순수 ASCII 주소여야 한다.
 * 한글이 퍼센트 인코딩된 주소는 외부 서비스가 가져오지 못해 이미지 첨부가 조용히 실패한다.
 *   A → 신분 등급표 (종친·사대부·향반·중인·양인 한 장)
 *   B → 실제 사용 화면 캡처 (김해 김씨 검색 결과)
 *
 * 스레드는 해시태그가 한 개만 먹혀서 text에만 붙이고, X는 textX를 쓴다.
 */
export const VARIANTS = {
  A: {
    label: "신분 자극",
    text: `${aText}

${SITE}/joseon
#조선시대`,
    textX: `${aText}

${SITE}/joseon`,
    image: `${SITE}/share-tiers.png`,
  },
  B: {
    label: "정보 욕구",
    text: `${bText}

${SITE}
#본관`,
    textX: `${bText}

${SITE}`,
    image: `${SITE}/share-clan.png`,
  },
};

