export type Clan = {
  name: string; // 본관 (한글)
  hanja?: string; // 본관 한자
  founder: string; // 시조
  note?: string; // 한 줄 설명
  population?: number; // 해당 본관 인구 (2015 인구주택총조사 기준, 근사치)
};

export type Surname = {
  id: string; // URL slug
  ko: string; // 한글 성씨
  hanja: string; // 한자
  reading: string; // 로마자
  chosung: string; // 초성 (ㄱ~ㅎ)
  population: number; // 전체 인구 (2015 통계청)
  rank: number; // 인구 순위
  origin: string; // 유래 (본문)
  clans: Clan[];
  hangryeol?: string; // 항렬자 예시 설명
  figures?: string[]; // 대표 역사 인물
};

/**
 * 데이터 출처: 통계청 「2015 인구주택총조사 - 성씨·본관 집계」 및 공개된 각 종친회/문중 기록.
 * 교육·참고용으로 정리한 요약본이며, 문중별 공식 족보와 세부 내용이 다를 수 있습니다.
 */
export const SURNAMES: Surname[] = [
  {
    id: "kim",
    ko: "김",
    hanja: "金",
    reading: "Kim",
    chosung: "ㄱ",
    population: 10689959,
    rank: 1,
    origin:
      "한국에서 가장 인구가 많은 성씨로, 크게 두 갈래에서 갈라져 나왔다. 하나는 신라 왕성(王姓)인 경주 김씨 계통으로 시조 김알지(金閼智)의 탄생 설화 - 계림의 금궤에서 나왔다 하여 성을 '金'으로 삼았다는 이야기가 전한다. 다른 하나는 가락국(금관가야)을 세운 김수로왕 계통의 김해 김씨다. 이 두 뿌리에서 안동·광산·의성·강릉 등 수백 개의 본관이 분파되었다.",
    clans: [
      { name: "김해 김씨", hanja: "金海", founder: "김수로왕(金首露王)", note: "가락국의 시조. 단일 본관 기준 국내 최대 규모.", population: 4456700 },
      { name: "경주 김씨", hanja: "慶州", founder: "김알지(金閼智)", note: "신라 왕성 계통. 계림 금궤 설화로 유명.", population: 1800000 },
      { name: "광산 김씨", hanja: "光山", founder: "김흥광(金興光)", note: "조선시대 문과 급제자를 다수 배출한 대표 명문가.", population: 926000 },
      { name: "안동 김씨", hanja: "安東", founder: "김선평(金宣平) / 김숙승(金叔承)", note: "신(新)·구(舊) 안동 김씨로 나뉘며, 조선 후기 세도정치의 중심.", population: 518000 },
      { name: "의성 김씨", hanja: "義城", founder: "김석(金錫)", note: "경북 의성 일대에 세거한 영남 학맥의 명문.", population: 253000 },
      { name: "강릉 김씨", hanja: "江陵", founder: "김주원(金周元)", note: "명주군왕으로 봉해진 신라 왕족 후손.", population: 165000 },
    ],
    hangryeol:
      "본관마다 다르지만, 김해 김씨는 '종(鍾)-태(泰)-수(洙)-상(相)' 처럼 오행(火土金水木) 순서를 따르는 항렬자를 쓰는 경우가 많다.",
    figures: ["김유신(삼국통일의 명장)", "김부식(『삼국사기』 편찬)", "김정희(추사, 서예가)", "김구(독립운동가)"],
  },
  {
    id: "lee",
    ko: "이",
    hanja: "李",
    reading: "Lee / Yi",
    chosung: "ㅇ",
    population: 7306828,
    rank: 2,
    origin:
      "'오얏나무 리(李)'를 쓰는 성씨로, 신라 6부촌장 중 알천 양산촌장 알평(謁平)을 시조로 하는 경주 이씨가 가장 오래된 갈래다. 조선을 건국한 태조 이성계의 전주 이씨가 조선 500년의 왕성이 되면서 인구와 위상이 크게 확대되었다.",
    clans: [
      { name: "전주 이씨", hanja: "全州", founder: "이한(李翰)", note: "조선 왕조의 왕성. 대군·군파 등 수많은 파로 나뉜다.", population: 2631000 },
      { name: "경주 이씨", hanja: "慶州", founder: "이알평(李謁平)", note: "신라 6부촌장 중 하나로 이씨의 가장 오랜 뿌리.", population: 1392000 },
      { name: "성주 이씨", hanja: "星州", founder: "이순유(李純由)", note: "고려말~조선초 문신을 다수 배출.", population: 195000 },
      { name: "광주 이씨", hanja: "廣州", founder: "이자성(李自成)", note: "조선 전기 '팔극조정'으로 불릴 만큼 관직 진출이 활발했다.", population: 161000 },
      { name: "연안 이씨", hanja: "延安", founder: "이무(李茂)", note: "당나라 장수 출신으로 전해지는 귀화 계통.", population: 165000 },
      { name: "한산 이씨", hanja: "韓山", founder: "이윤경(李允卿)", note: "목은 이색을 배출한 학자 가문.", population: 160000 },
    ],
    hangryeol:
      "전주 이씨 왕실 계통은 오행 상생(木火土金水) 순서로 항렬자를 정했다. 예: 이산(祘)-이공(⽁)… 형태로 변형된 글자를 쓰기도 했다.",
    figures: ["이성계(조선 태조)", "이순신(충무공)", "이황(퇴계)", "이이(율곡)"],
  },
  {
    id: "park",
    ko: "박",
    hanja: "朴",
    reading: "Park / Bak",
    chosung: "ㅂ",
    population: 4192074,
    rank: 3,
    origin:
      "신라의 시조 박혁거세(朴赫居世)를 유일한 시조로 하는, 한국에서 몇 안 되는 '단일 시조' 성씨다. 커다란 알에서 태어났는데 그 알이 박(瓠)처럼 생겼다 하여 성을 '朴'으로 삼았다고 전한다. 밀양·반남·함양·순천 등 모든 본관이 박혁거세의 후손으로 연결된다.",
    clans: [
      { name: "밀양 박씨", hanja: "密陽", founder: "박언침(朴彦忱)", note: "박씨 인구의 약 70%를 차지하는 최대 본관.", population: 3103000 },
      { name: "반남 박씨", hanja: "潘南", founder: "박응주(朴應珠)", note: "연암 박지원을 배출한 조선 후기 명문.", population: 139000 },
      { name: "함양 박씨", hanja: "咸陽", founder: "박언신(朴彦信)", note: "고려 때부터 이어진 유서 깊은 갈래.", population: 168000 },
      { name: "순천 박씨", hanja: "順天", founder: "박영규(朴英規)", note: "사육신 박팽년의 가문.", population: 96000 },
      { name: "무안 박씨", hanja: "務安", founder: "박진승(朴進昇)", note: "전남 무안을 세거지로 삼았다.", population: 70000 },
    ],
    hangryeol: "밀양 박씨는 '병(丙)-규(圭)-종(鍾)-순(淳)-식(植)' 등 오행 순환 항렬자를 널리 쓴다.",
    figures: ["박혁거세(신라 시조)", "박제상(충신)", "박팽년(사육신)", "박지원(『열하일기』)"],
  },
  {
    id: "choi",
    ko: "최",
    hanja: "崔",
    reading: "Choi",
    chosung: "ㅊ",
    population: 2333927,
    rank: 4,
    origin:
      "신라 6부촌장 중 돌산 고허촌장 소벌도리(蘇伐都利)의 후손으로 전한다. 통일신라 말 대학자 최치원(崔致遠)을 중시조로 삼는 경주 최씨가 대표 갈래이며, 고려 무신정권을 이끈 최충헌의 우봉 최씨, '해동공자' 최충의 해주 최씨 등이 있다.",
    clans: [
      { name: "경주 최씨", hanja: "慶州", founder: "최치원(崔致遠)", note: "'경주 최부잣집'으로 알려진 노블레스 오블리주의 상징.", population: 976000 },
      { name: "전주 최씨", hanja: "全州", founder: "최순작(崔純爵) 외", note: "시조를 달리하는 여러 계통이 함께 쓰인다.", population: 460000 },
      { name: "해주 최씨", hanja: "海州", founder: "최온(崔溫)", note: "'해동공자' 최충의 가문으로 고려 사학(私學)의 중심.", population: 175000 },
      { name: "강릉 최씨", hanja: "江陵", founder: "최필달(崔必達) 외", note: "영동 지역의 대표 사족.", population: 155000 },
      { name: "삭녕 최씨", hanja: "朔寧", founder: "최천로(崔天老)", note: "조선 전기 문신을 다수 배출.", population: 45000 },
    ],
    figures: ["최치원(고운)", "최충(해동공자)", "최무선(화약 발명)", "최제우(동학 창시)"],
  },
  {
    id: "jung",
    ko: "정",
    hanja: "鄭",
    reading: "Jung / Jeong",
    chosung: "ㅈ",
    population: 2151879,
    rank: 5,
    origin:
      "신라 6부촌장 중 취산 진지촌장 지백호(智伯虎)를 시조로 한다. 경주 정씨에서 갈라져 동래·연일(영일)·해주·진주 등으로 분파되었다. 고려 개국공신부터 조선 성리학의 거두까지 폭넓게 인물을 배출했다.",
    clans: [
      { name: "동래 정씨", hanja: "東萊", founder: "정회문(鄭繪文)", note: "조선시대 정승 17명을 배출한 최상위 명문.", population: 442000 },
      { name: "경주 정씨", hanja: "慶州", founder: "정진후(鄭珍厚)", note: "지백호의 직계로 정씨의 뿌리.", population: 303000 },
      { name: "연일(영일) 정씨", hanja: "延日", founder: "정종은(鄭宗殷)", note: "포은 정몽주의 가문.", population: 330000 },
      { name: "진주 정씨", hanja: "晉州", founder: "정예(鄭藝) 외", note: "여러 계통이 함께 쓰인다.", population: 230000 },
      { name: "하동 정씨", hanja: "河東", founder: "정도정(鄭道正)", note: "영남 사림의 한 축.", population: 160000 },
    ],
    figures: ["정몽주(포은)", "정도전(삼봉)", "정약용(다산)", "정선(겸재)"],
  },
  {
    id: "kang",
    ko: "강",
    hanja: "姜",
    reading: "Kang",
    chosung: "ㄱ",
    population: 1176847,
    rank: 6,
    origin:
      "고구려 때 진주 지역에 정착한 강이식(姜以式) 장군을 시조로 하며, 사실상 진주 강씨 단일 본관에서 갈라진 계통이 대부분이다. 중국 염제 신농씨의 후예를 자처하는 기록이 족보에 전한다.",
    clans: [
      { name: "진주 강씨", hanja: "晉州", founder: "강이식(姜以式)", note: "강씨 인구의 대부분을 차지. 박사공파·은열공파 등으로 나뉜다.", population: 966000 },
      { name: "금천 강씨", hanja: "衿川", founder: "강여청(姜餘淸)", note: "진주 강씨에서 분파.", population: 40000 },
    ],
    figures: ["강감찬(귀주대첩)", "강희안(문신·화가)", "강세황(표암)"],
  },
  {
    id: "cho",
    ko: "조",
    hanja: "趙",
    reading: "Cho / Jo",
    chosung: "ㅈ",
    population: 1055567,
    rank: 7,
    origin:
      "'나라 조(趙)'를 쓰는 성씨로, 고려 개국 시기 지방 호족에서 출발한 갈래가 많다. 한양 조씨, 풍양 조씨, 함안 조씨 등이 대표적이며 각각 시조가 다른 독립 계통이다.",
    clans: [
      { name: "한양 조씨", hanja: "漢陽", founder: "조지수(趙之壽)", note: "조광조를 배출.", population: 317000 },
      { name: "함안 조씨", hanja: "咸安", founder: "조정(趙鼎)", note: "영남 지역 대표 사족.", population: 275000 },
      { name: "풍양 조씨", hanja: "豊壤", founder: "조맹(趙孟)", note: "조선 후기 세도가문의 하나.", population: 124000 },
      { name: "배천 조씨", hanja: "白川", founder: "조지린(趙之遴)", note: "황해도 배천을 본관으로 한다.", population: 71000 },
    ],
    figures: ["조광조(정암)", "조식(남명, ※曺씨)", "조헌(의병장)"],
  },
  {
    id: "yoon",
    ko: "윤",
    hanja: "尹",
    reading: "Yoon / Yun",
    chosung: "ㅇ",
    population: 1020547,
    rank: 8,
    origin:
      "고려 개국에 기여한 호족 세력에서 비롯되었으며, 파평 윤씨가 압도적 다수를 차지한다. 시조 윤신달(尹莘達)은 고려 태조를 도운 개국공신으로, 파평(경기 파주) 지역을 식읍으로 받았다고 전한다.",
    clans: [
      { name: "파평 윤씨", hanja: "坡平", founder: "윤신달(尹莘達)", note: "윤씨 인구의 절반 이상. 조선 왕비를 다수 배출.", population: 770000 },
      { name: "해남 윤씨", hanja: "海南", founder: "윤존부(尹存富)", note: "고산 윤선도의 가문.", population: 68000 },
      { name: "칠원 윤씨", hanja: "漆原", founder: "윤시영(尹始榮)", note: "경남 함안 칠원이 본관.", population: 55000 },
    ],
    figures: ["윤관(여진 정벌·9성 축조)", "윤선도(고산)", "윤봉길(의사)", "윤동주(시인)"],
  },
  {
    id: "jang",
    ko: "장",
    hanja: "張",
    reading: "Jang",
    chosung: "ㅈ",
    population: 992721,
    rank: 9,
    origin:
      "'활 시위 장(張)'을 쓰며, 고려 태조를 도운 인동 지역 호족 장금용(張金用)의 인동 장씨가 대표적이다. 안동 장씨, 덕수 장씨(위구르계 귀화) 등 뿌리가 서로 다른 여러 계통이 있다.",
    clans: [
      { name: "인동 장씨", hanja: "仁同", founder: "장금용(張金用)", note: "장씨 최대 본관. 경북 구미 인동이 본거지.", population: 662000 },
      { name: "안동 장씨", hanja: "安東", founder: "장정필(張貞弼)", note: "고려 개국공신 계통.", population: 90000 },
      { name: "덕수 장씨", hanja: "德水", founder: "장순룡(張舜龍)", note: "고려말 귀화한 위구르계 인물이 시조.", population: 25000 },
    ],
    figures: ["장보고(청해진 대사)", "장영실(과학기술자)", "장길산(의적)"],
  },
  {
    id: "lim",
    ko: "임",
    hanja: "林",
    reading: "Lim / Im",
    chosung: "ㅇ",
    population: 823921,
    rank: 10,
    origin:
      "'수풀 림(林)'을 쓰는 성씨. 중국 당나라에서 건너온 임팔급(林八及)을 도시조로 삼는 기록이 여러 본관 족보에 공통으로 등장한다. 나주 임씨, 평택 임씨, 예천 임씨 등으로 갈라진다.",
    clans: [
      { name: "나주 임씨", hanja: "羅州", founder: "임비(林庇)", note: "호남 지역 대표 사족.", population: 236000 },
      { name: "평택 임씨", hanja: "平澤", founder: "임팔급(林八及)", note: "임씨 도시조로 전해지는 인물.", population: 210000 },
      { name: "예천 임씨", hanja: "醴泉", founder: "임충세(林忠世)", note: "경북 예천이 본관.", population: 60000 },
    ],
    figures: ["임경업(장군)", "임백호 임제(문인)"],
  },
  {
    id: "han",
    ko: "한",
    hanja: "韓",
    reading: "Han",
    chosung: "ㅎ",
    population: 773404,
    rank: 11,
    origin:
      "고조선 준왕(準王)의 후예를 자처하는 기록이 전하며, 실질적으로는 고려 개국공신 한란(韓蘭)을 시조로 하는 청주 한씨가 대부분이다. 조선 초 왕비와 외척을 다수 배출했다.",
    clans: [
      { name: "청주 한씨", hanja: "淸州", founder: "한란(韓蘭)", note: "한씨의 절대다수. 한명회·인수대비를 배출.", population: 750000 },
      { name: "곡산 한씨", hanja: "谷山", founder: "한예(韓禮)", note: "황해도 곡산이 본관.", population: 12000 },
    ],
    figures: ["한명회(조선 전기 권신)", "한용운(만해)", "한석봉(명필)"],
  },
  {
    id: "oh",
    ko: "오",
    hanja: "吳",
    reading: "Oh",
    chosung: "ㅇ",
    population: 763281,
    rank: 12,
    origin:
      "중국에서 신라로 건너온 오첨(吳瞻)을 도시조로 삼는다는 기록이 전하며, 해주 오씨·동복 오씨·보성 오씨 등으로 분파되었다. 고려·조선을 거치며 무관과 문관을 고르게 배출했다.",
    clans: [
      { name: "해주 오씨", hanja: "海州", founder: "오인유(吳仁裕)", note: "오씨 최대 본관.", population: 262000 },
      { name: "동복 오씨", hanja: "同福", founder: "오녕(吳寧)", note: "전남 화순 동복이 본관.", population: 55000 },
      { name: "보성 오씨", hanja: "寶城", founder: "오현필(吳賢弼)", note: "호남 지역 세거.", population: 90000 },
      { name: "함양 오씨", hanja: "咸陽", founder: "오광휘(吳光輝)", note: "경남 함양이 본관.", population: 80000 },
    ],
    figures: ["오달제(삼학사)", "오세창(독립운동가·서예가)"],
  },
  {
    id: "seo",
    ko: "서",
    hanja: "徐",
    reading: "Seo",
    chosung: "ㅅ",
    population: 751704,
    rank: 13,
    origin:
      "신라 아진의선(阿珍義先)의 후손 또는 백제 유민 계통 등 여러 설이 전한다. 이천 서씨를 도시조 계통으로 보며, 달성 서씨·대구 서씨는 조선 후기 경화사족으로 크게 성장했다.",
    clans: [
      { name: "달성 서씨", hanja: "達城", founder: "서진(徐晉)", note: "대구 지역 명문.", population: 200000 },
      { name: "이천 서씨", hanja: "利川", founder: "서신일(徐神逸)", note: "서씨의 도시조 계통으로 본다.", population: 180000 },
      { name: "대구 서씨", hanja: "大丘", founder: "서한(徐閈)", note: "조선 후기 정승·판서를 다수 배출.", population: 105000 },
      { name: "부여 서씨", hanja: "扶餘", founder: "서융(徐隆)", note: "백제 왕족 부여씨의 후예를 표방.", population: 20000 },
    ],
    figures: ["서희(강동 6주 담판)", "서재필(독립신문)", "서유구(『임원경제지』)"],
  },
  {
    id: "shin",
    ko: "신",
    hanja: "申",
    reading: "Shin",
    chosung: "ㅅ",
    population: 741081,
    rank: 14,
    origin:
      "고구려 계통 신숭겸(申崇謙)을 중심으로 하는 평산 신씨와, 고려 문신 신성용의 고령 신씨가 대표적이다. 두 계통 모두 시조를 신라 경명왕의 후손으로 소급하는 기록이 있다.",
    clans: [
      { name: "평산 신씨", hanja: "平山", founder: "신숭겸(申崇謙)", note: "고려 개국공신. 신씨 최대 본관.", population: 496000 },
      { name: "고령 신씨", hanja: "高靈", founder: "신성용(申成用)", note: "신숙주를 배출.", population: 128000 },
      { name: "아주 신씨", hanja: "鵝洲", founder: "신익휴(申益休)", note: "경남 거제 아주가 본관.", population: 30000 },
    ],
    figures: ["신숭겸(고려 개국공신)", "신숙주(훈민정음 창제 참여)", "신사임당", "신윤복(혜원)"],
  },
  {
    id: "kwon",
    ko: "권",
    hanja: "權",
    reading: "Kwon",
    chosung: "ㄱ",
    population: 705941,
    rank: 15,
    origin:
      "본래 신라 김씨였던 김행(金幸)이 고려 태조를 도운 공으로 '권(權)'이라는 성을 하사받은 데서 시작한다. 사실상 안동 권씨 단일 본관이며, 현존 최고(最古) 족보로 꼽히는 『성화보(成化譜, 1476)』를 남겼다.",
    clans: [
      { name: "안동 권씨", hanja: "安東", founder: "권행(權幸)", note: "권씨의 99%. 1476년 『성화보』로 유명.", population: 696000 },
      { name: "예천 권씨", hanja: "醴泉", founder: "권섬(權暹)", note: "본래 흔(昕)씨였다가 권씨로 바꾼 계통.", population: 5000 },
    ],
    figures: ["권근(양촌)", "권율(행주대첩)"],
  },
  {
    id: "hwang",
    ko: "황",
    hanja: "黃",
    reading: "Hwang",
    chosung: "ㅎ",
    population: 697171,
    rank: 16,
    origin:
      "중국에서 건너온 황락(黃洛)을 도시조로 하며, 그 아들 3형제가 각각 창원·장수·평해 황씨의 시조가 되었다는 이야기가 전한다.",
    clans: [
      { name: "창원 황씨", hanja: "昌原", founder: "황충준(黃忠俊)", note: "황씨 최대 본관.", population: 264000 },
      { name: "장수 황씨", hanja: "長水", founder: "황경(黃瓊)", note: "명재상 황희의 가문.", population: 148000 },
      { name: "평해 황씨", hanja: "平海", founder: "황온인(黃溫仁)", note: "경북 울진 평해가 본관.", population: 152000 },
    ],
    figures: ["황희(조선 명재상)", "황진이(시인)", "황현(매천)"],
  },
  {
    id: "ahn",
    ko: "안",
    hanja: "安",
    reading: "Ahn",
    chosung: "ㅇ",
    population: 685639,
    rank: 17,
    origin:
      "당나라에서 신라로 온 이원(李瑗)의 세 아들이 왜구를 물리친 공으로 '안(安)'씨를 하사받았다는 설화가 전한다. 순흥 안씨가 대표 본관으로, 한국 성리학의 문을 연 안향(安珦)을 배출했다.",
    clans: [
      { name: "순흥 안씨", hanja: "順興", founder: "안자미(安子美)", note: "회헌 안향의 가문. 안씨 최대 본관.", population: 468000 },
      { name: "죽산 안씨", hanja: "竹山", founder: "안원형(安元衡)", note: "경기 안성 죽산이 본관.", population: 82000 },
      { name: "광주 안씨", hanja: "廣州", founder: "안방걸(安邦傑)", note: "경기 광주가 본관.", population: 45000 },
    ],
    figures: ["안향(성리학 도입)", "안중근(의사)", "안창호(도산)"],
  },
  {
    id: "song",
    ko: "송",
    hanja: "宋",
    reading: "Song",
    chosung: "ㅅ",
    population: 683494,
    rank: 18,
    origin:
      "중국 송나라 계통에서 귀화했다는 기록과 토착 호족 계통이 함께 전한다. 여산 송씨와 은진 송씨가 양대 갈래이며, 은진 송씨는 조선 후기 기호학파의 중심이 되었다.",
    clans: [
      { name: "여산 송씨", hanja: "礪山", founder: "송유익(宋惟翊)", note: "송씨 최대 본관. 전북 익산 여산이 본거지.", population: 274000 },
      { name: "은진 송씨", hanja: "恩津", founder: "송대원(宋大原)", note: "우암 송시열의 가문.", population: 200000 },
      { name: "진천 송씨", hanja: "鎭川", founder: "송순공(宋舜恭)", note: "충북 진천이 본관.", population: 40000 },
    ],
    figures: ["송시열(우암)", "송준길(동춘당)"],
  },
  {
    id: "ryu",
    ko: "유(류)",
    hanja: "柳",
    reading: "Ryu / Yu",
    chosung: "ㅇ",
    population: 642996,
    rank: 19,
    origin:
      "'버들 류(柳)'를 쓴다. 문화 류씨가 최대 본관으로, 시조 류차달(柳車達)은 고려 태조의 군량 수송을 도운 공으로 공신이 되었다. 현행 한글 표기는 '유'와 '류'가 함께 쓰인다.",
    clans: [
      { name: "문화 류씨", hanja: "文化", founder: "류차달(柳車達)", note: "1562년 『가정보』로 족보사에서 중요한 가문.", population: 300000 },
      { name: "전주 류씨", hanja: "全州", founder: "류습(柳濕)", note: "조선 문신 다수 배출.", population: 82000 },
      { name: "진주 류씨", hanja: "晉州", founder: "류정(柳挺)", note: "경남 진주가 본관.", population: 72000 },
      { name: "풍산 류씨", hanja: "豊山", founder: "류절(柳節)", note: "서애 류성룡의 가문. 안동 하회마을.", population: 40000 },
    ],
    figures: ["류성룡(서애, 『징비록』)", "류관순(※한자 다름)"],
  },
  {
    id: "hong",
    ko: "홍",
    hanja: "洪",
    reading: "Hong",
    chosung: "ㅎ",
    population: 558853,
    rank: 20,
    origin:
      "당나라 사신으로 고구려에 온 홍천하(洪天河)를 도시조로 삼는 기록이 전한다. 남양 홍씨가 대표 본관이며, 시조를 달리하는 당홍(唐洪)과 토홍(土洪) 두 계통으로 나뉜다.",
    clans: [
      { name: "남양 홍씨 (당홍)", hanja: "南陽", founder: "홍은열(洪殷悅)", note: "홍씨의 대다수를 차지.", population: 379000 },
      { name: "남양 홍씨 (토홍)", hanja: "南陽", founder: "홍선행(洪先幸)", note: "당홍과 시조가 다른 별개 계통.", population: 45000 },
      { name: "풍산 홍씨", hanja: "豊山", founder: "홍지경(洪之慶)", note: "혜경궁 홍씨의 가문.", population: 42000 },
    ],
    figures: ["홍경래(농민항쟁 지도자)", "홍대용(담헌)", "혜경궁 홍씨(『한중록』)"],
  },
  {
    id: "jeon",
    ko: "전",
    hanja: "全",
    reading: "Jeon",
    chosung: "ㅈ",
    population: 559554,
    rank: 21,
    origin:
      "백제 개국공신 전섭(全聶)을 도시조로 삼는다. 정선 전씨를 큰 줄기로 하여 천안·옥천·용궁 전씨 등으로 갈라졌다.",
    clans: [
      { name: "정선 전씨", hanja: "旌善", founder: "전선(全愃)", note: "전씨의 대종.", population: 160000 },
      { name: "천안 전씨", hanja: "天安", founder: "전락(全樂)", note: "고려 개국공신 계통.", population: 130000 },
      { name: "옥천 전씨", hanja: "沃川", founder: "전학준(全學浚)", note: "충북 옥천이 본관.", population: 90000 },
    ],
    figures: ["전봉준(동학농민운동 지도자)"],
  },
  {
    id: "ko",
    ko: "고",
    hanja: "高",
    reading: "Ko / Go",
    chosung: "ㄱ",
    population: 471429,
    rank: 22,
    origin:
      "제주도 개벽 신화의 삼을나(三乙那) 중 고을나(高乙那)를 시조로 하는 제주 고씨가 중심이다. 탐라국 왕족의 후예로, 고구려 왕성 고씨와는 계통이 다르다.",
    clans: [
      { name: "제주 고씨", hanja: "濟州", founder: "고을나(高乙那)", note: "탐라 개국 신화의 주인공. 고씨의 대다수.", population: 340000 },
      { name: "장흥 고씨", hanja: "長興", founder: "고중연(高仲筵)", note: "의병장 고경명의 가문.", population: 50000 },
      { name: "개성 고씨", hanja: "開城", founder: "고종필(高宗弼)", note: "제주 고씨에서 분파.", population: 20000 },
    ],
    figures: ["고경명(임진왜란 의병장)", "고종후(의병)"],
  },
  {
    id: "moon",
    ko: "문",
    hanja: "文",
    reading: "Moon / Mun",
    chosung: "ㅁ",
    population: 464047,
    rank: 23,
    origin:
      "남평 문씨 단일 본관이 사실상 전부다. 시조 문다성(文多省)은 전남 나주 남평의 연못가 바위 위 석함에서 나왔다는 탄생 설화를 갖고 있다. 목화씨를 들여온 문익점이 이 가문이다.",
    clans: [
      { name: "남평 문씨", hanja: "南平", founder: "문다성(文多省)", note: "문씨 인구의 대부분.", population: 380000 },
      { name: "감천 문씨", hanja: "甘泉", founder: "문원길(文原吉)", note: "경북 예천 감천이 본관.", population: 15000 },
    ],
    figures: ["문익점(목화 전래)", "문무자 이옥과 교유한 문인들"],
  },
  {
    id: "son",
    ko: "손",
    hanja: "孫",
    reading: "Son",
    chosung: "ㅅ",
    population: 457617,
    rank: 24,
    origin:
      "신라 6부촌장 중 무산 대수촌장 구례마(俱禮馬)의 후손으로, 유리왕 때 '손(孫)'씨를 하사받았다고 전한다. 밀양 손씨와 경주 손씨가 양대 본관이다.",
    clans: [
      { name: "밀양 손씨", hanja: "密陽", founder: "손순(孫順)", note: "『삼국유사』 효자 설화의 손순이 시조.", population: 130000 },
      { name: "경주 손씨", hanja: "慶州", founder: "손순(孫順)", note: "회재 이언적의 외가로 유명한 양동마을.", population: 100000 },
      { name: "일직 손씨", hanja: "一直", founder: "손응(孫凝)", note: "본래 순(荀)씨였다가 개성.", population: 60000 },
    ],
    figures: ["손병희(3·1운동 민족대표)", "손기정(마라토너)"],
  },
  {
    id: "bae",
    ko: "배",
    hanja: "裵",
    reading: "Bae",
    chosung: "ㅂ",
    population: 400354,
    rank: 25,
    origin:
      "신라 6부촌장 중 금산 가리촌장 지타(祗沱)를 시조로 한다. 경주 배씨를 뿌리로 하여 성주·달성·흥해 배씨 등으로 분파되었다.",
    clans: [
      { name: "성주 배씨", hanja: "星州", founder: "배위준(裵位俊)", note: "배씨 최대 본관.", population: 130000 },
      { name: "달성 배씨", hanja: "達城", founder: "배운룡(裵雲龍)", note: "대구 달성이 본관.", population: 90000 },
      { name: "경주 배씨", hanja: "慶州", founder: "배현경(裵玄慶)", note: "고려 개국공신.", population: 80000 },
    ],
    figures: ["배현경(고려 개국공신)", "배중손(삼별초 지도자)"],
  },
  {
    id: "jo-cao",
    ko: "조",
    hanja: "曺",
    reading: "Cho / Jo",
    chosung: "ㅈ",
    population: 398121,
    rank: 26,
    origin:
      "창녕 조씨 단일 본관이 사실상 전부다. 시조 조계룡(曺繼龍)은 신라 진평왕의 사위로 전하며, 어머니가 화왕산 용지(龍池)의 용신과 인연을 맺어 태어났다는 설화가 있다. 趙씨와는 완전히 다른 성씨다.",
    clans: [
      { name: "창녕 조씨", hanja: "昌寧", founder: "조계룡(曺繼龍)", note: "曺씨의 거의 전부. 남명 조식을 배출.", population: 390000 },
    ],
    figures: ["조식(남명)", "조준(조선 개국공신 ※趙)"],
  },
  {
    id: "baek",
    ko: "백",
    hanja: "白",
    reading: "Baek",
    chosung: "ㅂ",
    population: 381236,
    rank: 27,
    origin:
      "당나라에서 신라로 건너온 백우경(白宇經)을 도시조로 삼는다. 수원 백씨가 사실상 단일 본관으로, 모든 백씨가 하나의 대동보를 함께 쓴다.",
    clans: [
      { name: "수원 백씨", hanja: "水原", founder: "백창직(白昌稷)", note: "백씨 인구의 대부분.", population: 350000 },
    ],
    figures: ["백낙신 시대의 문인들", "백석(시인)", "백남준(예술가)"],
  },
  {
    id: "yang",
    ko: "양",
    hanja: "梁",
    reading: "Yang",
    chosung: "ㅇ",
    population: 389124,
    rank: 28,
    origin:
      "제주 개벽 신화 삼을나 중 양을나(良乙那)의 후손으로, 신라 때 '良'에서 '梁'으로 바뀌었다고 전한다. 제주 양씨와 남원 양씨가 양대 갈래다.",
    clans: [
      { name: "제주 양씨", hanja: "濟州", founder: "양을나(良乙那)", note: "탐라 개국 신화 계통.", population: 200000 },
      { name: "남원 양씨", hanja: "南原", founder: "양우량(梁友諒)", note: "제주 양씨에서 분파.", population: 180000 },
    ],
    figures: ["양성지(조선 전기 학자)", "양기탁(독립운동가)"],
  },
  {
    id: "heo",
    ko: "허",
    hanja: "許",
    reading: "Heo / Hur",
    chosung: "ㅎ",
    population: 326770,
    rank: 29,
    origin:
      "가락국 김수로왕의 왕비 허황옥(許黃玉)에서 비롯한다. 열 명의 아들 중 둘이 어머니의 성을 이어 허씨가 되었다고 전한다. 그래서 김해 김씨와 김해 허씨는 예로부터 혼인을 피해왔다.",
    clans: [
      { name: "양천 허씨", hanja: "陽川", founder: "허선문(許宣文)", note: "허준·허난설헌의 가문.", population: 130000 },
      { name: "김해 허씨", hanja: "金海", founder: "허염(許琰)", note: "허황옥 직계 계통.", population: 120000 },
      { name: "하양 허씨", hanja: "河陽", founder: "허강안(許康安)", note: "경북 경산 하양이 본관.", population: 50000 },
    ],
    figures: ["허준(『동의보감』)", "허난설헌(시인)", "허균(『홍길동전』)"],
  },
  {
    id: "nam",
    ko: "남",
    hanja: "南",
    reading: "Nam",
    chosung: "ㄴ",
    population: 275096,
    rank: 30,
    origin:
      "당나라 사신 김충(金忠)이 신라에 표류해 정착하자 경덕왕이 '남(南)'씨를 내렸다는 이야기가 전한다. 의령·영양·고성 남씨 세 본관이 모두 같은 뿌리에서 갈라졌다.",
    clans: [
      { name: "의령 남씨", hanja: "宜寧", founder: "남군보(南君甫)", note: "남씨 최대 본관.", population: 160000 },
      { name: "영양 남씨", hanja: "英陽", founder: "남홍보(南洪甫)", note: "경북 영양이 본관.", population: 70000 },
      { name: "고성 남씨", hanja: "固城", founder: "남광보(南匡甫)", note: "경남 고성이 본관.", population: 30000 },
    ],
    figures: ["남이(장군)", "남구만(약천)"],
  },
  {
    id: "sim",
    ko: "심",
    hanja: "沈",
    reading: "Shim / Sim",
    chosung: "ㅅ",
    population: 271708,
    rank: 31,
    origin:
      "청송 심씨가 압도적 다수를 차지한다. 시조 심홍부(沈洪孚)는 고려 때 문림랑을 지냈으며, 조선시대 왕비 세 명을 배출한 외척 명문이 되었다.",
    clans: [
      { name: "청송 심씨", hanja: "靑松", founder: "심홍부(沈洪孚)", note: "심씨의 대부분. 조선 왕비 3명 배출.", population: 240000 },
      { name: "삼척 심씨", hanja: "三陟", founder: "심동로(沈東老)", note: "강원 삼척이 본관.", population: 20000 },
    ],
    figures: ["심온(세종의 장인)", "심사정(현재, 화가)"],
  },
  {
    id: "noh",
    ko: "노",
    hanja: "盧",
    reading: "Noh / Roh",
    chosung: "ㄴ",
    population: 256096,
    rank: 32,
    origin:
      "당나라에서 신라로 건너온 노수(盧穗)의 아홉 아들이 각지에 정착해 광주·교하·풍천·장연 등 여러 본관의 시조가 되었다고 전한다.",
    clans: [
      { name: "광주 노씨", hanja: "光州", founder: "노만(盧穗의 아들)", note: "전남 광주가 본관.", population: 70000 },
      { name: "교하 노씨", hanja: "交河", founder: "노강필(盧康弼)", note: "경기 파주 교하가 본관.", population: 60000 },
      { name: "풍천 노씨", hanja: "豊川", founder: "노유(盧裕)", note: "황해도 풍천이 본관.", population: 40000 },
    ],
    figures: ["노수신(소재, 영의정)"],
  },
  {
    id: "ha",
    ko: "하",
    hanja: "河",
    reading: "Ha",
    chosung: "ㅎ",
    population: 230481,
    rank: 33,
    origin:
      "진주 하씨 단일 본관이 사실상 전부이며, 시조를 달리하는 시랑공파·사직공파·단계공파 세 계통이 함께 쓰인다. 세종대 명재상 하륜·하연을 배출했다.",
    clans: [
      { name: "진주 하씨", hanja: "晉州", founder: "하공진(河拱辰) 외", note: "하씨의 거의 전부. 세 계통으로 나뉜다.", population: 220000 },
    ],
    figures: ["하륜(조선 개국 설계)", "하연(영의정)"],
  },
  {
    id: "kwak",
    ko: "곽",
    hanja: "郭",
    reading: "Kwak",
    chosung: "ㄱ",
    population: 203365,
    rank: 34,
    origin:
      "중국 당나라 곽자의(郭子儀)의 후손을 표방하는 기록이 전한다. 현풍 곽씨가 최대 본관으로, 임진왜란 의병장 곽재우를 배출했다.",
    clans: [
      { name: "현풍 곽씨", hanja: "玄風", founder: "곽경(郭鏡)", note: "곽씨 최대 본관. 대구 달성 현풍.", population: 130000 },
      { name: "청주 곽씨", hanja: "淸州", founder: "곽상(郭祥)", note: "충북 청주가 본관.", population: 40000 },
    ],
    figures: ["곽재우(홍의장군)", "곽종석(유학자)"],
  },
  {
    id: "woo",
    ko: "우",
    hanja: "禹",
    reading: "Woo / Wu",
    chosung: "ㅇ",
    population: 194999,
    rank: 35,
    origin:
      "단양 우씨 단일 본관이다. 시조 우현(禹玄)은 고려 초 정조호장을 지냈으며, 고려말 성리학자 역동 우탁(禹倬)이 대표 인물이다.",
    clans: [{ name: "단양 우씨", hanja: "丹陽", founder: "우현(禹玄)", note: "우씨의 거의 전부.", population: 190000 }],
    figures: ["우탁(역동, 「탄로가」)", "우장춘(육종학자)"],
  },
  {
    id: "joo",
    ko: "주",
    hanja: "朱",
    reading: "Joo / Ju",
    chosung: "ㅈ",
    population: 194220,
    rank: 36,
    origin:
      "송나라 성리학자 주희(朱熹)의 후손 주잠(朱潛)이 고려로 망명해 정착했다는 기록이 전한다. 신안 주씨가 대표 본관이다.",
    clans: [
      { name: "신안 주씨", hanja: "新安", founder: "주잠(朱潛)", note: "주자(朱熹)의 후손을 표방.", population: 130000 },
      { name: "능성 주씨", hanja: "綾城", founder: "주여경(朱餘慶)", note: "전남 화순 능주가 본관.", population: 30000 },
    ],
    figures: ["주시경(한글학자)", "주세붕(백운동서원 창건)"],
  },
  {
    id: "koo",
    ko: "구",
    hanja: "具",
    reading: "Koo / Gu",
    chosung: "ㄱ",
    population: 195000,
    rank: 37,
    origin:
      "능성 구씨가 대표 본관으로, 시조 구존유(具存裕)는 고려 고종 때 벽상삼한삼중대광 검교상장군을 지냈다. 조선 인조의 어머니 인헌왕후가 이 가문이다.",
    clans: [
      { name: "능성 구씨", hanja: "綾城", founder: "구존유(具存裕)", note: "구씨 최대 본관.", population: 130000 },
      { name: "창원 구씨", hanja: "昌原", founder: "구설(具設)", note: "경남 창원이 본관.", population: 20000 },
    ],
    figures: ["구인회(기업인)", "구선복(무신)"],
  },
  {
    id: "shin-sin",
    ko: "신",
    hanja: "辛",
    reading: "Shin",
    chosung: "ㅅ",
    population: 192656,
    rank: 38,
    origin:
      "'매울 신(辛)'을 쓰며 申씨와는 다른 성씨다. 중국에서 고려로 귀화한 신경(辛鏡)을 시조로 하는 영산 신씨·영월 신씨가 같은 뿌리에서 갈라졌다.",
    clans: [
      { name: "영산 신씨", hanja: "靈山", founder: "신경(辛鏡)", note: "경남 창녕 영산이 본관.", population: 110000 },
      { name: "영월 신씨", hanja: "寧越", founder: "신시식(辛時軾)", note: "영산 신씨와 동원(同源).", population: 70000 },
    ],
    figures: ["신돈(고려말 승려 정치가)", "신채호(단재 ※申)"],
  },
  {
    id: "cha",
    ko: "차",
    hanja: "車",
    reading: "Cha",
    chosung: "ㅊ",
    population: 194782,
    rank: 39,
    origin:
      "연안 차씨 단일 본관이다. 문화 류씨와 같은 뿌리(류차달)에서 갈라졌다고 전해져, 두 가문은 '차류대종(車柳大宗)'이라 하여 오랫동안 통혼을 피했다.",
    clans: [{ name: "연안 차씨", hanja: "延安", founder: "차효전(車孝全)", note: "문화 류씨와 동원이라는 기록이 전한다.", population: 190000 }],
    figures: ["차천로(문장가)", "차미리사(교육자)"],
  },
  {
    id: "min",
    ko: "민",
    hanja: "閔",
    reading: "Min",
    chosung: "ㅁ",
    population: 159054,
    rank: 40,
    origin:
      "여흥 민씨 단일 본관이다. 시조 민칭도(閔稱道)는 고려 때 사신으로 왔다가 정착한 인물로 전한다. 조선 태종비 원경왕후, 숙종비 인현왕후, 고종비 명성황후를 배출한 최고의 외척 가문이다.",
    clans: [{ name: "여흥 민씨", hanja: "驪興", founder: "민칭도(閔稱道)", note: "조선 왕비 3명 배출. 경기 여주가 본관.", population: 155000 }],
    figures: ["민영환(을사조약 순국)", "명성황후", "민긍호(의병장)"],
  },
];

export const CHOSUNG_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

export function getSurname(id: string) {
  return SURNAMES.find((s) => s.id === id);
}

export function searchSurnames(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return SURNAMES;
  return SURNAMES.filter((s) => {
    const haystack = [
      s.ko,
      s.hanja,
      s.reading.toLowerCase(),
      s.origin,
      ...s.clans.map((c) => `${c.name} ${c.hanja ?? ""} ${c.founder}`),
      ...(s.figures ?? []),
    ].join(" ");
    return haystack.toLowerCase().includes(query);
  });
}
