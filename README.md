# 뿌리찾기 (rootfinder)

한국인의 성씨·본관·시조를 찾아보고, 나만의 가계도를 만들어 이미지로 저장할 수 있는 웹 서비스.
[rootsinfo.co.kr「뿌리를 찾아서」](https://www.rootsinfo.co.kr/info/home/)를 벤치마킹해 만든 학습용 프로젝트입니다.

## 기능

| 페이지 | 경로 | 설명 |
| --- | --- | --- |
| 홈 | `/` | 히어로 + 통합 검색 + 인기 성씨 |
| 성씨 찾기 | `/surnames` | 실시간 검색 + 초성 필터 (한글/한자/본관/시조/인물 검색) |
| 성씨 상세 | `/surnames/[id]` | 유래, 주요 본관 상세, **전체 본관 목록**, 항렬자, 대표 인물, (선택) AI 심층 해설 |
| 가계도 만들기 | `/family-tree` | SVG 가계도 편집 + PNG/SVG 다운로드, 브라우저 자동 저장 |
| 역사 연대표 | `/history` | 고조선~현대, 성씨 제도의 변천 타임라인 |
| 족보 이야기 | `/stories` | 족보 입문 6편 + 촌수 계산기 |

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** / **TypeScript**
- **Tailwind CSS v4** (CSS 변수 기반 테마, 다크모드 자동 대응)
- 외부 DB 없음 — 데이터는 `src/data/*.ts`에 정적으로 관리
- AI 해설은 **선택 기능** — API 키가 없으면 UI에 나타나지 않아 비용이 발생하지 않는다

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
│  ├─ types.ts              # Surname / Clan 타입
│  ├─ surnames-core.ts      # 인구 1~40위 성씨 (해설 상세)
│  ├─ surnames-more.ts      # 41위 이후 성씨
│  ├─ clans.ts              # 성씨별 본관 전체 목록 (548개)
│  ├─ surnames.ts           # 위 세 파일을 병합해 SURNAMES로 export
│  └─ timeline.ts           # 연대표 8개 시대 + 족보 아티클 6편
└─ lib/
   ├─ tree.ts               # 가계도 레이아웃 알고리즘 (tidy tree)
   ├─ search.ts             # 정확도 가중치 검색
   └─ ai.ts                 # AI 심층 해설 (키 없으면 비활성)
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
NEXT_PUBLIC_SITE_URL = https://rootfinder.kr
```

이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

## AI 심층 해설 켜기 (선택)

기본 상태에서는 **비활성이라 비용이 0원**이다. 정적 데이터만으로 부족할 때 아래 환경변수를 넣으면
성씨 상세 페이지에 "더 깊이 알아보기" 섹션이 나타난다.

```
ANTHROPIC_API_KEY = sk-ant-...      # 또는 OPENAI_API_KEY
AI_MODEL          = claude-haiku-4-5  # 선택. 기본값도 동일
```

- 로컬에서는 프로젝트 루트에 `.env.local` 파일을 만들어 넣는다.
- Vercel에서는 Settings → Environment Variables에 추가 후 Redeploy.
- 같은 질문은 24시간 캐시하고, IP당 분당 8회로 제한해 비용이 튀지 않게 막아 두었다 (`src/app/api/deep-dive/route.ts`).
- AI가 생성한 문단에는 "AI 생성 — 사실 확인 필요" 배지가 붙는다. 검증된 정적 데이터와 구분하기 위함이다.

## 스레드 자동 게시 (선택)

`.github/workflows/social.yml`이 하루 3회(08:00 / 12:30 / 19:00 KST) 실행되어
`scripts/social-post.mjs`가 만든 문안을 스레드에 올립니다. **GitHub Actions는 공개 저장소에서 무료**이고,
스레드 API도 무료입니다.

토큰이 없으면 초안만 출력하고 끝나므로, 설정 전에도 워크플로가 실패하지 않습니다.

### 설정

1. [Meta 개발자 콘솔](https://developers.facebook.com)에서 앱을 만들고 **Threads API**를 추가
2. 장기 액세스 토큰과 사용자 ID 발급
3. GitHub 저장소 → Settings → Secrets and variables → Actions 에서 등록

```
THREADS_USER_ID        (Secret)
THREADS_ACCESS_TOKEN   (Secret)
```

사이트 주소는 워크플로에 `https://rootfinder.kr`로 고정돼 있다.
예전에 만든 `SITE_URL` 저장소 변수는 더 이상 쓰이지 않는다.

Actions 탭에서 **Run workflow** 버튼으로 즉시 테스트할 수 있습니다.

### 왜 X는 자동이 아닌가

X API는 무료 등급의 게시 한도가 매우 낮고, **같은 링크를 기계적으로 반복 게시하면 스팸으로 판정되어
계정이 정지**됩니다. X는 함께 제공되는 `posting-kit.html`로 문안을 뽑아 직접 올리는 방식을 권장합니다.

## 데이터 추가하기

`src/data/surnames-core.ts`(또는 `surnames-more.ts`)의 배열에 객체 하나를 추가하면
목록·상세·사이트맵·검색에 자동 반영됩니다. 본관 이름만 늘리려면 `src/data/clans.ts`에 추가하면 됩니다.

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
