# 제품 분석 이벤트

가이드런의 PostHog 계측은 화면 클릭 수보다 사용자가 `가입 → 모임 탐색 → 신청 → 실제 참여 → 재참여`로 이어지는지를 확인하는 데 우선순위를 둔다.

## Person properties

로그인 사용자는 `userId`로 식별하며 다음 속성만 등록한다.

| 속성 | 값 | 용도 |
| --- | --- | --- |
| `type` | `VI`, `GUIDE` | 사용자 유형별 분석 |
| `role` | 회원 역할 | 승인 상태와 운영 역할별 분석 |
| `gender` | `MALE`, `FEMALE` | 인구통계 분석 |
| `recordDegree` | `A`~`E`, `P` | 러닝 그룹별 분석 |
| `ageBand` | `under_20`, `20s`, `30s`, `40s`, `50_plus` | 연령대별 분석 |

원본 생년월일, 이름, 전화번호, 자유 입력값은 PostHog person property로 보내지 않는다. `ageBand`는 클라이언트에서 생년월일을 변환한 값만 전송한다.

## 프론트엔드 이벤트

| 이벤트 | 발생 시점 | 주요 속성 |
| --- | --- | --- |
| `signup_started` | OAuth 응답이 신규 가입 대상으로 판정됨 | `provider` |
| `signup_step_viewed` | 가입 단계가 표시됨 | `step`, `provider` |
| `signup_completed` | 가입 API 성공 | `ageBand`, `disabilityType`, `gender`, `hasExperience`, `recordDegree`, `provider` |
| `event_search_results_viewed` | 검색 결과 응답이 표시됨 | `hasKeyword`, `keywordLength`, `resultCount`, 필터, `page` |
| `event_list_card_clicked` | 전체 목록 또는 검색 결과의 모임 선택 | `eventId`, `eventType`, `recruitStatus`, `source` |
| `event_detail_viewed` | 모임 상세 화면 표시 | 모임 분류, 모집 상태, `viewerRelation` |
| `application_started` | 기존 신청서가 없는 사용자가 신청 폼에 진입 | 모임 분류, `participantType` |
| `application_submitted` | 신규 신청 API 성공 | 모임 분류, `participantType` |
| `application_updated` | 신청 수정 API 성공 | 모임 분류, `participantType` |
| `application_canceled` | 신청 취소 API 성공 | 모임 분류 |

검색어 원문과 모임 이름은 보내지 않는다. 검색 효과는 검색어 존재 여부, 길이, 결과 수와 결과 클릭으로 측정한다.

## 핵심 퍼널

1. 가입: `signup_started → signup_step_viewed(step=terms) → signup_completed`
2. 탐색: `event_search_results_viewed → event_list_card_clicked(source=search) → event_detail_viewed`
3. 신청: `event_detail_viewed → application_started → application_submitted`
4. 신청 후 행동: `application_submitted → application_completed_action`

가입과 신청 퍼널은 `type`, `ageBand`, `eventType`을 한 번에 모두 분할하지 않는다. 현재 모수가 작으므로 한 번에 하나의 속성만 비교한다.

## 백엔드에서 추가할 이벤트

실제 참여자는 프론트에서 출석을 처리하는 운영자와 다르다. 따라서 기존 `attendance_checked`는 운영 지표로 유지하고 참여 리텐션에는 사용하지 않는다.

백엔드는 출석이 최종 확정될 때 실제 참여자의 `userId`를 PostHog `distinct_id`로 사용해 아래 이벤트를 한 모임·사용자당 한 번만 전송해야 한다.

| 이벤트 | 필수 속성 | 용도 |
| --- | --- | --- |
| `participation_completed` | `eventId`, `eventType`, `eventCategory`, `participantType`, `isFirstParticipation` | 실제 참여와 재참여 리텐션 |
| `participation_canceled` | 위 속성과 동일 | 최종 출석 취소 보정 |
| `crm_message_sent` | `scenario`, `channel`, `templateKey` | CRM 발송 모수 |
| `crm_message_failed` | `scenario`, `channel`, `templateKey`, `reasonCode` | 발송 실패율 |
| `crm_message_clicked` | `scenario`, `channel`, `templateKey` | 메시지 반응과 후속 신청 전환 |

`participation_completed → participation_completed`를 주간 또는 월간 리텐션으로 사용한다. `attendance_checked`를 이 리텐션에 사용하면 운영자의 행동이 참여자의 재방문으로 잘못 집계된다.

## 초기 대시보드

- 가입 퍼널: 시작 대비 단계별 완료율과 완료까지 걸린 시간
- 탐색 퍼널: 검색 결과 없음 비율, 결과 클릭률, 상세 조회율
- 신청 퍼널: 상세 조회 대비 신청 시작률과 신청 완료율
- 참여 리텐션: 첫 실제 참여 이후 W1/W4 또는 M1/M2 재참여율

PostHog 프로젝트 시간대는 운영 리포트를 만들기 전에 `Asia/Seoul`로 맞추고, `isPreLaunchPreview=true` 트래픽은 운영 지표에서 제외한다.
