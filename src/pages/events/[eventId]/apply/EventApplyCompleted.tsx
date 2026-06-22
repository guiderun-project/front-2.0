import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventDetailResponse } from '@/api/types';
import fireworksImageUrl from '@/assets/images/fireworks.png';
import {
  FooterButton,
  HiddenText,
  PageLayout,
  Text,
  TopNavigation,
} from '@/components';

import { createGoogleCalendarEventUrl } from './googleCalendar';

type EventApplyCompletedProps = {
  event: EventDetailResponse;
  onBack: () => void;
  onViewEvent: () => void;
};

export const EventApplyCompleted = ({
  event,
  onBack,
  onViewEvent,
}: EventApplyCompletedProps): ReactElement => {
  const handleAddGoogleCalendar = () => {
    const calendarUrl = createGoogleCalendarEventUrl(event);
    const calendarWindow = window.open('', '_blank');

    if (calendarWindow) {
      calendarWindow.opener = null;
      calendarWindow.location.href = calendarUrl;
      return;
    }

    window.location.assign(calendarUrl);
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
        <FooterButton ratio="100:100">
          <FooterButton.Button
            level="secondary"
            size="l"
            onClick={handleAddGoogleCalendar}
          >
            구글 캘린더에 일정 저장
            <HiddenText>새창 열림</HiddenText>
          </FooterButton.Button>
          <FooterButton.Button size="l" onClick={onViewEvent}>
            신청한 모임 보기
          </FooterButton.Button>
        </FooterButton>
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
