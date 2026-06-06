import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventApplicantListResponse } from '@/api/types';
import { Badge, Text } from '@/components';

import { PanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

type ApplicantsPanelProps = {
  data?: EventApplicantListResponse;
  isError: boolean;
  isPending: boolean;
};

export const ApplicantsPanel = ({
  data,
  isError,
  isPending,
}: ApplicantsPanelProps): ReactElement => {
  if (isPending) {
    return <PanelState>신청자 명단을 불러오는 중입니다.</PanelState>;
  }

  if (isError || !data) {
    return <PanelState>신청자 명단을 불러오지 못했습니다.</PanelState>;
  }

  if (data.summary.totalCount === 0) {
    return <PanelState>아직 신청자가 없습니다.</PanelState>;
  }

  return (
    <ProtectedPanelSection>
      <SummaryCard>
        <SummaryStat>
          <Text color="text.tertiary" font="detail-m-m">
            전체
          </Text>
          <Text color="text.primary" font="heading-s-sb">
            {data.summary.totalCount}
          </Text>
        </SummaryStat>
        <SummaryStat>
          <Text color="text.tertiary" font="detail-m-m">
            VI
          </Text>
          <Text color="text.primary" font="heading-s-sb">
            {data.summary.viCount}
          </Text>
        </SummaryStat>
        <SummaryStat>
          <Text color="text.tertiary" font="detail-m-m">
            가이드
          </Text>
          <Text color="text.primary" font="heading-s-sb">
            {data.summary.guideCount}
          </Text>
        </SummaryStat>
      </SummaryCard>

      <GroupList>
        {data.groups.map((group) => (
          <GroupCard key={group.runningGroup}>
            <GroupHeader>
              <Text as="h2" color="text.primary" font="body-l-b">
                {group.runningGroup} 그룹
              </Text>
              <Text color="text.tertiary" font="detail-m-m">
                {group.totalCount}명
              </Text>
            </GroupHeader>
            <PersonList>
              {group.applicants.map((applicant) => (
                <PersonRow key={applicant.userId}>
                  <ProfileAvatar name={applicant.name} type={applicant.type} />
                  {applicant.isFirstParticipation ? (
                    <Badge size="s" tone="green">
                      첫 참여
                    </Badge>
                  ) : null}
                </PersonRow>
              ))}
            </PersonList>
          </GroupCard>
        ))}
      </GroupList>
    </ProtectedPanelSection>
  );
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
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: theme.spacing.md,
  padding: theme.spacing['2xl'],
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.elevated,
}));

const SummaryStat = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.xs,
}));

const GroupList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));

const GroupCard = styled.article(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing['2xl'],
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.elevated,
}));

const GroupHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.lg,
}));

const PersonList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const PersonRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));
