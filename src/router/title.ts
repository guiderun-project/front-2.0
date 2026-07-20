// 라우트별 document.title 모음. 스크린리더 라우트 어나운서(App.tsx)가 전환 시
// 이 제목을 낭독하므로, 화면 안에서 들리는 이름(h1·내비게이션 라벨)과 일치시킨다.
// account-find, my/edit, events/:eventId 하위 라우트는 상태에 따라 페이지가
// PageTitle을 직접 설정하므로 여기에 포함하지 않는다.
export const ROUTE_PAGE_TITLES = {
  // 홈 h1(HomeHeader)·하단 내비게이션 라벨과 동일한 '홈화면'을 사용한다.
  MAIN: '홈화면',
  EVENTS: '전체 모임',
  DESIGN: '디자인 시스템',
  DESIGN_FORM: '폼 디자인',
  MY: '마이페이지',
  EVENT_SEARCH: '모임 검색',
  INTRO: '시작하기',
  OAUTH: '로그인 처리',
  LOGIN: '로그인',
  SIGNUP: '회원가입',
  TERMS: '약관',
  EVENT_NEW: '모임 만들기',
  EVENT_SUPPORT: '이동지원 연락처',
  MY_EVENTS: '나의 활동',
  ACCOUNT_DELETE: '회원 탈퇴',
} as const;
