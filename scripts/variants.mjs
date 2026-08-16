/**
 * 스레드와 X가 함께 쓰는 게시 소재.
 *
 * 소재는 A/B 두 개로 고정한다. 실행할 때마다 번갈아 올려서 어느 쪽이 잘 먹히는지 비교한다.
 * 문안을 바꾸고 싶으면 아래 text만 고치면 된다. 다른 파일은 건드릴 필요 없다.
 */

export const SITE = (process.env.SITE_URL ?? "https://rootfinder-pi.vercel.app").replace(/\/$/, "");

/**
 * image는 반드시 순수 ASCII 주소여야 한다.
 * 한글이 퍼센트 인코딩된 주소는 외부 서비스가 가져오지 못해 이미지 첨부가 조용히 실패한다.
 *   A → 조선시대 결과 카드 (김해 김씨 · ESTP → 삼도수군통제사)
 *   B → 실제 사용 화면 캡처 (김해 김씨 검색 결과)
 *
 * tag는 스레드용(해시태그 한 개만 허용)이고, X는 tagsX를 쓴다.
 */
export const VARIANTS = {
  A: {
    label: "MBTI 자극",
    text: `광복절기념으로 조선시대에 내 직업을 맞춰주는 서비스가 있어서 해봤는데 재밌음 ㅋㅋ
나는 삼도수군통제사였대
MBTI랑 가문 넣는거라 꽤나 그럴듯함
재미로 해보기 추천 ㅋㅋㅋ

${SITE}/joseon
#MBTI`,
    textX: `광복절기념으로 조선시대에 내 직업을 맞춰주는 서비스가 있어서 해봤는데 재밌음 ㅋㅋ
나는 삼도수군통제사였대
MBTI랑 가문 넣는거라 꽤나 그럴듯함
재미로 해보기 추천 ㅋㅋㅋ

${SITE}/joseon`,
    image: `${SITE}/api/joseon-card?c=0&m=8`,
  },
  B: {
    label: "정보 욕구",
    text: `여기 사이트 들어가면 우리 가문에 몇명있는지랑 어디서 시작된 가문인지도 알려줌
ㅋㅋㅋㅋ 심지어 여러가문중 상위 몇퍼센트 정도인지도 알려준다는데 ㅋㅋㅋ

${SITE}
#본관`,
    textX: `여기 사이트 들어가면 우리 가문에 몇명있는지랑 어디서 시작된 가문인지도 알려줌
ㅋㅋㅋㅋ 심지어 여러가문중 상위 몇퍼센트 정도인지도 알려준다는데 ㅋㅋㅋ

${SITE}`,
    image: `${SITE}/share-clan.png`,
  },
};

/**
 * 예약된 실행 시각(UTC). 이 순서대로 A, B, A, B... 로 번갈아 나간다.
 * 워크플로의 cron과 같은 값을 유지해야 교대가 정확히 맞는다.
 */
export const SLOTS = [23, 1, 3, 6, 10, 13];

export function pickVariant() {
  const forced = (process.env.VARIANT ?? "").toUpperCase();
  if (forced === "A" || forced === "B") return forced;

  const h = new Date().getUTCHours();
  const i = SLOTS.indexOf(h);
  // 예약 시각이 아니면(수동 실행 등) 날짜 기준으로 교대
  const seq = i >= 0 ? i : new Date().getUTCDate();
  return seq % 2 === 0 ? "A" : "B";
}
