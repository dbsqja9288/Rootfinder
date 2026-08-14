export type TierId = "royal" | "sadaebu" | "hyangban" | "jungin" | "yangin";

export type Tier = {
  id: TierId;
  name: string;
  hanja: string;
  tagline: string;
  desc: string;
  color: string; // 결과 카드 강조색
};

export const TIERS: Record<TierId, Tier> = {
  royal: {
    id: "royal",
    name: "종친",
    hanja: "宗親",
    tagline: "궁궐 담장 안쪽의 사람들",
    desc: "왕실의 피가 흐르는 가문입니다. 나라의 주인이거나, 주인과 한 핏줄이었습니다.",
    color: "#b8860b",
  },
  sadaebu: {
    id: "sadaebu",
    name: "사대부",
    hanja: "士大夫",
    tagline: "조정의 중심에 섰던 사람들",
    desc: "정승과 판서를 배출한 명문입니다. 붓과 도장으로 나라를 움직였습니다.",
    color: "#7c2d12",
  },
  hyangban: {
    id: "hyangban",
    name: "향반",
    hanja: "鄕班",
    tagline: "고을을 이끈 선비 집안",
    desc: "서원을 세우고 후학을 길렀습니다. 중앙보다 지역에서 존경받던 사족입니다.",
    color: "#4c7a6d",
  },
  jungin: {
    id: "jungin",
    name: "중인",
    hanja: "中人",
    tagline: "실무로 나라를 굴린 사람들",
    desc: "역관·의관·산원 같은 전문직입니다. 양반이 못 하는 일을 도맡았습니다.",
    color: "#3f6212",
  },
  yangin: {
    id: "yangin",
    name: "양인",
    hanja: "良人",
    tagline: "조선을 떠받친 대다수",
    desc: "인구의 대부분이 여기 속했습니다. 땅을 일구고 세금을 내며 나라를 지탱했습니다.",
    color: "#57534e",
  },
};

export const TIER_ORDER: TierId[] = ["royal", "sadaebu", "hyangban", "jungin", "yangin"];

export const MBTI_LIST = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
] as const;

export type Mbti = (typeof MBTI_LIST)[number];

export type Job = { name: string; hanja?: string; desc: string };

export type Archetype = {
  mbti: Mbti;
  trait: string; // 기질 한 줄
  family: string; // 직업 계열
  jobs: Record<TierId, Job>;
};

/**
 * 기질(MBTI)이 '무슨 일을 하는가'를, 가문 등급이 '어느 자리에서 하는가'를 정한다.
 * 같은 손재주라도 사대부면 군기시 별제, 양인이면 마을 대장장이가 되는 식이다.
 */
export const ARCHETYPES: Record<Mbti, Archetype> = {
  ISTJ: {
    mbti: "ISTJ",
    trait: "원칙을 지키고 기록을 남기는 사람",
    family: "기록과 법도",
    jobs: {
      royal: { name: "종부시 제조", hanja: "宗簿寺提調", desc: "왕실 족보를 관리하고 종친의 잘잘못을 살피는 자리. 원칙에 어긋나면 왕족에게도 직언했습니다." },
      sadaebu: { name: "사관", hanja: "史官", desc: "왕의 곁에서 말과 행동을 하나도 빠짐없이 적었습니다. 왕이 보자고 해도 보여주지 않는 것이 사관의 자존심이었습니다." },
      hyangban: { name: "향교 훈도", hanja: "訓導", desc: "고을 향교에서 규율을 세우고 학생을 가르쳤습니다. 지각 한 번을 그냥 넘기지 않았습니다." },
      jungin: { name: "호적 서리", hanja: "書吏", desc: "고을의 호적과 토지 장부를 관리했습니다. 숫자 하나 틀리면 세금이 어긋나니 밤새 대조했습니다." },
      yangin: { name: "마을 유사", hanja: "有司", desc: "동네 계(契)의 장부를 맡았습니다. 누가 얼마를 냈는지 십 년 치를 기억하는 사람이었습니다." },
    },
  },
  ISFJ: {
    mbti: "ISFJ",
    trait: "묵묵히 사람을 돌보는 사람",
    family: "치유와 돌봄",
    jobs: {
      royal: { name: "내의원 어의", hanja: "御醫", desc: "왕과 왕비의 몸을 돌보았습니다. 임금의 맥을 짚는 손끝에 나라의 안위가 걸려 있었습니다." },
      sadaebu: { name: "전의감 의관", hanja: "醫官", desc: "궁중 의료기관에서 약재를 다루고 처방을 내렸습니다. 허준도 여기서 시작했습니다." },
      hyangban: { name: "고을 약방 주인", desc: "사랑채를 약방 삼아 이웃을 돌봤습니다. 돈 없는 이에게는 그냥 약을 지어 주었습니다." },
      jungin: { name: "의녀", hanja: "醫女", desc: "양반가 여인을 진료하던 전문 의료인. 드라마 속 대장금이 바로 이 자리입니다." },
      yangin: { name: "산파", desc: "마을의 아이를 받아냈습니다. 그 동네 사람 절반이 이 손을 거쳐 세상에 나왔습니다." },
    },
  },
  INFJ: {
    mbti: "INFJ",
    trait: "멀리 보고 사람의 속을 읽는 사람",
    family: "사상과 신념",
    jobs: {
      royal: { name: "왕사", hanja: "王師", desc: "왕의 스승. 임금이 가야 할 길을 일러주는 자리로, 무학대사가 태조에게 그러했습니다." },
      sadaebu: { name: "성균관 대사성", hanja: "大司成", desc: "나라 최고 학부의 수장. 젊은 선비들의 정신을 벼려내는 자리였습니다." },
      hyangban: { name: "서원 산장", hanja: "山長", desc: "산자락에 서원을 열고 제자를 길렀습니다. 벼슬을 마다하고 학문을 택한 사람들입니다." },
      jungin: { name: "점복관", hanja: "占卜官", desc: "관상감에서 길흉을 점쳤습니다. 나라의 큰일에는 반드시 이들의 말을 물었습니다." },
      yangin: { name: "마을 무당", desc: "사람들의 아픔과 두려움을 대신 짊어졌습니다. 신분은 낮았으나 마을은 이 사람 없이 못 살았습니다." },
    },
  },
  INTJ: {
    mbti: "INTJ",
    trait: "판을 읽고 수를 미리 두는 사람",
    family: "전략과 계책",
    jobs: {
      royal: { name: "도체찰사", hanja: "都體察使", desc: "전시에 군사와 행정을 통째로 지휘하던 최고직. 류성룡이 임진왜란 때 맡았습니다." },
      sadaebu: { name: "병조판서", hanja: "兵曹判書", desc: "나라의 군사를 총괄했습니다. 지도를 펴놓고 십 년 뒤를 계산하는 자리였습니다." },
      hyangban: { name: "막료 책사", hanja: "策士", desc: "장수의 곁에서 계책을 냈습니다. 앞에 나서지 않고 판을 짜는 쪽을 택했습니다." },
      jungin: { name: "산원", hanja: "算員", desc: "호조에서 나라의 회계를 맡았습니다. 숫자로 국가의 살림을 꿰뚫어 보았습니다." },
      yangin: { name: "둔전 관리인", desc: "군량을 대는 농지를 관리했습니다. 몇 명이 몇 달을 먹을지 정확히 계산해냈습니다." },
    },
  },
  ISTP: {
    mbti: "ISTP",
    trait: "말보다 손이 먼저 움직이는 사람",
    family: "쇠와 연장",
    jobs: {
      royal: { name: "상의원 별좌", hanja: "尙衣院別坐", desc: "왕실의 기물과 무기를 만드는 곳의 책임자. 임금이 쓰는 물건은 여기서 나왔습니다." },
      sadaebu: { name: "군기시 별제", hanja: "軍器寺別提", desc: "나라의 무기를 만들고 관리했습니다. 화약과 총통을 다루는 위험한 자리였습니다." },
      hyangban: { name: "무기 감독관", desc: "고을 무기고를 살피고 병장기를 손봤습니다. 녹슨 칼 한 자루도 그냥 두지 않았습니다." },
      jungin: { name: "궁장", hanja: "弓匠", desc: "활을 만드는 장인. 물소 뿔과 힘줄로 조선의 각궁을 빚어냈습니다." },
      yangin: { name: "대장장이", desc: "마을 어귀 대장간의 주인. 낫부터 문고리까지, 쇠로 된 건 다 이 손을 거쳤습니다." },
    },
  },
  ISFP: {
    mbti: "ISFP",
    trait: "아름다운 것을 알아보고 만드는 사람",
    family: "그림과 손끝",
    jobs: {
      royal: { name: "어진화사", hanja: "御眞畵師", desc: "임금의 초상을 그리는 화가. 나라에서 가장 잘 그리는 사람만 뽑혔습니다." },
      sadaebu: { name: "도화서 별제", hanja: "圖畵署別提", desc: "궁중 화원들을 이끌었습니다. 겸재 정선도 이 길을 걸었습니다." },
      hyangban: { name: "문인화가", desc: "벼슬보다 붓을 택한 선비. 매화와 대나무를 치며 마음을 다스렸습니다." },
      jungin: { name: "도화서 화원", hanja: "畵員", desc: "궁중 행사와 지도를 그렸습니다. 김홍도와 신윤복이 바로 이 자리였습니다." },
      yangin: { name: "도공", hanja: "陶工", desc: "가마 앞에서 흙을 빚었습니다. 이름은 남지 않았지만 그릇은 오늘날 국보가 되었습니다." },
    },
  },
  INFP: {
    mbti: "INFP",
    trait: "마음속 세계가 넓고 깊은 사람",
    family: "글과 정취",
    jobs: {
      royal: { name: "홍문관 대제학", hanja: "大提學", desc: "나라의 문장을 대표하는 자리. 정승보다 이 자리를 더 명예롭게 여겼습니다." },
      sadaebu: { name: "예문관 응교", hanja: "應敎", desc: "왕의 교서를 짓고 문한을 다뤘습니다. 글 한 줄로 나라의 뜻을 전했습니다." },
      hyangban: { name: "은일 문인", hanja: "隱逸", desc: "벼슬길을 접고 시를 썼습니다. 고산 윤선도가 보길도에서 그러했습니다." },
      jungin: { name: "위항 시인", hanja: "委巷詩人", desc: "중인 신분으로 시를 지었습니다. 양반이 아니어도 시는 쓸 수 있었습니다." },
      yangin: { name: "떠돌이 소리꾼", desc: "장터를 돌며 노래로 이야기를 팔았습니다. 판소리가 여기서 자랐습니다." },
    },
  },
  INTP: {
    mbti: "INTP",
    trait: "왜 그런지 끝까지 파고드는 사람",
    family: "하늘과 숫자",
    jobs: {
      royal: { name: "관상감 영사", hanja: "領事", desc: "천문과 역법을 총괄했습니다. 하늘의 뜻을 읽어 왕에게 아뢰는 자리였습니다." },
      sadaebu: { name: "집현전 학사", hanja: "學士", desc: "밤새 책을 읽고 새 제도를 궁리했습니다. 훈민정음이 이곳에서 나왔습니다." },
      hyangban: { name: "재야 실학자", desc: "관직 없이 책을 썼습니다. 농법·지리·수학을 파고들어 두꺼운 저술을 남겼습니다." },
      jungin: { name: "관상감 천문관", hanja: "天文官", desc: "별의 움직임을 관측하고 달력을 만들었습니다. 일식을 하루 단위로 예측해냈습니다." },
      yangin: { name: "물레방아 목수", desc: "물길과 톱니를 계산해 방아를 놓았습니다. 배운 적 없이 원리를 스스로 깨쳤습니다." },
    },
  },
  ESTP: {
    mbti: "ESTP",
    trait: "몸이 먼저 뛰는 승부사",
    family: "무예와 담력",
    jobs: {
      royal: { name: "도총관", hanja: "都摠管", desc: "궁궐 수비를 총괄했습니다. 임금의 목숨을 지키는 마지막 방패였습니다." },
      sadaebu: { name: "삼도수군통제사", hanja: "統制使", desc: "바다를 지키는 최고 지휘관. 이순신이 맡았던 그 자리입니다." },
      hyangban: { name: "의병장", hanja: "義兵將", desc: "나라가 위태로울 때 사재를 털어 군사를 모았습니다. 곽재우가 그러했습니다." },
      jungin: { name: "포도부장", hanja: "捕盜部將", desc: "한양의 도둑을 잡았습니다. 밤거리를 누비며 범인을 쫓았습니다." },
      yangin: { name: "보부상", hanja: "褓負商", desc: "등짐을 지고 전국을 걸었습니다. 산길 도적도 이들은 함부로 건드리지 못했습니다." },
    },
  },
  ESFP: {
    mbti: "ESFP",
    trait: "사람들 사이에서 빛나는 사람",
    family: "무대와 흥",
    jobs: {
      royal: { name: "장악원 제조", hanja: "掌樂院提調", desc: "궁중 음악을 총괄했습니다. 나라의 큰 잔치는 이 사람 손끝에서 시작됐습니다." },
      sadaebu: { name: "진연 도감 당상", desc: "왕실 잔치를 기획하고 지휘했습니다. 수백 명이 움직이는 행사를 지휘봉 하나로 굴렸습니다." },
      hyangban: { name: "풍류객", hanja: "風流客", desc: "정자에 사람을 모아 시와 술과 노래를 즐겼습니다. 놀 줄 아는 선비였습니다." },
      jungin: { name: "악공", hanja: "樂工", desc: "궁중과 관아에서 연주했습니다. 가야금 한 줄로 좌중을 울렸습니다." },
      yangin: { name: "남사당 광대", desc: "줄을 타고 재주를 넘으며 팔도를 돌았습니다. 사람들이 가장 기다린 손님이었습니다." },
    },
  },
  ENFP: {
    mbti: "ENFP",
    trait: "사람과 이야기를 몰고 다니는 사람",
    family: "말과 인연",
    jobs: {
      royal: { name: "사은사 정사", hanja: "正使", desc: "왕을 대신해 외국에 가는 사절단의 우두머리. 나라의 얼굴이었습니다." },
      sadaebu: { name: "승정원 승지", hanja: "承旨", desc: "왕의 말을 신하에게, 신하의 말을 왕에게 옮겼습니다. 말솜씨가 곧 실력이었습니다." },
      hyangban: { name: "유세하는 선비", desc: "이 고을 저 고을 다니며 사람을 만나고 뜻을 폈습니다. 발이 넓기로 유명했습니다." },
      jungin: { name: "역관", hanja: "譯官", desc: "사신단의 통역. 말만 옮긴 게 아니라 무역으로 큰돈을 만지기도 했습니다." },
      yangin: { name: "전기수", hanja: "傳奇叟", desc: "저잣거리에서 소설을 읽어주던 이야기꾼. 결정적 대목에서 딱 멈추고 돈을 걷었습니다." },
    },
  },
  ENTP: {
    mbti: "ENTP",
    trait: "판을 흔들고 새 길을 내는 사람",
    family: "논쟁과 발명",
    jobs: {
      royal: { name: "개혁 재상", desc: "나라의 틀을 새로 짠 사람. 정도전이 조선의 설계도를 그렸습니다." },
      sadaebu: { name: "사헌부 대사헌", hanja: "大司憲", desc: "관리의 잘못을 따지고 왕에게도 대들었습니다. 논쟁으로 밥을 먹는 자리였습니다." },
      hyangban: { name: "상소하는 유생", desc: "부당하다 싶으면 도끼를 들고 상소를 올렸습니다. 물러설 줄 몰랐습니다." },
      jungin: { name: "군기시 화약장", desc: "화약과 신무기를 개발했습니다. 최무선의 후예들이 여기 있었습니다." },
      yangin: { name: "장터 거간꾼", desc: "말 한마디로 흥정을 붙였습니다. 없던 거래도 만들어내는 재주가 있었습니다." },
    },
  },
  ESTJ: {
    mbti: "ESTJ",
    trait: "조직을 세우고 굴리는 사람",
    family: "행정과 통솔",
    jobs: {
      royal: { name: "영의정", hanja: "領議政", desc: "백관의 우두머리. 나라 살림 전체가 이 사람 결재를 거쳤습니다." },
      sadaebu: { name: "관찰사", hanja: "觀察使", desc: "도(道) 하나를 통째로 다스렸습니다. 오늘날 도지사에 해당합니다." },
      hyangban: { name: "현감", hanja: "縣監", desc: "고을 수령. 세금·재판·치안을 혼자 다 챙겼습니다." },
      jungin: { name: "아전", hanja: "衙前", desc: "관아의 실무를 도맡았습니다. 수령은 바뀌어도 아전은 그대로였습니다." },
      yangin: { name: "이정", hanja: "里正", desc: "마을의 우두머리. 세금 걷고 부역 나눠주는 일을 맡았습니다." },
    },
  },
  ESFJ: {
    mbti: "ESFJ",
    trait: "사람을 챙기고 자리를 만드는 사람",
    family: "살림과 화합",
    jobs: {
      royal: { name: "내명부 총괄 상궁", desc: "궁궐 안 살림과 궁녀들을 총괄했습니다. 왕실의 하루가 이 손에서 시작됐습니다." },
      sadaebu: { name: "예조판서", hanja: "禮曹判書", desc: "나라의 의례와 외교를 맡았습니다. 관계를 다루는 것이 곧 실력이었습니다." },
      hyangban: { name: "종가 종부", hanja: "宗婦", desc: "제사와 손님 접대를 총괄했습니다. 문중 전체의 살림이 이 사람에게 달렸습니다." },
      jungin: { name: "객주", hanja: "客主", desc: "상인들의 숙식과 거래를 중개했습니다. 사람 얼굴을 기억하는 것이 자산이었습니다." },
      yangin: { name: "주막 주인", desc: "길손을 재우고 먹였습니다. 팔도의 소식이 이 마루에서 오갔습니다." },
    },
  },
  ENFJ: {
    mbti: "ENFJ",
    trait: "사람을 키우고 이끄는 사람",
    family: "가르침과 교화",
    jobs: {
      royal: { name: "세자시강원 빈객", hanja: "賓客", desc: "다음 임금이 될 세자를 가르쳤습니다. 나라의 미래를 빚는 자리였습니다." },
      sadaebu: { name: "성균관 사성", hanja: "司成", desc: "나라의 인재를 길렀습니다. 제자가 곧 정치적 자산이 되었습니다." },
      hyangban: { name: "서원 원장", desc: "지역 인재를 모아 가르쳤습니다. 이 문하에서 급제자가 줄줄이 나왔습니다." },
      jungin: { name: "역학 훈도", desc: "외국어를 가르치는 선생. 후배 역관을 길러냈습니다." },
      yangin: { name: "서당 훈장", desc: "마을 아이들에게 천자문을 가르쳤습니다. 온 동네가 이 사람에게 배웠습니다." },
    },
  },
  ENTJ: {
    mbti: "ENTJ",
    trait: "목표를 정하면 끝을 보는 지휘자",
    family: "권력과 결단",
    jobs: {
      royal: { name: "대군", hanja: "大君", desc: "왕의 적자. 마음만 먹으면 왕좌까지 넘볼 수 있는 자리였습니다." },
      sadaebu: { name: "좌의정", hanja: "左議政", desc: "영의정 다음가는 실권자. 실제로는 정책을 밀어붙이는 쪽이었습니다." },
      hyangban: { name: "향약 도약정", hanja: "都約正", desc: "고을 자치 규약의 우두머리. 수령도 함부로 못 하는 지역 실세였습니다." },
      jungin: { name: "무역 상단 행수", hanja: "行首", desc: "사신단을 따라가 청·일과 거래했습니다. 임상옥 같은 거상이 여기서 나왔습니다." },
      yangin: { name: "장시 대행수", desc: "여러 장터의 상인들을 이끌었습니다. 맨손으로 시작해 상권을 손에 쥐었습니다." },
    },
  },
};

export const JOSEON_DISCLAIMER = [
  "이 결과는 **재미로 보는 콘텐츠**입니다. 개인이나 가문의 실제 신분·혈통·능력·가치와 아무런 관련이 없습니다.",
  "등급은 해당 본관에 남아 있는 **공개 기록의 양**(정승·왕비 배출, 문과 급제자 수 등)을 점수화한 것입니다. 집계 기준은 자료마다 달라 근사치이며, 학술적 근거로 인용할 수 없습니다.",
  "조선 후기 신분제가 해체되고 1909년 민적법으로 전 국민이 성과 본관을 등록하면서, **본관과 실제 혈통의 연결은 상당 부분 끊어졌습니다.** 지금의 본관으로 조상의 신분을 알아내는 것은 원칙적으로 불가능합니다.",
  "기록이 적다고 뿌리가 얕은 것이 아니고, 기록이 많다고 더 나은 가문인 것도 아닙니다. 조선 인구의 대다수는 기록을 남기지 못한 사람들이었고, 오늘의 우리는 대부분 그분들의 후손입니다.",
  "직업은 MBTI 유형에 실제 조선시대 관직·생업을 대응시킨 창작입니다. 심리학적·역사학적 근거가 없으며, 어떤 유형이 더 우월하다는 뜻이 결코 아닙니다.",
  "이 결과를 근거로 타인의 출신을 평가하거나 차별하는 데 사용하지 마세요.",
];
