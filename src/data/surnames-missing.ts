import type { Surname } from "./types";

/**
 * 통계청 2015년 집계에서 인구가 제법 되는데도 빠져 있던 성씨들.
 *
 * "우리 성씨가 없다"는 제보가 실제로 들어와서 채웠다.
 * 특히 임(任)·유(兪)·강(康)·양(楊)은 10만 명 안팎이라 빠져 있으면 안 되는 성씨였다.
 *
 * 시조와 인구는 각 문중·공개 사전류로 하나씩 확인했다.
 * 확인되지 않은 것은 지어내지 않고 비워둔다.
 */
export const MISSING_SURNAMES: Surname[] = [
  {
    id: "im-task",
    ko: "임",
    hanja: "任",
    reading: "Im / Yim",
    chosung: "ㅇ",
    population: 172000,
    rank: 53,
    origin:
      "'맡길 임(任)'을 쓰며, 수풀 림(林)의 임씨와는 완전히 다른 성씨다. 풍천 임씨와 장흥 임씨가 두 축을 이룬다. 풍천(豊川)은 황해도의 옛 고을이다.",
    clans: [
      { name: "풍천 임씨", hanja: "豊川", founder: "임온(任溫)", note: "임씨의 최대 본관. 우의정 임백경, 학자 임성주를 배출했다.", population: 143881 },
      { name: "장흥 임씨", hanja: "長興", founder: "임호(任灝)", note: "전남 장흥이 본관.", population: 28000 },
    ],
    figures: ["임성주(성리학자)", "임백경(조선 우의정)"],
  },
  {
    id: "yu-yu",
    ko: "유",
    hanja: "兪",
    reading: "Yu",
    chosung: "ㅇ",
    population: 152000,
    rank: 56,
    origin:
      "'대답할 유(兪)'로, 버들 류(柳)·묘금도 유(劉)와 모두 다른 성씨다. 기계 유씨가 절대다수를 차지하며, 조선 후기 정승과 개화기 지식인을 여럿 배출했다.",
    clans: [
      { name: "기계 유씨", hanja: "杞溪", founder: "유삼재(兪三宰)", note: "신라 아찬을 지냈다고 전한다. 영의정 유척기, 개화기 유길준이 이 가문이다.", population: 139073 },
      { name: "창원 유씨", hanja: "昌原", founder: "유섭(兪涉)", note: "경남 창원이 본관.", population: 8000 },
      { name: "무안 유씨", hanja: "務安", founder: "유천유(兪千遇)", note: "전남 무안이 본관.", population: 3000 },
    ],
    figures: ["유길준(『서유견문』)", "유척기(조선 영의정)", "유진오(법학자)"],
  },
  {
    id: "kang-health",
    ko: "강",
    hanja: "康",
    reading: "Kang",
    chosung: "ㄱ",
    population: 110000,
    rank: 67,
    origin:
      "'편안할 강(康)'으로, 진주 강씨의 강(姜)과는 다른 성씨다. 시조 강호경은 고려 태조 왕건의 외6대조로 전하며, 조선 태조의 계비 신덕왕후도 이 가문에서 나왔다.",
    clans: [
      { name: "신천 강씨", hanja: "信川", founder: "강호경(康虎景)", note: "왕건의 외6대조로 전한다. 황해도 신천이 본관.", population: 85453 },
      { name: "곡산 강씨", hanja: "谷山", founder: "강규(康規)", note: "신천 강씨에서 갈라졌다.", population: 15000 },
      { name: "재령 강씨", hanja: "載寧", founder: "강지연(康之淵)", note: "고려 명종 때 문하시중.", population: 8000 },
    ],
    figures: ["신덕왕후 강씨(조선 태조 계비)", "강호경(고려 태조 외6대조)"],
  },
  {
    id: "yang-poplar",
    ko: "양",
    hanja: "楊",
    reading: "Yang",
    chosung: "ㅇ",
    population: 45000,
    rank: 72,
    origin:
      "'버들 양(楊)'으로, 제주·남원 양씨의 양(梁)과는 다른 성씨다. 시조 양기는 원나라 사람으로 공민왕비 노국대장공주를 따라 고려에 들어와 정착했다고 전한다.",
    clans: [
      { name: "청주 양씨", hanja: "淸州", founder: "양기(楊起)", note: "楊씨의 대종. 명필 봉래 양사언이 이 가문이다.", population: 38161 },
      { name: "밀양 양씨", hanja: "密陽", founder: "양근(楊根)", note: "경남 밀양이 본관.", population: 4000 },
    ],
    figures: ["양사언(봉래, 명필)"],
  },
  {
    id: "seok-stone",
    ko: "석",
    hanja: "石",
    reading: "Seok",
    chosung: "ㅅ",
    population: 43000,
    rank: 80,
    origin:
      "'돌 석(石)'으로, 신라 석탈해의 석(昔)씨와는 다른 성씨다. 충주 석씨가 거의 전부를 차지한다.",
    clans: [
      { name: "충주 석씨", hanja: "忠州", founder: "석린(石隣)", note: "고려 의종 때 상장군에 올라 예성군에 봉해졌다.", population: 41802 },
      { name: "홍주 석씨", hanja: "洪州", founder: "석수명(石壽明)", note: "한성판윤을 지낸 뒤 홍주로 분관했다.", population: 1009 },
    ],
    figures: ["석린(고려 상장군)"],
  },
  {
    id: "ban",
    ko: "반",
    hanja: "潘",
    reading: "Ban",
    chosung: "ㅂ",
    population: 26000,
    rank: 82,
    origin:
      "시조 반부는 남송의 한림학사로, 고려에 귀화해 정당문학에 오르고 기성부원군에 봉해졌다고 전한다. 거제(기성)에서 광주·남평으로 갈라졌다.",
    clans: [
      { name: "기성 반씨", hanja: "岐城", founder: "반부(潘阜)", note: "기성은 거제의 옛 이름이다.", population: 7631 },
      { name: "광주 반씨", hanja: "光州", founder: "반충(潘忠)", note: "반부의 7세손. 조선 개국공신으로 광주백에 봉해지며 갈라졌다. 반기문 전 UN 사무총장이 이 가문이다.", population: 8000 },
      { name: "거제 반씨", hanja: "巨濟", founder: "반부(潘阜)", note: "기성 반씨와 같은 뿌리다.", population: 5183 },
      { name: "남평 반씨", hanja: "南平", founder: "반유현(潘有賢)", note: "반부의 8세손. 전남 장성 일대에 세거했다.", population: 3053 },
    ],
    figures: ["반기문(전 UN 사무총장, 광주 반씨)", "반부(고려 정당문학)"],
  },
  {
    id: "maeng",
    ko: "맹",
    hanja: "孟",
    reading: "Maeng",
    chosung: "ㅁ",
    population: 21454,
    rank: 89,
    origin:
      "시조 맹의는 맹자의 51세손으로 전하며, 고려 충선왕 때 신창백에 봉해졌다. 조선 세종 때 좌의정을 지낸 고불 맹사성이 이 가문에서 나왔다.",
    clans: [
      { name: "신창 맹씨", hanja: "新昌", founder: "맹의(孟儀)", note: "맹씨의 거의 전부. 청백리 맹사성의 고택이 충남 아산에 남아 있다.", population: 21000 },
      { name: "온양 맹씨", hanja: "溫陽", founder: "맹의(孟儀)", note: "신창 맹씨와 같은 뿌리다.", population: 400 },
    ],
    figures: ["맹사성(고불, 조선 좌의정·청백리)"],
  },
  {
    id: "mo",
    ko: "모",
    hanja: "牟",
    reading: "Mo",
    chosung: "ㅁ",
    population: 20644,
    rank: 91,
    origin:
      "시조 모경은 북송의 대사마대장군으로 고려에 사신으로 왔다가, 이자겸의 모반을 막은 공으로 모평군에 봉해졌다고 전한다. 모평은 함평의 옛 이름이다.",
    clans: [
      { name: "함평 모씨", hanja: "咸平", founder: "모경(牟慶)", note: "모씨의 거의 전부.", population: 20543 },
      { name: "함풍 모씨", hanja: "咸豐", founder: "모경(牟慶)", note: "함평의 옛 이름을 쓴 같은 계통.", population: 101 },
    ],
    figures: ["모경(고려 평장사)"],
  },
  {
    id: "yeo-surplus",
    ko: "여",
    hanja: "余",
    reading: "Yeo",
    chosung: "ㅇ",
    population: 17780,
    rank: 96,
    origin:
      "'남을 여(余)'로, 함양 여씨의 여(呂)와는 다른 성씨다. 시조 여선재는 백제 의자왕의 후손으로 전하며, 송나라에서 돌아와 의춘군에 봉해졌다고 한다. 의춘은 의령의 옛 이름이다.",
    clans: [
      { name: "의령 여씨", hanja: "宜寧", founder: "여선재(余善才)", note: "余씨의 거의 전부. 경남 하동에 집성촌이 있다.", population: 17000 },
    ],
    figures: ["여현경(고려 문과 급제, 중시조)"],
  },
  {
    id: "noh-lu",
    ko: "노",
    hanja: "魯",
    reading: "No / Noh",
    chosung: "ㄴ",
    population: 15000,
    rank: 76,
    origin:
      "'노나라 노(魯)'로, 광주 노씨의 노(盧)와는 다른 성씨다. 중국 전국시대 제나라 노중련의 후예로 전하며, 강화 노씨와 함평 노씨가 대표 본관이다.",
    clans: [
      { name: "강화 노씨", hanja: "江華", founder: "노중련(魯仲連)", note: "중시조 노용신이 몽골 침입 때 강화현령으로 공을 세워 강화군에 봉해졌다.", population: 8000 },
      { name: "함평 노씨", hanja: "咸平", founder: "노목(魯穆)", note: "전남 함평이 본관.", population: 5000 },
    ],
    figures: ["노용신(고려 이부상서)"],
  },
  {
    id: "yu-warehouse",
    ko: "유",
    hanja: "庾",
    reading: "Yu",
    chosung: "ㅇ",
    population: 12912,
    rank: 103,
    origin:
      "'곳집 유(庾)'로, 柳·劉·兪와 모두 다른 성씨다. 고려 삼한통일의 공신 유금필(庾黔弼)이 평산 유씨의 시조이고, 그 5세손 유녹숭이 무송 유씨로 갈라졌다.",
    clans: [
      { name: "무송 유씨", hanja: "茂松", founder: "유녹숭(庾祿崇)", note: "유금필의 5세손. 고려 숙종 때 참지정사에 올랐다.", population: 12459 },
      { name: "평산 유씨", hanja: "平山", founder: "유금필(庾黔弼)", note: "왕건을 도와 후삼국 통일에 공을 세운 명장.", population: 1000 },
      { name: "무장 유씨", hanja: "茂長", founder: "유녹숭(庾祿崇)", note: "무송과 같은 뿌리다.", population: 453 },
    ],
    figures: ["유금필(고려 개국 명장)"],
  },
  {
    id: "bong",
    ko: "봉",
    hanja: "奉",
    reading: "Bong",
    chosung: "ㅂ",
    population: 11853,
    rank: 106,
    origin:
      "시조 봉우는 고려 인종 때 문과에 급제해 좌복야에 오르고 하음백에 봉해졌다. 하음(河陰)은 지금의 인천 강화군 하점면 일대다.",
    clans: [
      { name: "하음 봉씨", hanja: "河陰", founder: "봉우(奉佑)", note: "奉씨의 거의 전부.", population: 11800 },
    ],
    figures: ["봉우(고려 좌복야)"],
  },
  {
    id: "bu",
    ko: "부",
    hanja: "夫",
    reading: "Bu",
    chosung: "ㅂ",
    population: 10222,
    rank: 110,
    origin:
      "탐라 개국설화의 세 신인 가운데 하나인 부을나(夫乙那)를 시조로 삼는다. 제주 고씨·제주 양씨와 같은 뿌리이며, 셋을 묶어 탐라 삼성(三姓)이라 부른다.",
    clans: [
      { name: "제주 부씨", hanja: "濟州", founder: "부을나(夫乙那)", note: "이후 계보가 끊겨 조선 초 부언경(夫彦景)을 1세조로 삼는다.", population: 10000 },
    ],
    figures: ["부을나(탐라 삼성 신인)"],
  },
  {
    id: "ga",
    ko: "가",
    hanja: "賈",
    reading: "Ga / Ka",
    chosung: "ㄱ",
    population: 9500,
    rank: 112,
    origin:
      "시조 가유약은 명나라 병부상서로 임진왜란 때 원군을 이끌고 조선에 왔다. 정유재란 때 아들·손자와 함께 다시 참전해 1600년 부산에서 아들과 함께 전사했고, 남은 후손이 조선에 정착했다.",
    clans: [
      { name: "소주 가씨", hanja: "蘇州", founder: "가유약(賈維鑰)", note: "賈씨의 거의 전부. 소주는 중국 쑤저우다.", population: 9400 },
    ],
    figures: ["가유약(명나라 병부상서, 임진왜란 참전)"],
  },
  {
    id: "bok",
    ko: "복",
    hanja: "卜",
    reading: "Bok",
    chosung: "ㅂ",
    population: 9538,
    rank: 113,
    origin:
      "시조 복지겸은 918년 배현경·신숭겸·홍유와 함께 왕건을 추대해 고려를 세운 개국공신 1등이다. 고려 태조의 묘정에 배향되었다.",
    clans: [
      { name: "면천 복씨", hanja: "沔川", founder: "복지겸(卜智謙)", note: "卜씨의 거의 전부. 면천은 충남 당진이다.", population: 9400 },
    ],
    figures: ["복지겸(고려 개국공신 1등)"],
  },
  {
    id: "mok",
    ko: "목",
    hanja: "睦",
    reading: "Mok",
    chosung: "ㅁ",
    population: 8600,
    rank: 115,
    origin:
      "시조 목효기는 고려 고종 때 낭장동정을 지냈다. 인구는 적지만 조선시대 문과 급제자 34명을 냈고, 인구 1천 명당 급제자 수로는 가장 높은 성씨로 꼽힌다.",
    clans: [
      { name: "사천 목씨", hanja: "泗川", founder: "목효기(睦孝基)", note: "睦씨의 거의 전부. 경남 사천이 본관.", population: 8500 },
    ],
    figures: ["목효기(고려 낭장동정)"],
  },
  {
    id: "sa",
    ko: "사",
    hanja: "史",
    reading: "Sa",
    chosung: "ㅅ",
    population: 8000,
    rank: 109,
    origin:
      "시조 사요는 명나라 예부상서로, 모함을 받자 1372년 고려로 망명해 경기 파주에 정착했다고 전한다. 본관 청주는 중국 산둥성 칭저우(靑州)에서 왔다.",
    clans: [
      { name: "청주 사씨", hanja: "淸州", founder: "사요(史繇)", note: "史씨의 거의 전부.", population: 7900 },
    ],
    figures: ["사요(명나라 예부상서)"],
  },
  {
    id: "jin-jin",
    ko: "진",
    hanja: "晉",
    reading: "Jin",
    chosung: "ㅈ",
    population: 7128,
    rank: 116,
    origin:
      "'나아갈 진(晉)'으로, 陳·秦·眞과 모두 다른 성씨다. 시조 진함조는 1023년 상서좌복야를 거쳐 내사시랑평장사에 올랐다.",
    clans: [
      { name: "남원 진씨", hanja: "南原", founder: "진함조(晋含祚)", note: "晉씨의 거의 전부. 충렬왕 때 예부상서 진효경을 중시조로 삼기도 한다.", population: 7000 },
    ],
    figures: ["진함조(고려 내사시랑평장사)"],
  },
];
