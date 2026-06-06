import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventMatchingStatusResponse, MatchingUser } from '@/api/types';
import { Badge, Text } from '@/components';

import { PanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

type MatchingPanelProps = {
  data?: EventMatchingStatusResponse;
  isError: boolean;
  isPending: boolean;
};

export const MatchingPanel = ({
  data,
  isError,
  isPending,
}: MatchingPanelProps): ReactElement => {
  if (isPending) {
    return <PanelState>매칭 현황을 불러오는 중입니다.</PanelState>;
  }

  if (isError || !data) {
    return <PanelState>매칭 현황을 불러오지 못했습니다.</PanelState>;
  }

  if (data.groups.length === 0) {
    return <PanelState>아직 매칭 현황이 없습니다.</PanelState>;
  }

  return (
    <ProtectedPanelSection>
      {data.myPartners.length > 0 ? (
        <GroupCard>
          <GroupHeader>
            <Text as="h2" color="text.primary" font="body-l-b">
              나의 파트너
            </Text>
          </GroupHeader>
          <PersonList>
            {data.myPartners.map((partner) => (
              <PersonRow key={partner.userId}>
                <ProfileAvatar name={partner.name} type={partner.type} />
                <Badge size="s" tone="cyan">
                  {partner.applyGroup} 그룹
                </Badge>
              </PersonRow>
            ))}
          </PersonList>
        </GroupCard>
      ) : null}

      <GroupList>
        {data.groups.map((group) => (
          <GroupCard key={group.runningGroup}>
            <GroupHeader>
              <Text as="h2" color="text.primary" font="body-l-b">
                {group.runningGroup} 그룹
              </Text>
              <Text color="text.tertiary" font="detail-m-m">
                {group.totalCount}팀
              </Text>
            </GroupHeader>
            <MatchingRows>
              {group.rows.map((row, index) => (
                <MatchingRowItem key={`${group.runningGroup}-${index}`}>
                  <MatchingColumn>
                    <Text color="text.tertiary" font="detail-m-m">
                      VI
                    </Text>
                    {row.vi ? (
                      <MatchingUserItem user={row.vi} />
                    ) : (
                      <EmptySlot>미정</EmptySlot>
                    )}
                  </MatchingColumn>
                  <MatchingColumn>
                    <Text color="text.tertiary" font="detail-m-m">
                      가이드
                    </Text>
                    {row.guides.length > 0 ? (
                      <PersonList>
                        {row.guides.map((guide) => (
                          <MatchingUserItem key={guide.userId} user={guide} />
                        ))}
                      </PersonList>
                    ) : (
                      <EmptySlot>미정</EmptySlot>
                    )}
                  </MatchingColumn>
                </MatchingRowItem>
              ))}
            </MatchingRows>
          </GroupCard>
        ))}
      </GroupList>
    </ProtectedPanelSection>
  );
};

type MatchingUserItemProps = {
  user: MatchingUser;
};

const MatchingUserItem = ({ user }: MatchingUserItemProps): ReactElement => {
  return (
    <PersonRow>
      <ProfileAvatar name={user.name} type={user.type} />
    </PersonRow>
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

const MatchingRows = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const MatchingRowItem = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.subtle,
}));

const MatchingColumn = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const EmptySlot = styled(Text)(({ theme }) => ({
  color: theme.color.text.tertiary,
}));
