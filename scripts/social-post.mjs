/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * 소재는 A/B 두 개로 고정한다. 매 실행마다 번갈아 올려서 어느 쪽이 잘 먹히는지 비교한다.
 * 문안을 바꾸고 싶으면 아래 VARIANTS의 text만 고치면 된다.
 *
 * 환경변수:
 *   THREADS_USER_ID / THREADS_ACCESS_TOKEN / SITE_URL
 *   VARIANT=A 또는 B  (수동 지정. 없으면 시간대에 따라 자동 교대)
 */

const SITE = (process.env.SITE_URL ?? "https://rootfinder-pi.vercel.app").replace(/\/$/, "");
const USER_ID = process.env.THREADS_USER_ID;
const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = "https://graph.threads.net/v1.0";

/**
 * A = MBTI 자극 / B = 정보 욕구
 *
 * image는 반드시 순수 ASCII 주소여야 한다.
 * 한글이 퍼센트 인코딩된 주소는 Threads가 가져오지 못해 이미지 첨부가 조용히 실패한다.
 *   A → 조선시대 결과 카드 (김해 김씨 · ESTP → 삼도수군통제사)
 *   B → 실제 사용 화면 캡처 (김해 김씨 검색 결과)
 */
const VARIANTS = {
  A: {
    label: "MBTI 자극",
    text: `광복절기념으로 조선시대에 내 직업을 맞춰주는 서비스가 있어서 해봤는데 재밌음 ㅋㅋ
나는 삼도수군통제사였대
MBTI랑 가문 넣는거라 꽤나 그럴듯함
재미로 해보기 추천 ㅋㅋㅋ

${SITE}/joseon
#MBTI`,
    image: `${SITE}/api/joseon-card?c=0&m=8`,
  },
  B: {
    label: "정보 욕구",
    text: `여기 사이트 들어가면 우리 가문에 몇명있는지랑 어디서 시작된 가문인지도 알려줌
ㅋㅋㅋㅋ 심지어 여러가문중 상위 몇퍼센트 정도인지도 알려준다는데 ㅋㅋㅋ

${SITE}
#본관`,
    image: `${SITE}/share-clan.png`,
  },
};

/**
 * 예약된 실행 시각(UTC). 이 순서대로 A, B, A, B... 로 번갈아 나간다.
 * 워크플로의 cron과 같은 값을 유지해야 교대가 정확히 맞는다.
 */
const SLOTS = [23, 1, 3, 6, 10, 13];

function pickVariant() {
  const forced = (process.env.VARIANT ?? "").toUpperCase();
  if (forced === "A" || forced === "B") return forced;

  const h = new Date().getUTCHours();
  const i = SLOTS.indexOf(h);
  // 예약 시각이 아니면(수동 실행 등) 날짜 기준으로 교대
  const seq = i >= 0 ? i : new Date().getUTCDate();
  return seq % 2 === 0 ? "A" : "B";
}

/** 이미지 컨테이너는 처리에 시간이 걸리므로 준비될 때까지 확인한다 */
async function waitReady(id, tries = 12) {
  for (let i = 0; i < tries; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const url = new URL(`${API}/${id}`);
    url.searchParams.set("fields", "status,error_message");
    url.searchParams.set("access_token", TOKEN);
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === "FINISHED") return true;
    if (data.status === "ERROR" || data.status === "EXPIRED") {
      throw new Error(`컨테이너 처리 실패: ${data.error_message ?? data.status}`);
    }
  }
  throw new Error("컨테이너가 준비되지 않음 (타임아웃)");
}

async function post({ text, image }) {
  let img = image;

  // 이미지가 실제로 접근 가능한지 먼저 확인한다
  if (img) {
    try {
      const probe = await fetch(img);
      const type = probe.headers.get("content-type") ?? "";
      if (!probe.ok || !type.startsWith("image/")) {
        console.log(`이미지 접근 불가 (${probe.status} ${type}) — 텍스트로 전환`);
        img = null;
      }
    } catch (e) {
      console.log(`이미지 확인 실패: ${e.message} — 텍스트로 전환`);
      img = null;
    }
  }

  const create = async (withImage) => {
    const u = new URL(`${API}/${USER_ID}/threads`);
    u.searchParams.set("text", text);
    u.searchParams.set("access_token", TOKEN);
    if (withImage) {
      u.searchParams.set("media_type", "IMAGE");
      u.searchParams.set("image_url", withImage);
    } else {
      u.searchParams.set("media_type", "TEXT");
    }
    return fetch(u, { method: "POST" });
  };

  let res = await create(img);
  if (!res.ok && img) {
    console.log(`이미지 첨부 거부 (${res.status}) — 텍스트로 재시도`);
    img = null;
    res = await create(null);
  }
  if (!res.ok) throw new Error(`컨테이너 생성 실패 ${res.status}: ${await res.text()}`);

  const { id } = await res.json();
  if (img) await waitReady(id);
  else await new Promise((r) => setTimeout(r, 2000));

  const pub = new URL(`${API}/${USER_ID}/threads_publish`);
  pub.searchParams.set("creation_id", id);
  pub.searchParams.set("access_token", TOKEN);
  const published = await fetch(pub, { method: "POST" });
  if (!published.ok) throw new Error(`게시 실패 ${published.status}: ${await published.text()}`);

  return { ...(await published.json()), withImage: Boolean(img) };
}

const key = pickVariant();
const v = VARIANTS[key];

console.log(`변형 ${key} (${v.label})`);
console.log("─".repeat(50));
console.log(v.text);
console.log("─".repeat(50));
console.log(`이미지: ${v.image}`);

if (!USER_ID || !TOKEN) {
  console.log("\n토큰이 없어 초안만 출력했습니다 (dry-run).");
  process.exit(0);
}

try {
  const res = await post(v);
  console.log(`\n게시 완료 [변형 ${key}]: ${res.id} (이미지 ${res.withImage ? "첨부됨" : "없음"})`);
} catch (e) {
  console.error("\n실패:", e.message);
  process.exit(1);
}
