import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import type { EventDetailResponse } from '@/api/types';
import { HiddenText, Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import {
  formatKoreanDate,
  formatTimeRange,
} from '../utils';
import { CommentsSection } from './CommentsSection';

type DetailPanelProps = {
  canShowComments: boolean;
  event: EventDetailResponse;
  onCopyLink: () => void;
  onKakaoShare: () => void;
};

export const DetailPanel = ({
  canShowComments,
  event,
  onCopyLink,
  onKakaoShare,
}: DetailPanelProps): ReactElement => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    navigate(APP_PATH.EVENT_SUPPORT);
  };
  const hasExpectedRunningDistance =
    event.expectedRunningDistanceKm !== null;

  return (
    <>
      <DetailSection>
        <DetailCard>
          <DetailInfoRow label="주최자">
            <Text color="text.primary" font="body-m-m">
              {event.organizer.name}
            </Text>
          </DetailInfoRow>
          <DetailInfoRow label="훈련일자">
            <StackedValue>
              <Text color="text.primary" font="body-m-m">
                {formatKoreanDate(event.schedule.date)}
              </Text>
              <Text color="text.primary" font="body-m-m">
                {formatTimeRange(
                  event.schedule.startTime,
                  event.schedule.endTime,
                )}
              </Text>
            </StackedValue>
          </DetailInfoRow>
          <DetailInfoRow label="장소">
            <PlaceValue>
              <Text color="text.primary" font="body-m-m">
                {event.place}
              </Text>
              <SupportButton type="button" onClick={handleSupportClick}>
                <Text color="text.secondary" font="detail-m-m">
                  지역별 이동지원 연락처
                </Text>
                <Icon
                  aria-hidden={true}
                  color="icon.secondary"
                  icon="chevron-right-lined"
                  size={16}
                />
              </SupportButton>
            </PlaceValue>
          </DetailInfoRow>
          {hasExpectedRunningDistance ? (
            <DetailInfoRow label="예상 러닝거리">
              <Text color="text.primary" font="body-m-m">
                {event.expectedRunningDistanceKm}KM
              </Text>
            </DetailInfoRow>
          ) : null}
          <Divider />
          <ContentText color="text.primary" font="body-m-m">
            {event.content}
          </ContentText>
        </DetailCard>

        <ShareActions>
          <ShareActionButton type="button" onClick={onCopyLink}>
            <ShareIconCircle>
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="link-lined"
                size={24}
              />
            </ShareIconCircle>
            <Text color="text.secondary" font="detail-m-m">
              링크 복사
            </Text>
          </ShareActionButton>
          <ShareActionButton type="button" onClick={onKakaoShare}>
            <ShareIconCircle>
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="share-lined"
                size={24}
              />
            </ShareIconCircle>
            <Text color="text.secondary" font="detail-m-m">
              카카오톡 공유하기
              <HiddenText>새창 열림</HiddenText>
            </Text>
          </ShareActionButton>
        </ShareActions>
      </DetailSection>

      {canShowComments ? <CommentsSection /> : null}
    </>
  );
};

type DetailInfoRowProps = {
  children: ReactNode;
  label: string;
};

const DetailInfoRow = ({
  children,
  label,
}: DetailInfoRowProps): ReactElement => {
  return (
    <InfoRow>
      <Text color="text.tertiary" font="body-m-m">
        {label}
      </Text>
      <InfoValue>{children}</InfoValue>
    </InfoRow>
  );
};

const DetailSection = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing['3xl']} ${theme.spacing.none} ${theme.spacing.none}`,
  boxSizing: 'border-box',
}));

const DetailCard = styled.article(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  marginInline: theme.spacing['2xl'],
  padding: theme.spacing['2xl'],
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.elevated,
}));

const InfoRow = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.pxToRem(86)} minmax(0, 1fr)`,
  gap: theme.spacing['5xl'],
  alignItems: 'start',
}));

const InfoValue = styled.div({
  minWidth: 0,
});

const StackedValue = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
}));

const PlaceValue = styled(StackedValue)(({ theme }) => ({
  gap: theme.spacing.md,
}));

const SupportButton = styled.button(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.xs,
  width: 'fit-content',
  maxWidth: '100%',
  minHeight: theme.pxToRem(36),
  padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.lg}`,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.full,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  touchAction: 'manipulation',
  textAlign: 'center',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Divider = styled.div(({ theme }) => ({
  width: '100%',
  height: theme.pxToRem(1),
  backgroundColor: theme.color.border.subtle,
}));

const ContentText = styled(Text)({
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

const ShareActions = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.pxToRem(30),
  width: '100%',
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const ShareIconCircle = styled.span(({ theme }) => ({
  display: 'inline-grid',
  placeItems: 'center',
  width: theme.pxToRem(48),
  height: theme.pxToRem(48),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,
  transition:
    'background-color 120ms ease, opacity 120ms ease, transform 120ms ease',
}));

const ShareActionButton = styled.button(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  minWidth: 0,
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  touchAction: 'manipulation',
  transition: 'opacity 120ms ease',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.sm,
  },

  '@media (hover: hover)': {
    '&:hover:not(:disabled) > span:first-of-type': {
      opacity: 0.88,
    },
  },

  '&:active:not(:disabled) > span:first-of-type': {
    opacity: 0.8,
    transform: 'scale(0.96)',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.48,
  },

  '&:disabled:active > span:first-of-type': {
    transform: 'none',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '& > span:first-of-type': {
      transition: 'none',
    },

    '&:active:not(:disabled) > span:first-of-type': {
      transform: 'none',
    },
  },
}));
