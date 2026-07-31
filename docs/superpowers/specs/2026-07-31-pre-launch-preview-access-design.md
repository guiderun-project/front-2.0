# 오픈 준비 중 게이트 프리뷰 통과 설계

작성일: 2026-07-31

## 배경

운영 도메인은 현재 `VITE_PRE_LAUNCH_GATE_ENABLED === "true"` 이면서 PostHog 플래그
`pre-launch-mode` 가 켜져 있을 때 모든 경로에 `ComingSoonPage` 를 렌더한다
(`src/App.tsx` 의 `useServiceLiveGate`). 테스터가 운영 도메인에서 실제 앱을
검증해야 하는데 통과 수단이 없다.

PostHog 코호트나 person property 로 테스터만 분기하는 방법은 쓸 수 없다. 로그인
페이지 자체가 게이트 뒤에 있어 `identifyUser` 가 호출되기 전이고, 테스터는 게이트를
통과하기 전까지 익명 상태다. 즉 서버 측 플래그 평가로는 테스터를 식별할 수 없다.

## 목표

- 테스터가 운영 도메인(`guiderun.org`)에서 링크 한 번으로 게이트를 통과한다.
- 통과 후에는 링크 없이 재방문해도 유지된다.
- 통과 판정에 화면 깜빡임이 없다.
- 일반 방문자에게는 게이트 동작이 그대로 유지된다.

## 비목표

- 인증 수준의 접근 통제. `?preview=true` 는 추측 가능한 값이며 이 게이트의 목적은
  "아직 오픈하지 않았다"는 커튼이다. 실제 데이터는 API 인증이 보호한다.
- 테스터 명단 관리. 통과 여부만 필요하고 대상 관리는 필요하지 않다.
- Netlify 엣지 차단. 앱 번들 자체를 내려주지 않는 방식은 coming-soon 화면을 HTML로
  중복 유지해야 하고, 곧 걷어낼 게이트에 비해 과투자다.
- 플래그 캐시가 없는 최초 방문에서 로더 → 오픈 준비 중으로 전환되는 어색함. 기존
  동작이며 별건으로 다룬다.

## 판정식

```
서비스 라이브 = 게이트 env 꺼짐 || 프리뷰 통과 || 플래그 꺼짐
```

프리뷰 통과 검사를 플래그 검사보다 앞에 둔다. `localStorage` 읽기는 동기이므로 첫
렌더에서 판정이 끝나고, 플래그 네트워크 왕복을 기다리지 않는다.

## 동작

| 진입 | 결과 |
| --- | --- |
| `?preview=true` | 표식 저장 후 통과 |
| `?preview=false` | 표식 제거 후 게이트 복귀 |
| 파라미터 없음 | 저장된 표식만 확인 |
| 그 외 값 | 무시 (저장된 표식만 확인) |

`?preview=false` 는 테스터가 실제 오픈 준비 중 화면을 확인하기 위한 해제 수단이다.

파라미터 처리는 게이트 env 여부와 무관하게 동작한다. 게이트가 꺼진 배포에서도 표식은
그대로 저장·제거되며, 어느 쪽이든 서비스는 라이브이므로 화면에는 영향이 없다.

## 저장

- `localStorage`, 키 `guiderun.preLaunchPreview`, 값 `"true"`.
- 기존 `guiderun.firstVisitSeen` 의 네이밍과 try/catch 접근 패턴을 따른다.
- 저장 단위는 브라우저(오리진)다. 다른 기기·브라우저·시크릿 모드는 각각 링크가
  다시 필요하다. 사이트 데이터를 지우면 표식도 사라진다.
- `sessionStorage` 를 쓰지 않는 이유: 테스터가 북마크나 홈 화면 아이콘으로 재방문할
  때 링크 없이 유지되어야 한다.
- 스토리지 접근이 예외를 던지는 환경(사파리 프라이빗 모드 등)에서는 "통과 아님"으로
  처리한다.

## 구현 위치

`src/App.tsx` 의 `useServiceLiveGate` 와 같은 파일 하단 헬퍼.

- 같은 파일에 `hasSeenFirstVisit` / `recordFirstVisitSeen` 가 동일한 localStorage +
  try/catch 패턴으로 이미 있다. 그 옆에 나란히 둔다.
- 새 파일, 새 폴더, 새 환경변수를 추가하지 않는다. `.env.example` 도 그대로 둔다.
- 쿼리 파라미터는 `useSearchParams` 대신 `window.location.search` 를 동기로 읽는다.
  첫 프레임에 판정이 끝나야 하고 라우터 컨텍스트 타이밍에 묶이지 않아야 한다.
- URL 정리는 하지 않는다. `history.replaceState` 로 파라미터를 지우면 react-router
  내부 location 과 어긋난다. 비밀값이 아니라 남아 있어도 무해하고 첫 라우트 이동에서
  자연히 사라진다.

## 계측

표식이 저장된 상태의 세션은 `registerSuperProperties({ isPreLaunchPreview: true })` 로
마킹한다 (`src/api/core/analytics.ts`). 오픈 전 테스터 트래픽을 PostHog 에서 걸러낼
수 있고, super property 원장에 남으므로 로그아웃(`posthog.reset()`) 이후에도 유지된다.

## 검증

- `pnpm lint`
- `pnpm build`
- 로컬 `.env` 에 `VITE_PRE_LAUNCH_GATE_ENABLED=true` 를 두고 PostHog 플래그가 켜진
  상태에서 수동 확인:
  1. 파라미터 없이 진입 → 오픈 준비 중 화면
  2. `?preview=true` 진입 → 앱 진입, 깜빡임 없음
  3. 파라미터 없이 재방문 → 앱 유지
  4. `?preview=false` 진입 → 오픈 준비 중 화면으로 복귀
  5. `VITE_PRE_LAUNCH_GATE_ENABLED` 미설정 → 파라미터와 무관하게 앱 진입
