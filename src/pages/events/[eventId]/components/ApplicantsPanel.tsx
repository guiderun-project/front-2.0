import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventApplicant, EventApplicantListResponse } from '@/api/types';
import { Badge, HiddenText, Icon, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import { getEventGroupDisplayLabel, type EventGroupLabelContext } from '../utils';
import { PanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

type ApplicantsPanelProps = {
  data?: EventApplicantListResponse;
  eventCategory: EventGroupLabelContext['eventCategory'];
  eventType: EventGroupLabelContext['eventType'];
  isError: boolean;
  isPending: boolean;
  onApplicantClick?: (applicantId: string) => void;
};

export const ApplicantsPanel = ({
  data,
  eventCategory,
  eventType,
  isError,
  isPending,
  onApplicantClick,
}: ApplicantsPanelProps): ReactElement => {
  if (isPending) {
    return <PanelState>신청자 명단을 불러오는 중입니다.</PanelState>;
  }

  if (isError || !data) {
    return <PanelState>신청자 명단을 불러오지 못했습니다.</PanelState>;
  }

  const { groups, summary } = data;

  if (summary.totalCount === 0 || groups.length === 0) {
    return <PanelState>아직 신청자가 없습니다.</PanelState>;
  }

  return (
    <ProtectedPanelSection>
      <SummaryCard>
        <HiddenText>{getSummaryDescription(summary)}</HiddenText>
        <SummaryLabel aria-hidden={true} color="text.tertiary" font="body-m-m">
          신청인원
        </SummaryLabel>
        <SummaryContent aria-hidden={true}>
          <Text color="text.primary" font="body-l-sb">
            총 {summary.totalCount}명
          </Text>
          <SummaryBreakdown>
            <SummaryBreakdownItem>
              <SummaryAvatar aria-hidden={true}>
                <RunnerTypeAvatar size="s" type="VI" />
              </SummaryAvatar>
              <Text color="text.tertiary" font="body-m-m">
                시각장애러너 {summary.viCount}명
              </Text>
            </SummaryBreakdownItem>
            <SummaryBreakdownItem>
              <SummaryAvatar aria-hidden={true}>
                <RunnerTypeAvatar size="s" type="GUIDE" />
              </SummaryAvatar>
              <Text color="text.tertiary" font="body-m-m">
                가이드러너 {summary.guideCount}명
              </Text>
            </SummaryBreakdownItem>
          </SummaryBreakdown>
        </SummaryContent>
      </SummaryCard>

      <GroupCard>
        {groups.map((group, index) => {
          const { applicants, totalCount } = group;
          const groupLabel = getEventGroupDisplayLabel(
            { eventCategory, eventType },
            group.runningGroup,
          );

          return (
            <GroupSection
              key={group.runningGroup}
              $hasDivider={index < groups.length - 1}
            >
              <GroupHeading>
                <GroupHeadingText role="text">
                  <Text as="span" color="text.primary" font="body-l-b">
                    {groupLabel}
                  </Text>{' '}
                  <GroupCountText color="text.tertiary" font="body-m-m">
                    {totalCount}명
                  </GroupCountText>
                </GroupHeadingText>
              </GroupHeading>
              <PersonList>
                {applicants.map((applicant) => (
                  <ApplicantRow
                    key={applicant.userId}
                    applicant={applicant}
                    onApplicantClick={onApplicantClick}
                  />
                ))}
              </PersonList>
            </GroupSection>
          );
        })}
      </GroupCard>
    </ProtectedPanelSection>
  );
};

type ApplicantRowProps = {
  applicant: EventApplicant;
  onApplicantClick?: (applicantId: string) => void;
};

const ApplicantRow = ({
  applicant,
  onApplicantClick,
}: ApplicantRowProps): ReactElement => {
  const description = getApplicantDescription(applicant, Boolean(onApplicantClick));
  const content = (
    <PersonRowContent aria-hidden={true}>
      <ProfileAvatar name={applicant.name} type={applicant.type} />
      {applicant.isFirstParticipation ? (
        <Badge size="s" tone="cyan">
          첫참여
        </Badge>
      ) : null}
    </PersonRowContent>
  );

  if (onApplicantClick) {
    return (
      <ClickablePersonRow
        aria-haspopup="dialog"
        type="button"
        onClick={() => {
          onApplicantClick(applicant.userId);
        }}
      >
        <HiddenText>{description}</HiddenText>
        {content}
        <Icon
          aria-hidden={true}
          color="icon.secondary"
          icon="chevron-right-lined"
          size={20}
        />
      </ClickablePersonRow>
    );
  }

  return (
    <PersonRow>
      <HiddenText>{description}</HiddenText>
      {content}
    </PersonRow>
  );
};

const getSummaryDescription = (
  summary: EventApplicantListResponse['summary'],
) => {
  return `신청인원 총 ${summary.totalCount}명, 시각장애러너 ${summary.viCount}명, 가이드러너 ${summary.guideCount}명`;
};

const getApplicantDescription = (
  applicant: EventApplicant,
  hasApplicantDetail: boolean,
) => {
  const participationDescription = applicant.isFirstParticipation
    ? ', 첫참여'
    : '';
  const detailDescription = hasApplicantDetail ? ', 신청서 상세 보기' : '';

  return `${RUNNER_TYPE_LABELS[applicant.type]} ${applicant.name}${participationDescription}${detailDescription}`;
};

const ProtectedPanelSection = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const SummaryCard = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing['3xl'],
  padding: theme.spacing['2xl'],
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.elevated,
}));

const SummaryLabel = styled(Text)(({ theme }) => ({
  flex: '1 1 auto',
  maxWidth: theme.pxToRem(91),
  minWidth: 0,
}));

const SummaryContent = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0',
  gap: theme.spacing.md,
  minWidth: 0,
  width: '100%',
}));

const SummaryBreakdown = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
}));

const SummaryBreakdownItem = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const SummaryAvatar = styled.span({
  display: 'inline-flex',
  flexShrink: 0,
});

const GroupCard = styled.article(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
  borderRadius: theme.radius.xl,
  backgroundColor: theme.color.bg.elevated,
}));

const GroupSection = styled.section<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    paddingBottom: $hasDivider ? theme.spacing['3xl'] : 0,
    borderBottom: $hasDivider
      ? `1px solid ${theme.color.border.subtle}`
      : 0,
  }),
);

const GroupHeading = styled.h2({
  margin: 0,
});

const GroupHeadingText = styled.span({
  display: 'inline',
});

const GroupCountText = styled(Text)(({ theme }) => ({
  marginLeft: theme.spacing.md,
}));

const PersonList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const PersonRowContent = styled.span(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const PersonRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing.md,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
}));

const ClickablePersonRow = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing.md,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  border: 0,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
  cursor: 'pointer',
  textAlign: 'left',
  touchAction: 'manipulation',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.color.bg.surface,
    },
  },

  '&:active': {
    backgroundColor: theme.color.bg.surface,
  },
}));
