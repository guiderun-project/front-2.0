import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type {
  MatchingCompletedResponse,
  MatchingCompletedRow,
  MatchingUser,
} from '@/api/types';
import { ConfirmPopup, Icon, RunnerTypeAvatar, Text } from '@/components';

import {
  getEventGroupDisplayLabel,
  type EventGroupLabelContext,
} from '../../utils';
import { SectionState } from './MatchStates';

type MatchCompletedPanelProps = {
  cancelingViId: string | null;
  completed: MatchingCompletedResponse;
  eventGroupLabelContext: EventGroupLabelContext;
  isCancelingMatching: boolean;
  onCancelMatching: (
    row: MatchingCompletedRow,
    options?: { onSuccess?: () => void },
  ) => void;
};

export const MatchCompletedPanel = ({
  cancelingViId,
  completed,
  eventGroupLabelContext,
  isCancelingMatching,
  onCancelMatching,
}: MatchCompletedPanelProps): ReactElement => {
  const [cancelTarget, setCancelTarget] = useState<MatchingCompletedRow | null>(
    null,
  );

  if (completed.summary.completedViCount === 0) {
    return <SectionState>완료된 매칭이 없어요</SectionState>;
  }

  const handleConfirmCancelMatching = () => {
    if (!cancelTarget || isCancelingMatching) {
      return;
    }

    onCancelMatching(cancelTarget, {
      onSuccess: () => {
        setCancelTarget(null);
      },
    });
  };

  return (
    <>
      <GroupStack>
        {completed.groups.map((group, index) => {
          const groupLabel = getEventGroupDisplayLabel(
            eventGroupLabelContext,
            group.runningGroup,
          );

          return (
            <GroupSection key={group.runningGroup} $hasDivider={index > 0}>
              <GroupHeader>
                <Text as="h2" color="text.primary" font="body-l-sb">
                  {groupLabel}
                </Text>
                <Text color="text.tertiary" font="body-m-m">
                  {group.totalCount}명
                </Text>
              </GroupHeader>
              <CompletedList>
                {group.rows.map((row) => (
                  <li key={row.vi.userId}>
                    <CompletedMatchingCard
                      disabled={cancelingViId === row.vi.userId}
                      row={row}
                      onRequestCancelMatching={setCancelTarget}
                    />
                  </li>
                ))}
              </CompletedList>
            </GroupSection>
          );
        })}
      </GroupStack>

      <ConfirmPopup
        cancelDisabled={isCancelingMatching}
        cancelText="아니요"
        confirmLoading={isCancelingMatching}
        confirmText="매칭취소"
        description={
          cancelTarget
            ? `${cancelTarget.vi.name}님의 매칭이 대기 상태로 돌아가요.`
            : undefined
        }
        open={cancelTarget !== null}
        title="매칭을 취소할까요?"
        onCancel={() => {
          if (!isCancelingMatching) {
            setCancelTarget(null);
          }
        }}
        onConfirm={handleConfirmCancelMatching}
        onOpenChange={(open) => {
          if (!open && !isCancelingMatching) {
            setCancelTarget(null);
          }
        }}
      />
    </>
  );
};

type CompletedMatchingCardProps = {
  disabled: boolean;
  row: MatchingCompletedRow;
  onRequestCancelMatching: (row: MatchingCompletedRow) => void;
};

const CompletedMatchingCard = ({
  disabled,
  row,
  onRequestCancelMatching,
}: CompletedMatchingCardProps): ReactElement => {
  return (
    <CompletedCard>
      <CompletedRow>
        <ParticipantName user={row.vi} />
        <RelationText color="text.secondary" font="body-m-m">
          의 가이드러너
        </RelationText>
        {row.guides.length > 0 ? (
          <GuideList>
            {row.guides.map((guide) => (
              <ParticipantName key={guide.userId} user={guide} />
            ))}
          </GuideList>
        ) : (
          <Text color="text.tertiary" font="body-m-m">
            없음
          </Text>
        )}
      </CompletedRow>
      <CancelButton
        disabled={disabled}
        type="button"
        onClick={() => {
          onRequestCancelMatching(row);
        }}
      >
        매칭취소
        <Icon aria-hidden={true} color="icon.secondary" icon="delete-lined" size={14} />
      </CancelButton>
    </CompletedCard>
  );
};

type ParticipantNameProps = {
  user: MatchingUser;
};

const ParticipantName = ({ user }: ParticipantNameProps): ReactElement => {
  return (
    <ParticipantNameRoot>
      <RunnerTypeAvatar
        size="m"
        type={user.type}
      />
      <NameText color="text.primary" font="body-m-sb">
        {user.name}
      </NameText>
    </ParticipantNameRoot>
  );
};

const GroupStack = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
}));

const GroupSection = styled.section<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    paddingTop: $hasDivider ? theme.spacing['2xl'] : theme.spacing.lg,
    borderTop: $hasDivider ? `1px solid ${theme.color.border.subtle}` : 0,
  }),
);

const GroupHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const CompletedList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const CompletedCard = styled.article(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
}));

const CompletedRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.s,
  width: '100%',
  minWidth: 0,
}));

const RelationText = styled(Text)({
  display: 'block',
  flex: '1 1 0',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GuideList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flex: '0 0 auto',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const ParticipantNameRoot = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const NameText = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const CancelButton = styled.button(({ theme }) => {
  const typography = theme.typography['body-m-sb'];

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s,
    width: '100%',
    height: theme.pxToRem(42),
    padding: `${theme.spacing.none} ${theme.spacing.xl}`,
    border: 0,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.bg.overlay,
    color: theme.color.text.secondary,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    transition: 'background-color 120ms ease, opacity 120ms ease, transform 120ms ease',

    '&:active:not(:disabled)': {
      transform: 'scale(0.99)',
    },

    '&:focus-visible': {
      outline: `2px solid ${theme.color.border.focused}`,
      outlineOffset: theme.spacing.xs,
    },

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.48,
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',

      '&:active:not(:disabled)': {
        transform: 'none',
      },
    },
  };
});
