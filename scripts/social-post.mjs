/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * 실행할 때마다 다른 문안 + 다른 결과 카드 이미지를 올린다.
 * 이미지 주소는 반드시 순수 ASCII여야 한다 — 한글이 퍼센트 인코딩된 URL은
 * 외부 서비스가 가져오지 못해 이미지 첨부가 조용히 실패한다.
 *
 * 환경변수:
 *   THREADS_USER_ID / THREADS_ACCESS_TOKEN / SITE_URL
 */

const SITE = (process.env.SITE_URL ?? "https://rootfinder-pi.vercel.app").replace(/\/$/, "");
const USER_ID = process.env.THREADS_USER_ID;
const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = "https://graph.threads.net/v1.0";

/**
 * [본관표시, 현재지역, 조선직업, MBTI, 카드 clan 인덱스, 카드 mbti 인덱스]
 * 인덱스는 /api/joseon-card?c=..&m=.. 에 그대로 넘어간다.
 * MBTI 순서: ISTJ ISFJ INFJ INTJ ISTP ISFP INFP INTP ESTP ESFP ENFP ENTP ESTJ ESFJ ENFJ ENTJ
 */
const CLANS = [
  ["김해 김씨", "경남 김해", "삼도수군통제사", "ESTP", 0, 8],
  ["경주 김씨", "경북 경주", "사관", "ISTJ", 1, 0],
  ["광산 김씨", "광주 광산", "집현전 학사", "INTP", 2, 7],
  ["안동 김씨", "경북 안동", "좌의정", "ENTJ", 3, 15],
  ["의성 김씨", "경북 의성", "서원 원장", "ENFJ", 4, 14],
  ["전주 이씨", "전북 전주", "대군", "ENTJ", 56, 15],
  ["경주 이씨", "경북 경주", "은일 문인", "INFP", 57, 6],
  ["밀양 박씨", "경남 밀양", "도화서 별제", "ISFP", 102, 5],
  ["반남 박씨", "전남 나주", "사헌부 대사헌", "ENTP", 103, 11],
  ["동래 정씨", "부산 동래", "관찰사", "ESTJ", 165, 12],
  ["청송 심씨", "경북 청송", "내의원 어의", "ISFJ", 501, 1],
  ["청주 한씨", "충북 청주", "예조판서", "ESFJ", 301, 13],
  ["파평 윤씨", "경기 파주", "승정원 승지", "ENFP", 222, 10],
  ["해평 윤씨", "경북 구미", "군기시 별제", "ISTP", 225, 4],
  ["순흥 안씨", "경북 영주", "성균관 대사성", "INFJ", 366, 2],
  ["창녕 조씨", "경남 창녕", "도체찰사", "INTJ", 466, 3],
  ["남양 홍씨", "경기 화성", "장악원 제조", "ESFP", 409, 9],
  ["여흥 민씨", "경기 여주", "훈장", "ENFJ", 551, 14],
  ["연주 현씨", "평북 영변", "역관", "ENFP", 574, 10],
  ["교동 인씨", "인천 강화", "전기수", "ENFP", 594, 10],
];

/** [본관표시, 인물, 카드 clan 인덱스] */
const PATRIOTS = [
  ["순흥 안씨", "안중근", 366],
  ["파평 윤씨", "윤봉길", 222],
  ["안동 김씨", "김구", 3],
  ["고령 신씨", "신채호", 339],
  ["청주 한씨", "한용운", 301],
  ["남양 홍씨", "홍범도", 409],
  ["충주 지씨", "지청천", 565],
  ["경주 이씨", "이회영", 57],
  ["여흥 민씨", "민영환", 551],
  ["함양 여씨", "여운형", 580],
];

/** 감정이 먼저 오고 설명은 없다. 서비스 소개처럼 읽히면 바로 스크롤된다. */
const MBTI_TEMPLATES = [
  (c) => `조선시대였으면 나 「${c[2]}」였대\n${c[3]}라서 그런가 ㅋㅋㅋ\n\n다들 뭐 나왔는지 궁금하네`,
  (c) => `「${c[2]}」 나왔는데\n설명 읽다가 좀 찔림... 왜 이렇게 그럴듯하지`,
  (c) => `${c[3]}인데 「${c[2]}」 나옴\n조상님 죄송합니다`,
  (c) => `친구는 영의정 나왔는데 나는 「${c[2]}」임\n좀 억울함 ㅋㅋㅋㅋㅋ`,
  (c) => `「${c[2]}」...\n생각보다 잘 어울려서 기분이 이상하다`,
  (c) => `이거 왜 이렇게 잘 맞음?\n${c[3]}에 ${c[0]}인데 「${c[2]}」 나왔음`,
  (c) => `엄마한테 본관 물어보고 해봤는데 「${c[2]}」 나옴\n엄마가 더 좋아하심 ㅋㅋ`,
  (c) => `점심 먹고 심심해서 해봤다가\n「${c[2]}」 나와서 혼자 웃음`,
  (c) => `${c[3]} 특징: 「${c[2]}」 나옴\n아닌가 나만 그런가`,
  (c) => `내 조선시대 직업 「${c[2]}」\n생각보다 괜찮은 인생이었을지도`,
];

const INFO_TEMPLATES = [
  (c) => `본관 어디냐고 물어보시는데 몰라서 검색함\n${c[0]}, ${c[1]}이었네\n\n서른 넘어서 처음 앎`,
  (c) => `${c[0]}인데 본관이 지금 어디인지 오늘 처음 알았다\n${c[1]}이래`,
  (c) => `${c[1]}... 한 번도 안 가봤는데 우리 뿌리라니까 기분이 묘함`,
  (c) => `우리 본관이 605개 중에 몇 번째인지 알려주는데\n이걸 왜 궁금해했지 나 ㅋㅋ`,
  (c) => `${c[0]} 쳐보니까 시조부터 인구까지 다 나옴\n이런 거 있는 줄 몰랐네`,
  (c) => `할아버지가 늘 말씀하시던 본관\n찾아보니까 ${c[1]}이었다`,
  (c) => `본관 같으면 다 친척인 줄 알았는데 아니래\n같은 고을에서 여러 성씨가 일어난 거라고`,
  (c) => `${c[0]} 사람 여기 또 있나\n${c[1]} 출신이래요 우리`,
];

const PATRIOT_TEMPLATES = [
  (p) => `우리 가문에서 독립운동가 나왔나 쳐봤는데\n${p[0]}는 ${p[1]}이었음\n\n좀 소름 돋았다`,
  (p) => `${p[1]} 본관이 ${p[0]}인 거 알고 있었어?\n난 오늘 알았음`,
  (p) => `${p[0]}에서 ${p[1]}이 나왔다는 거\n괜히 뿌듯하네`,
  (p) => `본관 치면 그 가문 독립운동가를 알려주는데\n${p[0]}는 ${p[1]}였다`,
];

/** 스레드는 게시물당 태그를 하나만 허용한다 */
const TAGS = { mbti: "#MBTI", info: "#본관", patriot: "#독립운동가" };

/** 실행 시각(시 단위)을 씨앗으로 매번 다른 조합을 뽑는다 */
function seeded() {
  const now = new Date();
  const seed =
    now.getUTCFullYear() * 1e6 + (now.getUTCMonth() + 1) * 1e4 + now.getUTCDate() * 100 + now.getUTCHours();
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return x / 0x7fffffff;
  };
}

/** 순수 ASCII 주소 — 한글이 들어가면 외부 서비스가 이미지를 못 가져온다 */
function cardUrl(clanIdx, mbtiIdx) {
  return `${SITE}/api/joseon-card?c=${clanIdx}&m=${mbtiIdx}`;
}

function buildPost() {
  const rnd = seeded();
  const pick = (arr) => arr[Math.floor(rnd() * arr.length) % arr.length];
  const roll = rnd();

  let body, kind, img, path = "";

  if (roll < 0.5) {
    const c = pick(CLANS);
    body = pick(MBTI_TEMPLATES)(c);
    kind = "mbti";
    img = cardUrl(c[4], c[5]);
    path = "/joseon";
  } else if (roll < 0.82) {
    const c = pick(CLANS);
    body = pick(INFO_TEMPLATES)(c);
    kind = "info";
    img = cardUrl(c[4], c[5]);
  } else {
    const p = pick(PATRIOTS);
    body = pick(PATRIOT_TEMPLATES)(p);
    kind = "patriot";
    img = cardUrl(p[2], Math.floor(rnd() * 16));
  }

  return { text: `${body}\n\n${SITE}${path}\n${TAGS[kind]}`, img, kind };
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

async function post({ text, img }) {
  // 이미지가 실제로 접근 가능한지 먼저 확인한다
  if (img) {
    try {
      const probe = await fetch(img, { method: "GET" });
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

const draft = buildPost();
console.log("─".repeat(50));
console.log(draft.text);
console.log("─".repeat(50));
console.log(`이미지: ${draft.img}`);

if (!USER_ID || !TOKEN) {
  console.log("\n토큰이 없어 초안만 출력했습니다 (dry-run).");
  process.exit(0);
}

try {
  const res = await post(draft);
  console.log(`\n게시 완료: ${res.id} (이미지 ${res.withImage ? "첨부됨" : "없음"})`);
} catch (e) {
  console.error("\n실패:", e.message);
  process.exit(1);
}
