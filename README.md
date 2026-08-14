# 뿌리찾기 (rootfinder)

한국인의 성씨·본관·시조를 찾아보고, 나만의 가계도를 만들어 이미지로 저장할 수 있는 웹 서비스.
[rootsinfo.co.kr「뿌리를 찾아서」](https://www.rootsinfo.co.kr/info/home/)를 벤치마킹해 만든 학습용 프로젝트입니다.

## 기능

| 페이지 | 경로 | 설명 |
| --- | --- | --- |
| 홈 | `/` | 히어로 + 통합 검색 + 인기 성씨 |
| 성씨 찾기 | `/surnames` | 실시간 검색 + 초성 필터 (한글/한자/본관/시조/인물 검색) |
| 성씨 상세 | `/surnames/[id]` | 유래, 본관별 시조·인구 막대, 항렬자, 대표 인물 |
| 가계도 만들기 | `/family-tree` | SVG 가계도 편집 + PNG/SVG 다운로드, 브라우저 자동 저장 |
| 역사 연대표 | `/history` | 고조선~현대, 성씨 제도의 변천 타임라인 |
| 족보 이야기 | `/stories` | 족보 입문 6편 + 촌수 계산기 |

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** / **TypeScript**
- **Tailwind CSS v4** (CSS 변수 기반 테마, 다크모드 자동 대응)
- 외부 DB 없음 — 데이터는 `src/data/*.ts`에 정적으로 관리

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 검증
npm start        # 빌드 결과 실행
```

Node.js 20 이상이 필요합니다.

## 폴더 구조

```
src/
├─ app/
│  ├─ layout.tsx            # 공통 헤더·푸터, 폰트, 메타데이터
│  ├─ page.tsx              # 홈
│  ├─ globals.css           # 테마 변수 (라이트/다크)
│  ├─ surnames/
│  │  ├─ page.tsx           # 목록 (searchParams로 초기 검색어 수신)
│  │  └─ [id]/page.tsx      # 상세 (generateStaticParams로 사전 렌더)
│  ├─ family-tree/page.tsx
│  ├─ history/page.tsx
│  ├─ stories/page.tsx
│  ├─ sitemap.ts            # /sitemap.xml
│  └─ robots.ts             # /robots.txt
├─ components/
│  ├─ HomeSearch.tsx        # 홈 검색창 (client)
│  ├─ SurnameBrowser.tsx    # 검색 + 초성 필터 (client)
│  ├─ FamilyTree.tsx        # 가계도 편집기 (client)
│  └─ ChonsuCalculator.tsx  # 촌수 계산기 (client)
├─ data/
│  ├─ surnames.ts           # 성씨 40개 · 본관 114개
│  └─ timeline.ts           # 연대표 8개 시대 + 족보 아티클 6편
└─ lib/
   └─ tree.ts               # 가계도 레이아웃 알고리즘 (tidy tree)
```

## 배포 (Vercel)

```bash
git init && git add -A && git commit -m "init"
gh repo create rootfinder --public --source=. --push   # 또는 GitHub 웹에서 생성 후 push
```

1. [vercel.com/new](https://vercel.com/new) → GitHub 저장소 Import
2. 프레임워크가 **Next.js**로 자동 인식되면 그대로 **Deploy**
3. 배포 완료 후 Settings → Environment Variables에 아래 값을 추가하고 재배포하면
   `sitemap.xml` / `robots.txt`가 실제 도메인을 가리킵니다.

```
NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
```

이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

## 데이터 추가하기

`src/data/surnames.ts`의 `SURNAMES` 배열에 객체 하나를 추가하면 목록·상세·사이트맵에 자동 반영됩니다.

```ts
{
  id: "yang-yang",          // URL slug (고유해야 함)
  ko: "양", hanja: "楊", reading: "Yang", chosung: "ㅇ",
  population: 104000, rank: 52,
  origin: "…유래 본문…",
  clans: [{ name: "청주 양씨", hanja: "淸州", founder: "양기(楊起)", note: "…", population: 90000 }],
  hangryeol: "…",
  figures: ["…"],
}
```

## 라이선스 / 주의

성씨·본관 데이터는 통계청 「2015 인구주택총조사 성씨·본관 집계」와 공개된 문중 기록을 바탕으로 정리한
교육·참고용 요약본입니다. 문중별 공식 족보와 세부 내용이 다를 수 있으며 법적 효력이 없습니다.
상용 서비스로 확장할 경우 각 종친회·대종회의 확인을 거치시기 바랍니다.
