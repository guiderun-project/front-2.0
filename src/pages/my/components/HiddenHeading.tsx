import styled from '@emotion/styled';

/**
 * 마이페이지 정보 카드의 스크린리더 전용 제목.
 *
 * 카드가 aria-label 붙은 region으로만 존재하면 VoiceOver/TalkBack의
 * 헤딩 단위 탐색에서 발견되지 않으므로, 시각 디자인 변경 없이 헤딩을
 * 제공한다. position: absolute 라 flex 아이템이 아니어서 카드의
 * gap/레이아웃에 영향이 없다.
 *
 * 고정값은 표준 visually-hidden 접근성 패턴(HiddenText와 동일)을 따른다.
 */
export const HiddenHeading = styled.h3({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
