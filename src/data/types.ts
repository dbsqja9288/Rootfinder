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
  clans: Clan[]; // 해설이 붙은 주요 본관
  allClans?: string[]; // 전체 본관 이름 목록 (빌드 시 clans.ts와 병합되어 채워짐)
  hangryeol?: string; // 항렬자 예시 설명
  figures?: string[]; // 대표 역사 인물
};

/**
 * 데이터 출처: 통계청 「2015 인구주택총조사 - 성씨·본관 집계」 및 공개된 각 종친회/문중 기록.
 * 교육·참고용으로 정리한 요약본이며, 문중별 공식 족보와 세부 내용이 다를 수 있습니다.
 */
