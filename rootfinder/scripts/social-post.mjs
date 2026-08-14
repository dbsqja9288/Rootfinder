/**
 * 스레드(Threads) 자동 게시 스크립트.
 *
 * GitHub Actions에서 하루 2~3회 실행된다. 실행할 때마다 다른 문장을 만들어 올리므로
 * 같은 글이 반복되지 않는다. 토큰이 없으면 초안만 출력하고 조용히 끝난다.
 *
 * 필요한 환경변수 (없으면 dry-run):
 *   THREADS_USER_ID      스레드 사용자 ID
 *   THREADS_ACCESS_TOKEN 장기 액세스 토큰
 *   SITE_URL             사이트 주소
 */

const SITE = process.env.SITE_URL ?? "https://rootfinder-pi.vercel.app";
const USER_ID = process.env.THREADS_USER_ID;
const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = "https://graph.threads.net/v1.0";

const CLANS = [
  ["해평 윤씨", "경상북도 구미시 해평면", "군기시 별제", "ISTP"],
  ["파평 윤씨", "경기도 파주시 파평면", "좌의정", "ENTJ"],
  ["김해 김씨", "경상남도 김해시", "삼도수군통제사", "ESTP"],
  ["경주 김씨", "경상북도 경주시", "사관", "ISTJ"],
  ["전주 이씨", "전북특별자치도 전주시", "대군", "ENTJ"],
  ["밀양 박씨", "경상남도 밀양시", "도화서 별제", "ISFP"],
  ["동래 정씨", "부산광역시 동래구", "관찰사", "ESTJ"],
  ["청송 심씨", "경상북도 청송군", "내의원 어의", "ISFJ"],
  ["청주 한씨", "충청북도 청주시", "예조판서", "ESFJ"],
  ["안동 권씨", "경상북도 안동시", "성균관 대사성", "INFJ"],
  ["광산 김씨", "광주광역시 광산구", "집현전 학사", "INTP"],
  ["순흥 안씨", "경상북도 영주시 순흥면", "서원 원장", "ENFJ"],
  ["창녕 조씨", "경상남도 창녕군", "사헌부 대사헌", "ENTP"],
  ["여흥 민씨", "경기도 여주시", "승정원 승지", "ENFP"],
  ["연주 현씨", "평안북도 영변군 일대", "역관", "ENFP"],
  ["무송 윤씨", "전북특별자치도 고창군", "남사당 광대", "ESFP"],
  ["도강 김씨", "전라남도 강진군 성전면", "대장장이", "ISTP"],
  ["교동 인씨", "인천광역시 강화군 교동면", "전기수", "ENFP"],
];

const PATRIOTS = [
  ["순흥 안씨", "안중근"],
  ["파평 윤씨", "윤봉길"],
  ["안동 김씨", "김구"],
  ["고령 신씨", "신채호"],
  ["청주 한씨", "한용운"],
  ["고흥 류씨", "유관순"],
  ["남양 홍씨", "홍범도"],
  ["충주 지씨", "지청천"],
  ["경주 이씨", "이회영"],
  ["영양 남씨", "남자현"],
];

/** MBTI 자극 (2번 포맷) */
const MBTI_TEMPLATES = [
  (c) => `조선시대 내 직업 맞춰주는 거 해봤는데 ㅋㅋㅋㅋ\n나 ${c[3]}에 ${c[0]}인데 「${c[2]}」 나옴\n\n본관이랑 MBTI 넣는 거라 은근 그럴듯함`,
  (c) => `이거 뭔데 나 「${c[2]}」래 ㅋㅋㅋㅋㅋ\n${c[0]} ${c[3]}\n\n조선시대였으면 뭐 했을지 알려주는 건데 생각보다 정성 들어가 있음`,
  (c) => `MBTI로 조선시대 직업 뽑는 거 해봄\n${c[3]} + ${c[0]} = 「${c[2]}」\n\n같은 MBTI라도 본관 따라 달라지는 게 포인트임 ㅋㅋ`,
  (c) => `${c[3]} 있으면 이거 해봐라\n나는 「${c[2]}」 나왔는데 설명 읽다가 좀 웃었음 ㅋㅋㅋ`,
  (c) => `친구랑 같이 했는데 나만 「${c[2]}」 나와서 억울함 ㅋㅋㅋㅋ\n${c[0]} ${c[3]}인데 이게 맞나`,
];

/** 정보 욕구 (3번 포맷) */
const INFO_TEMPLATES = [
  (c) => `이거 우리 가문 어디서 시작됐는지 알려주는데\n${c[0]} 본관이 ${c[1]}이었음 ㅋㅋ 처음 앎\n\n605개 본관 중에 상위 몇 %인지도 나옴`,
  (c) => `본관이 지금 어디인지 알려주는 사이트\n${c[0]} → ${c[1]}\n\n평생 본관 이름만 알았지 어딘지는 몰랐는데`,
  (c) => `${c[0]} 검색하니까 시조부터 인구까지 다 나옴\n같은 본관 쓰는 다른 성씨까지 알려주는 게 신기함 ㅋㅋ`,
  (c) => `우리 집 본관 치니까 몇 명 있는지, 어디서 시작됐는지, 상위 몇 %인지까지 나옴 ㅋㅋㅋ`,
  (c) => `본관 검색되는 거 만들어봤는데 다들 자기 본관 어딘지 모르더라\n${c[0]}는 ${c[1]}임`,
];

const PATRIOT_TEMPLATES = [
  (p) => `우리 가문에서 독립운동가 나왔나 궁금해서 검색해봄\n${p[0]} → ${p[1]}\n\n몰랐던 사실이라 좀 뭉클했음`,
  (p) => `${p[1]} 본관이 ${p[0]}인 거 알고 있었음?\n한 번쯤 자기 본관 찾아보는 것도 괜찮은 듯`,
  (p) => `본관 검색하면 그 가문에서 나온 독립운동가를 알려주는데\n${p[0]}는 ${p[1]}였음`,
];

/**
 * 실행 시각을 씨앗으로 삼아 매번 다른 조합을 뽑는다.
 * 같은 시간에 두 번 돌려도 같은 글이 나오지 않도록 분(minute)까지 섞는다.
 */
function seeded() {
  const now = new Date();
  const seed = now.getUTCFullYear() * 1e6 + (now.getUTCMonth() + 1) * 1e4 + now.getUTCDate() * 100 + now.getUTCHours();
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function buildPost() {
  const rnd = seeded();
  const pick = (arr) => arr[Math.floor(rnd() * arr.length) % arr.length];

  const roll = rnd();
  let body;
  let path = "/joseon";

  if (roll < 0.45) {
    body = pick(MBTI_TEMPLATES)(pick(CLANS));
  } else if (roll < 0.85) {
    body = pick(INFO_TEMPLATES)(pick(CLANS));
    path = "";
  } else {
    body = pick(PATRIOT_TEMPLATES)(pick(PATRIOTS));
    path = "";
  }

  return `${body}\n\n${SITE}${path}`;
}

async function postToThreads(text) {
  const createUrl = new URL(`${API}/${USER_ID}/threads`);
  createUrl.searchParams.set("media_type", "TEXT");
  createUrl.searchParams.set("text", text);
  createUrl.searchParams.set("access_token", TOKEN);

  const created = await fetch(createUrl, { method: "POST" });
  if (!created.ok) throw new Error(`create failed ${created.status}: ${await created.text()}`);
  const { id } = await created.json();

  // 컨테이너가 준비될 시간을 잠깐 준다
  await new Promise((r) => setTimeout(r, 3000));

  const pubUrl = new URL(`${API}/${USER_ID}/threads_publish`);
  pubUrl.searchParams.set("creation_id", id);
  pubUrl.searchParams.set("access_token", TOKEN);

  const published = await fetch(pubUrl, { method: "POST" });
  if (!published.ok) throw new Error(`publish failed ${published.status}: ${await published.text()}`);
  return published.json();
}

const text = buildPost();
console.log("─".repeat(50));
console.log(text);
console.log("─".repeat(50));

if (!USER_ID || !TOKEN) {
  console.log("\n토큰이 없어 초안만 출력했습니다 (dry-run).");
  console.log("자동 게시하려면 THREADS_USER_ID / THREADS_ACCESS_TOKEN 을 설정하세요.");
  process.exit(0);
}

try {
  const res = await postToThreads(text);
  console.log("\n게시 완료:", res.id);
} catch (e) {
  console.error("\n게시 실패:", e.message);
  process.exit(1);
}
