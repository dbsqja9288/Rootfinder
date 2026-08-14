/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * 실행할 때마다 다른 문안을 만들고, 본관 카드 이미지를 함께 올린다.
 * 토큰이 없으면 초안만 출력하고 조용히 끝난다(dry-run).
 *
 * 환경변수:
 *   THREADS_USER_ID      스레드 사용자 ID
 *   THREADS_ACCESS_TOKEN 장기 액세스 토큰
 *   SITE_URL             사이트 주소
 */

const SITE = (process.env.SITE_URL ?? "https://rootfinder-pi.vercel.app").replace(/\/$/, "");
const USER_ID = process.env.THREADS_USER_ID;
const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = "https://graph.threads.net/v1.0";

/** [본관표시, 현재지역, 조선직업, MBTI, surnameId, 본관슬러그] */
const CLANS = [
  ["해평 윤씨", "경북 구미", "군기시 별제", "ISTP", "yoon", "해평"],
  ["파평 윤씨", "경기 파주", "좌의정", "ENTJ", "yoon", "파평"],
  ["김해 김씨", "경남 김해", "삼도수군통제사", "ESTP", "kim", "김해"],
  ["경주 김씨", "경북 경주", "사관", "ISTJ", "kim", "경주"],
  ["전주 이씨", "전북 전주", "대군", "ENTJ", "lee", "전주"],
  ["밀양 박씨", "경남 밀양", "도화서 별제", "ISFP", "park", "밀양"],
  ["동래 정씨", "부산 동래", "관찰사", "ESTJ", "jung", "동래"],
  ["청송 심씨", "경북 청송", "내의원 어의", "ISFJ", "sim", "청송"],
  ["청주 한씨", "충북 청주", "예조판서", "ESFJ", "han", "청주"],
  ["안동 권씨", "경북 안동", "성균관 대사성", "INFJ", "kwon", "안동"],
  ["광산 김씨", "광주 광산", "집현전 학사", "INTP", "kim", "광산"],
  ["순흥 안씨", "경북 영주", "서원 원장", "ENFJ", "ahn", "순흥"],
  ["창녕 조씨", "경남 창녕", "사헌부 대사헌", "ENTP", "jo-cao", "창녕"],
  ["여흥 민씨", "경기 여주", "승정원 승지", "ENFP", "min", "여흥"],
  ["연주 현씨", "평북 영변", "역관", "ENFP", "hyun", "연주"],
  ["무송 윤씨", "전북 고창", "남사당 광대", "ESFP", "yoon", "무송"],
  ["도강 김씨", "전남 강진", "대장장이", "ISTP", "kim", "도강"],
  ["교동 인씨", "인천 강화", "전기수", "ENFP", "in", "교동"],
  ["나주 나씨", "전남 나주", "포도부장", "ESTP", "na", "나주"],
  ["영양 남씨", "경북 영양", "훈장", "ENFJ", "nam", "영양"],
];

/** [본관표시, 인물, surnameId, 본관슬러그] */
const PATRIOTS = [
  ["순흥 안씨", "안중근", "ahn", "순흥"],
  ["파평 윤씨", "윤봉길", "yoon", "파평"],
  ["안동 김씨", "김구", "kim", "안동"],
  ["고령 신씨", "신채호", "shin", "고령"],
  ["청주 한씨", "한용운", "han", "청주"],
  ["남양 홍씨", "홍범도", "hong", "남양"],
  ["충주 지씨", "지청천", "ji", "충주"],
  ["경주 이씨", "이회영", "lee", "경주"],
  ["영양 남씨", "남자현", "nam", "영양"],
  ["함양 여씨", "여운형", "yeo", "함양"],
];

/**
 * 문안은 짧고 감정이 앞에 오게 쓴다.
 * 서비스 설명을 늘어놓으면 광고로 읽히고, 스레드에서는 바로 스크롤된다.
 */
const MBTI_TEMPLATES = [
  (c) => `조선시대였으면 나 「${c[2]}」였대\n${c[3]}라서 그런가 ㅋㅋㅋ\n\n다들 뭐 나왔는지 궁금하네`,
  (c) => `「${c[2]}」 나왔는데\n설명 읽다가 좀 찔림... 왜 이렇게 그럴듯하지`,
  (c) => `본관이랑 MBTI 넣으니까 「${c[2]}」 나옴\n${c[3]} 중에 나만 이런 거 아니겠지`,
  (c) => `친구는 영의정 나왔는데 나는 「${c[2]}」임\n좀 억울함 ㅋㅋㅋㅋㅋ`,
  (c) => `「${c[2]}」...\n생각보다 잘 어울려서 기분이 이상하다`,
  (c) => `${c[3]}인데 「${c[2]}」 나옴\n조상님 죄송합니다`,
];

const INFO_TEMPLATES = [
  (c) => `본관 어디냐고 물어보시는데 몰라서 검색함\n${c[0]}, ${c[1]}이었네\n\n서른 넘어서 처음 앎`,
  (c) => `${c[0]}인데 본관이 지금 어디인지 오늘 처음 알았다\n${c[1]}이래`,
  (c) => `${c[1]}... 한 번도 안 가봤는데 우리 뿌리라니까 기분이 묘함`,
  (c) => `우리 본관이 605개 중에 몇 번째인지 알려주는데\n이걸 왜 궁금해했지 나 ㅋㅋ`,
  (c) => `${c[0]} 쳐보니까 시조부터 인구까지 다 나옴\n이런 거 있는 줄 몰랐네`,
];

const PATRIOT_TEMPLATES = [
  (p) => `우리 가문에서 독립운동가 나왔나 쳐봤는데\n${p[0]}는 ${p[1]}이었음\n\n좀 소름 돋았다`,
  (p) => `${p[1]} 본관이 ${p[0]}인 거 알고 있었어?\n난 오늘 알았음`,
  (p) => `${p[0]}에서 ${p[1]}이 나왔다는 거\n괜히 뿌듯하네`,
];

/** 스레드는 게시물당 태그를 하나만 허용한다 */
const TAGS = { mbti: "#MBTI", info: "#본관", patriot: "#독립운동가" };

/** 실행 시각을 씨앗으로 매번 다른 조합을 뽑는다 */
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

function imageUrl(surnameId, slug) {
  return `${SITE}/surnames/${surnameId}/${encodeURIComponent(slug)}/opengraph-image`;
}

function buildPost() {
  const rnd = seeded();
  const pick = (arr) => arr[Math.floor(rnd() * arr.length) % arr.length];
  const roll = rnd();

  let body;
  let kind;
  let img;
  let path = "";

  if (roll < 0.45) {
    const c = pick(CLANS);
    body = pick(MBTI_TEMPLATES)(c);
    kind = "mbti";
    img = imageUrl(c[4], c[5]);
    path = "/joseon";
  } else if (roll < 0.8) {
    const c = pick(CLANS);
    body = pick(INFO_TEMPLATES)(c);
    kind = "info";
    img = imageUrl(c[4], c[5]);
  } else {
    const p = pick(PATRIOTS);
    body = pick(PATRIOT_TEMPLATES)(p);
    kind = "patriot";
    img = imageUrl(p[2], p[3]);
  }

  const text = `${body}\n\n${SITE}${path}\n${TAGS[kind]}`;
  return { text, img, kind };
}

/** 이미지 컨테이너는 처리에 시간이 걸리므로 준비될 때까지 확인한다 */
async function waitReady(id, tries = 10) {
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
  return false;
}

async function post({ text, img }) {
  // 1) 컨테이너 생성 — 이미지가 있으면 IMAGE, 없으면 TEXT
  const createUrl = new URL(`${API}/${USER_ID}/threads`);
  createUrl.searchParams.set("text", text);
  createUrl.searchParams.set("access_token", TOKEN);
  if (img) {
    createUrl.searchParams.set("media_type", "IMAGE");
    createUrl.searchParams.set("image_url", img);
  } else {
    createUrl.searchParams.set("media_type", "TEXT");
  }

  let created = await fetch(createUrl, { method: "POST" });

  // 이미지가 거부되면 텍스트만으로 재시도한다 (게시를 아예 거르는 것보다 낫다)
  if (!created.ok && img) {
    console.log(`이미지 첨부 실패, 텍스트로 재시도: ${created.status}`);
    const fallback = new URL(`${API}/${USER_ID}/threads`);
    fallback.searchParams.set("media_type", "TEXT");
    fallback.searchParams.set("text", text);
    fallback.searchParams.set("access_token", TOKEN);
    created = await fetch(fallback, { method: "POST" });
    img = null;
  }
  if (!created.ok) throw new Error(`컨테이너 생성 실패 ${created.status}: ${await created.text()}`);

  const { id } = await created.json();

  // 2) 준비 대기
  if (img) await waitReady(id);
  else await new Promise((r) => setTimeout(r, 2000));

  // 3) 게시
  const pubUrl = new URL(`${API}/${USER_ID}/threads_publish`);
  pubUrl.searchParams.set("creation_id", id);
  pubUrl.searchParams.set("access_token", TOKEN);
  const published = await fetch(pubUrl, { method: "POST" });
  if (!published.ok) throw new Error(`게시 실패 ${published.status}: ${await published.text()}`);
  return published.json();
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
  console.log("\n게시 완료:", res.id);
} catch (e) {
  console.error("\n실패:", e.message);
  process.exit(1);
}
