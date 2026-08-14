/**
 * 본관별 조선시대 기록 — '조선시대였다면?' 콘텐츠의 점수 재료.
 *
 * 정승·왕비 배출 수, 문과 급제자 수는 자료마다 집계 기준이 달라 **근사치**로 정리했다.
 * 이 수치는 학술 인용용이 아니라, 기록이 많이 남은 본관과 적게 남은 본관을 가르기 위한 것이다.
 * 여기 없는 본관은 모두 0으로 계산된다 — 기록이 없다는 뜻이지, 뿌리가 얕다는 뜻이 아니다.
 */
export type ClanRecord = {
  joseonRoyal?: boolean; // 조선 왕실 종친 (전주 이씨)
  royal?: boolean; // 옛 왕성(신라·가야·탐라 등) 계통
  jeongseung?: number; // 정승(영·좌·우의정) 배출 수
  queens?: number; // 왕비·왕대비 배출 수
  munkwa?: number; // 문과 급제자 수
  highlight?: string; // 결과 화면에 쓸 한 줄
};

/** 키 형식: `${surnameId}/${본관}` */
export const CLAN_RECORDS: Record<string, ClanRecord> = {
  // ── 왕성 계통 ──
  "lee/전주": {
    joseonRoyal: true,
    royal: true,
    jeongseung: 22,
    queens: 0,
    munkwa: 870,
    highlight: "조선 500년의 왕성. 태조 이성계가 세운 나라의 주인 가문이었다.",
  },
  "kim/경주": {
    royal: true,
    jeongseung: 6,
    munkwa: 420,
    highlight: "신라 왕성 계통. 김알지의 후손으로 천년 왕국의 중심에 있었다.",
  },
  "park/밀양": {
    royal: true,
    jeongseung: 1,
    munkwa: 260,
    highlight: "신라 시조 박혁거세의 후손. 박씨 인구의 대부분을 차지하는 대종이다.",
  },
  "seok/월성": { royal: true, munkwa: 5, highlight: "신라 4대 왕 석탈해의 후손. 박·석·김 세 왕성 중 하나다." },
  "kim/김해": {
    royal: true,
    jeongseung: 2,
    munkwa: 130,
    highlight: "가락국 김수로왕의 후손. 단일 본관으로는 나라에서 가장 큰 규모다.",
  },
  "ko/제주": { royal: true, munkwa: 40, highlight: "탐라국 왕족의 후예. 고을나의 후손으로 전한다." },
  "yang/제주": { royal: true, munkwa: 25, highlight: "탐라 개국 신화 삼을나 중 양을나의 후손이다." },

  // ── 정승·왕비를 다수 배출한 명문 ──
  "jung/동래": { jeongseung: 17, queens: 0, munkwa: 198, highlight: "조선시대 정승 17명을 배출한 최상위 명문가다." },
  "kim/안동": { jeongseung: 15, queens: 3, munkwa: 310, highlight: "조선 후기 세도정치의 중심. 왕비 셋을 배출했다." },
  "sim/청송": { jeongseung: 13, queens: 4, munkwa: 190, highlight: "왕비 넷을 배출한 외척 명문. 세종의 장인 심온의 가문이다." },
  "han/청주": { jeongseung: 12, queens: 6, munkwa: 280, highlight: "한명회와 인수대비의 가문. 조선 최고의 외척 세력이었다." },
  "min/여흥": { jeongseung: 12, queens: 4, munkwa: 220, highlight: "원경왕후·인현왕후·명성황후를 배출한 왕비의 가문이다." },
  "yoon/파평": { jeongseung: 11, queens: 5, munkwa: 340, highlight: "윤관 장군의 후손. 조선 왕비를 다섯이나 배출했다." },
  "lee/연안": { jeongseung: 8, munkwa: 250, highlight: "조선 중기 이후 문형(文衡)을 여럿 배출한 학자 가문이다." },
  "hong/남양": { jeongseung: 8, queens: 1, munkwa: 230, highlight: "홍씨의 대종. 혜경궁 홍씨의 친정 계통과 이어진다." },
  "seo/대구": { jeongseung: 9, queens: 1, munkwa: 180, highlight: "조선 후기 경화사족의 대표. 정승과 판서를 줄줄이 냈다." },
  "cho/풍양": { jeongseung: 7, queens: 1, munkwa: 130, highlight: "안동 김씨와 세도를 다투던 조선 후기 척족이다." },
  "lee/경주": { jeongseung: 8, munkwa: 480, highlight: "신라 6부촌장 알평의 후손. 이씨의 가장 오랜 뿌리다." },
  "kim/광산": { jeongseung: 5, queens: 1, munkwa: 265, highlight: "문과 급제자를 대거 배출한 호남 최고의 학문 명가다." },
  "park/반남": { jeongseung: 6, queens: 1, munkwa: 215, highlight: "연암 박지원의 가문. 조선 후기 북학파의 산실이었다." },
  "lee/덕수": { jeongseung: 5, munkwa: 110, highlight: "율곡 이이와 충무공 이순신이 함께 나온 가문이다." },
  "lee/한산": { jeongseung: 4, munkwa: 195, highlight: "목은 이색의 후손. 대대로 문장으로 이름을 떨쳤다." },
  "choi/전주": { jeongseung: 3, munkwa: 130 },
  "kwon/안동": { jeongseung: 6, queens: 1, munkwa: 360, highlight: "현존 최고(最古)의 족보 『성화보』를 남긴 가문이다." },
  "song/은진": { jeongseung: 2, munkwa: 90, highlight: "우암 송시열의 가문. 조선 후기 기호학파의 종가였다." },
  "yoon/해평": { jeongseung: 3, munkwa: 85, highlight: "오음 윤두수와 월정 윤근수 형제, 영의정 윤방을 배출했다." },
  "lee/광주": { jeongseung: 5, munkwa: 190, highlight: "'팔극조정'이라 불릴 만큼 한때 조정을 가득 채웠다." },
  "lee/여주": { jeongseung: 2, munkwa: 105, highlight: "성호 이익의 가문. 실학의 큰 줄기가 여기서 나왔다." },
  "cho/한양": { jeongseung: 4, munkwa: 150, highlight: "정암 조광조를 배출한 사림의 상징 가문이다." },
  "ryu/문화": { jeongseung: 6, munkwa: 210, highlight: "족보 체계의 표준을 세운 『가정보』를 남겼다." },
  "ryu/풍산": { jeongseung: 2, munkwa: 70, highlight: "서애 류성룡의 가문. 안동 하회마을의 주인이다." },
  "kang/진주": { jeongseung: 5, munkwa: 230, highlight: "강감찬 장군의 후예를 표방하는 강씨의 대종이다." },
  "shin/평산": { jeongseung: 4, munkwa: 190, highlight: "고려 개국공신 신숭겸의 후손. 무반 명문으로 이름났다." },
  "shin/고령": { jeongseung: 2, munkwa: 90, highlight: "신숙주의 가문. 훈민정음 창제에 참여한 학자를 냈다." },
  "ahn/순흥": { jeongseung: 3, munkwa: 200, highlight: "회헌 안향의 가문. 성리학을 이 땅에 들여왔다." },
  "hwang/장수": { jeongseung: 3, munkwa: 75, highlight: "명재상 황희의 가문이다." },
  "jung/연일": { jeongseung: 3, munkwa: 160, highlight: "포은 정몽주의 가문. 절의의 상징으로 남았다." },
  "jung/진주": { jeongseung: 3, munkwa: 140 },
  "jung/하동": { jeongseung: 4, munkwa: 130 },
  "jung/초계": { jeongseung: 2, munkwa: 90 },
  "heo/양천": { jeongseung: 3, munkwa: 130, highlight: "허준·허난설헌·허균을 배출한 가문이다." },
  "nam/의령": { jeongseung: 4, munkwa: 130, highlight: "약천 남구만과 장군 남이를 배출했다." },
  "jo-cao/창녕": { jeongseung: 3, munkwa: 170, highlight: "남명 조식의 가문. 영남 사림의 한 축이었다." },
  "kim/의성": { jeongseung: 1, munkwa: 180, highlight: "영남 학맥의 명문으로 문과 급제자를 꾸준히 냈다." },
  "kim/청풍": { jeongseung: 3, queens: 1, munkwa: 80 },
  "kim/연안": { jeongseung: 3, munkwa: 90 },
  "lee/성주": { jeongseung: 3, munkwa: 130 },
  "lee/전의": { jeongseung: 2, munkwa: 120 },
  "lee/용인": { jeongseung: 3, munkwa: 90 },
  "cho/양주": { jeongseung: 2, munkwa: 60 },
  "oh/해주": { jeongseung: 2, munkwa: 140 },
  "seo/달성": { jeongseung: 2, munkwa: 120 },
  "baek/수원": { munkwa: 90 },
  "son/밀양": { munkwa: 70 },
  "son/경주": { munkwa: 60, highlight: "회재 이언적의 외가. 경주 양동마을의 주인이다." },
  "seong/창녕": { jeongseung: 2, munkwa: 140, highlight: "사육신 성삼문과 『악학궤범』의 성현을 배출했다." },
  "koo/능성": { jeongseung: 2, queens: 1, munkwa: 70, highlight: "인조의 어머니 인헌왕후를 배출했다." },
  "woo/단양": { munkwa: 60, highlight: "역동 우탁, 육종학자 우장춘이 이 가문이다." },
  "chae/평강": { jeongseung: 1, munkwa: 60, highlight: "번암 채제공을 배출한 남인의 중심 가문이다." },
  "ha/진주": { jeongseung: 3, munkwa: 90, highlight: "하륜과 하연, 두 명재상을 배출했다." },
  "kwak/현풍": { munkwa: 60, highlight: "홍의장군 곽재우의 가문이다." },
  "moon/남평": { jeongseung: 1, munkwa: 100, highlight: "목화를 들여온 문익점의 가문이다." },
  "won/원주": { jeongseung: 1, munkwa: 70 },
  "jang/인동": { munkwa: 90 },
  "lim/나주": { munkwa: 80 },
  "yang/남원": { munkwa: 70 },
  "noh/광주": { jeongseung: 1, munkwa: 60, highlight: "소재 노수신이 영의정에 올랐다." },
  "eom/영월": { queens: 1, munkwa: 30, highlight: "고종의 후궁 순헌황귀비 엄씨를 배출했다." },
  "gong/곡부": { munkwa: 25, highlight: "공자의 후손을 표방한다. 정조가 본관을 곡부로 정해주었다." },
  "hyun/연주": { munkwa: 60, highlight: "조선의 대표적인 역관(譯官) 집안이었다." },
  "joo/신안": { munkwa: 40, highlight: "주자(朱熹)의 후손을 표방한다." },
  "jang/덕수": { munkwa: 20, highlight: "고려말 귀화한 위구르계 장순룡이 시조다." },
  "sul/경주": { munkwa: 20 },
  "seol/경주": { munkwa: 20, highlight: "원효대사의 아들 설총이 이 가문이다." },
  "gil/해평": { munkwa: 20, highlight: "고려말 삼은의 한 사람, 야은 길재의 가문이다." },
  "wi/장흥": { munkwa: 25, highlight: "존재 위백규 등 호남 실학자를 배출했다." },
  "myeong/서촉": { munkwa: 10, highlight: "원말 촉(蜀)을 세운 명옥진의 아들이 고려로 망명해 이룬 가문이다." },
  "chun/영양": { munkwa: 10, highlight: "임진왜란 때 명나라 장수로 참전했다 귀화한 천만리가 시조다." },
  "pyeon/절강": { munkwa: 5, highlight: "임진왜란 때 귀화한 명나라 장수 편갈송이 시조다." },
  "cha/연안": { munkwa: 45 },
  "ji/충주": { munkwa: 40 },
  "yeom/파주": { jeongseung: 1, munkwa: 30 },
  "yeo/함양": { munkwa: 30 },
  "chu/추계": { munkwa: 25, highlight: "『명심보감』을 엮은 추적의 가문으로 전한다." },
  "do/성주": { munkwa: 25 },
  "so/진주": { munkwa: 25 },
  "byun/초계": { munkwa: 40, highlight: "조선 초 문형을 잡은 변계량의 가문이다." },
  "na/나주": { munkwa: 45 },
  "in/교동": { munkwa: 12 },
  "ok/의령": { munkwa: 10 },
  "seon/보성": { munkwa: 15 },
  "gyeong/청주": { munkwa: 15, highlight: "고려 무신정권의 경대승이 이 가문이다." },
  "gu-qiu/평해": { munkwa: 10 },
  "gan/가평": { munkwa: 3 },
  "gwan-guan/밀양": { munkwa: 2, highlight: "삼국지 관우의 후손을 표방하는 희성이다." },
};

export function getRecord(surnameId: string, clanSlug: string): ClanRecord {
  return CLAN_RECORDS[`${surnameId}/${clanSlug}`] ?? {};
}
