# Cloudflare 앞단 붙이기 — 작업 순서

Vercel은 그대로 두고 **앞에 Cloudflare를 한 겹 덧대는** 작업입니다.
코드는 한 줄도 안 바뀝니다. 바뀌는 건 "도메인이 어디를 가리키는가" 하나뿐입니다.

```
지금:   방문자 ─────────────────→ Vercel   (요청 12건 전부)

작업 후: 방문자 → Cloudflare → Vercel
                    │            └ HTML 1건만
                    └ JS·CSS 10건은 여기서 끝
```

**목표: 페이지당 Vercel 요청 12건 → 1~2건**

---

## 시작 전 확인

- [ ] Vercel Pro 결제 완료 (작업 중 정지 위험 없음)
- [ ] 가비아 로그인 가능
- [ ] 지금 Vercel DNS 레코드 값을 캡처해 둠 ← **되돌릴 때 필요**

현재 값 (2026-08 기준, 실제 화면에서 다시 확인할 것):

| 종류 | 이름 | 값 |
| --- | --- | --- |
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `c6ff7a7dd0c4d5ec.vercel-dns-017.com` |

---

## 1단계 — Cloudflare 계정 만들고 도메인 추가 (5분)

1. [dash.cloudflare.com](https://dash.cloudflare.com) 가입 (무료)
2. **Add a site** → `rootfinder.kr` 입력
3. 요금제는 **Free** 선택
4. Cloudflare가 기존 DNS 레코드를 자동으로 가져옵니다

> **여기서 멈추고 확인.** 가져온 목록에 위 A 레코드와 www CNAME이 있어야 합니다.
> 없으면 직접 추가하세요. 이게 빠지면 사이트가 안 열립니다.

5. 화면에 **네임서버 2개**가 나옵니다 (예: `xxx.ns.cloudflare.com`). 복사해 두세요.

---

## 2단계 — SSL 설정 먼저 (2분) ⚠️

**네임서버를 바꾸기 전에 반드시 이걸 먼저 하세요.**

Cloudflare → **SSL/TLS** → **Overview** → 암호화 모드를 **Full (strict)** 로

> `Flexible`로 두면 **무한 리다이렉트가 걸려 사이트가 안 열립니다.**
> 이 작업에서 가장 흔한 사고입니다.

---

## 3단계 — 캐시 규칙 (3분)

이 작업의 **핵심**입니다. 이걸 안 하면 Cloudflare를 붙여도 요청이 안 줄어요.

Cloudflare → **Caching** → **Cache Rules** → **Create rule**

| 항목 | 값 |
| --- | --- |
| 규칙 이름 | `next-static` |
| 조건 | URI Path **starts with** `/_next/static` |
| Cache eligibility | **Eligible for cache** |
| Edge TTL | **1년** (Override origin, 31536000초) |
| Browser TTL | **1년** |

`/_next/static` 안의 파일은 내용이 바뀌면 **파일 이름 자체가 바뀝니다.**
그래서 1년을 캐시해도 낡은 파일이 나갈 일이 없습니다.

---

## 4단계 — 네임서버 변경 (5분)

가비아 → **My가비아** → **도메인** → `rootfinder.kr` → **네임서버 설정**

1단계에서 복사한 Cloudflare 네임서버 2개로 교체 → 저장

**여기서부터 전파가 시작됩니다.** 보통 5~30분, 길면 몇 시간.

---

## 5단계 — 프록시 켜기 (1분)

전파가 끝나면 Cloudflare → **DNS** → **Records**

A 레코드와 www CNAME의 구름 아이콘을 **주황색(Proxied)** 으로.
회색이면 Cloudflare를 그냥 지나쳐서 아무 효과가 없습니다.

---

## 확인

### 사이트가 열리는가

```
https://rootfinder.kr
https://rootfinder.kr/joseon
https://rootfinder.kr/surnames/kim/김해
```

### Cloudflare를 거치는가

브라우저 개발자도구 → **Network** → 아무 요청이나 클릭 → **Response Headers** 에
`cf-cache-status` 가 보이면 통과한 겁니다.

- `HIT` — Cloudflare가 캐시에서 내보냄 ✅ (Vercel까지 안 감)
- `MISS` — 처음이라 Vercel에서 가져옴 (두 번째부터 HIT여야 정상)
- `DYNAMIC` — 캐시 안 함. `/_next/static` 파일이 이거면 **3단계 규칙이 잘못된 것**

### 며칠 뒤

Vercel → **Usage** → Edge Requests 그래프가 **눈에 띄게 꺾여야** 합니다.
안 꺾이면 3단계나 5단계가 안 먹은 겁니다.

---

## 문제가 생기면

| 증상 | 원인 | 조치 |
| --- | --- | --- |
| 무한 리다이렉트 | SSL이 Flexible | **Full (strict)** 로 변경 |
| 사이트 안 열림 | DNS 레코드 누락 | Cloudflare DNS에 A·CNAME 확인 |
| Vercel이 "Invalid Configuration" | 프록시 때문에 Vercel이 IP를 못 봄 | 사이트가 정상이면 무시 가능. Vercel이 요구하면 `_vercel` TXT 레코드 추가 |
| 낡은 화면이 나옴 | 캐시가 오래 남음 | Cloudflare → Caching → **Purge Everything** |

### 되돌리기 (5분)

가비아에서 네임서버를 **가비아 기본값**으로 되돌리면 끝입니다.
Vercel 쪽은 아무것도 안 건드렸으니 전파만 되면 원래대로 돌아옵니다.

---

## 다 되고 나면

며칠 지켜보고 Edge Requests가 확실히 줄었으면 **Vercel을 Hobby로 내려도 됩니다.**
그러면 월 비용이 다시 0원이 됩니다.

단, 내리기 전에 확인할 것:

- 페이지당 Vercel 요청이 2건 이하인가
- 월 예상 요청이 100만 건 아래인가
- Web Analytics를 안 쓰고 GA4만 쓰고 있는가 (Hobby는 월 5만 이벤트 제한)
