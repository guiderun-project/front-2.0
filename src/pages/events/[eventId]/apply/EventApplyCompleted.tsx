import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import fireworksImageUrl from '@/assets/images/fireworks.png';
import { Button, PageLayout, Text, TopNavigation } from '@/components';

type EventApplyCompletedProps = {
  onBack: () => void;
  onViewEvent: () => void;
};

export const EventApplyCompleted = ({
  onBack,
  onViewEvent,
}: EventApplyCompletedProps): ReactElement => {
  const handleAddGoogleCalendar = () => {
    // TODO: 구글 캘린더 연동 로직 구현 필요
  };

  return (
    <PageLayout background="bg.default">
      <CompletedPage>
        <TopNavigation
          left={{
            ariaLabel: '이전 페이지로 이동',
            icon: 'chevron-left-lined',
            onClick: onBack,
          }}
          right={[
            {
              ariaLabel: '이벤트 상세로 이동',
              icon: 'delete-lined',
              onClick: onViewEvent,
            },
          ]}
        />
        <CompletedContent>
          <CompletedImage alt="" aria-hidden="true" src={fireworksImageUrl} />
          <Text as="h1" align="center" color="text.primary" font="heading-m-sb">
            참여 신청이 완료됐어요!
          </Text>
          <Description color="text.secondary" font="body-m-m">
            모임 전, 나의 파트너가 누구인지 확인해주세요.
            {'\n'}
            대략 모임 2-3일 전까지 매칭될 예정이에요.
          </Description>
        </CompletedContent>
        <CompletedFooter>
          <Button
            fullWidth
            level="secondary"
            size="l"
            onClick={handleAddGoogleCalendar}
          >
            구글 캘린더에 일정 저장
          </Button>
          <Button fullWidth size="l" onClick={onViewEvent}>
            신청한 모임 보기
          </Button>
        </CompletedFooter>
      </CompletedPage>
    </PageLayout>
  );
};

const CompletedPage = styled.div({
  position: 'relative',
  minHeight: '100dvh',
  overflow: 'hidden',
});

const CompletedContent = styled.section(({ theme }) => ({
  display: 'grid',
  justifyItems: 'center',
  gap: theme.spacing.lg,
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['6xl']}`,
  textAlign: 'center',
}));

const CompletedImage = styled.img(({ theme }) => ({
  display: 'block',
  width: theme.pxToRem(160),
  height: theme.pxToRem(160),
  objectFit: 'contain',
}));

const Description = styled(Text)({
  whiteSpace: 'pre-line',
});

const CompletedFooter = styled.footer(({ theme }) => ({
  position: 'fixed',
  right: '50%',
  bottom: 0,
  zIndex: theme.zIndex.footer,
  display: 'grid',
  boxSizing: 'border-box',
  width: `min(100%, var(--app-mobile-viewport-width, ${theme.layout.mobileViewportMaxWidth}))`,
  gap: theme.spacing.md,
  padding: `${theme.spacing.lg} ${theme.spacing['2xl']} calc(${theme.spacing.lg} + env(safe-area-inset-bottom))`,
  background: theme.gradient.bg.footer,
  transform: 'translateX(50%)',
}));
