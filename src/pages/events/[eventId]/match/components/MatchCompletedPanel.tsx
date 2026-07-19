import { Fragment, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type {
  MatchingCompletedResponse,
  MatchingCompletedRow,
  MatchingUser,
} from '@/api/types';
import { CheckBox, HiddenText, Icon, IconButton, RunnerTypeAvatar, Text } from '@/components';
import { RUNNER_TYPE_LABELS } from '@/constants';

import {
  getEventGroupDisplayLabel,
  type EventGroupLabelContext,
} from '../../utils';
import type { SelectablePerson } from '../useEventMatchPage';
import { SectionState } from './MatchStates';

type MatchCompletedPanelProps = {
  completed: MatchingCompletedResponse;
  eventGroupLabelContext: EventGroupLabelContext;
  selectedUserIds: ReadonlySet<string>;
  onToggleParticipant: (person: SelectablePerson) => void;
};

const toSelectablePerson = (user: MatchingUser): SelectablePerson => ({
  userId: user.userId,
  name: user.name,
  type: user.type,
});

export const MatchCompletedPanel = ({
  completed,
  eventGroupLabelContext,
  selectedUserIds,
  onToggleParticipant,
}: MatchCompletedPanelProps): ReactElement => {
  if (completed.summary.completedViCount === 0) {
    return <SectionState>완료된 매칭이 없어요</SectionState>;
  }

  return (
    <GroupStack>
      {completed.groups.map((group, index) => {
        const groupLabel = getEventGroupDisplayLabel(
          eventGroupLabelContext,
          group.runningGroup,
        );

        return (
          <GroupSection key={group.runningGroup} $hasDivider={index > 0}>
            <GroupHeading>
              <GroupHeadingText role="text">
                <Text as="span" color="text.primary" font="body-l-sb">
                  {groupLabel}
                </Text>{' '}
                <GroupCountText color="text.tertiary" font="body-m-m">
                  {group.totalCount}명
                </GroupCountText>
              </GroupHeadingText>
            </GroupHeading>
            <PairList>
              {group.rows.map((row) => (
                <li key={row.vi.userId}>
                  <CompletedPair
                    row={row}
                    selectedUserIds={selectedUserIds}
                    onToggleParticipant={onToggleParticipant}
                  />
                </li>
              ))}
            </PairList>
          </GroupSection>
        );
      })}
    </GroupStack>
  );
};

type CompletedPairProps = {
  row: MatchingCompletedRow;
  selectedUserIds: ReadonlySet<string>;
  onToggleParticipant: (person: SelectablePerson) => void;
};

const CompletedPair = ({
  row,
  selectedUserIds,
  onToggleParticipant,
}: CompletedPairProps): ReactElement => {
  const members = [row.vi, ...row.guides];
  const selectedMembers = members.filter((member) =>
    selectedUserIds.has(member.userId),
  );
  const hasSelection = selectedMembers.length > 0;
  const pairDescription = getCompletedPairDescription(row);

  const handleDeselectPair = () => {
    selectedMembers.forEach((member) => {
      onToggleParticipant(toSelectablePerson(member));
    });
  };

  return (
    <PairCard $isSelected={hasSelection}>
      <HiddenText>{pairDescription}</HiddenText>
      <PairBoxes aria-hidden={true}>
        <PersonBox
          person={row.vi}
          selected={selectedUserIds.has(row.vi.userId)}
          onToggle={onToggleParticipant}
        />

        <LinkBadge>
          <Icon aria-hidden={true} color="icon.secondary" icon="link-lined" size={16} />
        </LinkBadge>

        {row.guides.length > 0 ? (
          <GuideColumn>
            {row.guides.map((guide, index) => (
              <Fragment key={guide.userId}>
                {index > 0 ? <GuideDivider /> : null}
                <PersonBox
                  person={guide}
                  selected={selectedUserIds.has(guide.userId)}
                  variant="plain"
                  onToggle={onToggleParticipant}
                />
              </Fragment>
            ))}
          </GuideColumn>
        ) : (
          <EmptyGuideBox>
            <Text color="text.tertiary" font="body-m-m">
              없음
            </Text>
          </EmptyGuideBox>
        )}
      </PairBoxes>

      {hasSelection ? (
        <DeselectButton
          aria-label={`${row.vi.name}님 매칭 선택 취소`}
          color="icon.secondary"
          icon="close-lined"
          iconSize={19.2}
          shape="round"
          size={32}
          onClick={handleDeselectPair}
        />
      ) : null}
    </PairCard>
  );
};

type PersonBoxProps = {
  person: MatchingUser;
  selected: boolean;
  variant?: 'box' | 'plain';
  onToggle: (person: SelectablePerson) => void;
};

const PersonBox = ({
  person,
  selected,
  variant = 'box',
  onToggle,
}: PersonBoxProps): ReactElement => {
  const selectLabel =
    `${RUNNER_TYPE_LABELS[person.type]} ${person.name} ${selected ? '선택 취소' : '선택'}`;

  return (
    <PersonBoxRoot $selected={selected} $variant={variant}>
      <CheckBox
        aria-label={selectLabel}
        checked={selected}
        onChange={() => {
          onToggle(toSelectablePerson(person));
        }}
      />
      <PersonAvatarName>
        <RunnerTypeAvatar size="m" type={person.type} />
        <PersonName color="text.primary" font="body-m-sb">
          {person.name}
        </PersonName>
      </PersonAvatarName>
    </PersonBoxRoot>
  );
};

const getCompletedPairDescription = (row: MatchingCompletedRow) => {
  if (row.guides.length === 0) {
    return `${row.vi.name}의 가이드러너 없음`;
  }

  return `${row.vi.name}의 가이드러너 ${row.guides
    .map((guide) => guide.name)
    .join(', ')}`;
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

const GroupHeading = styled.h3({
  margin: 0,
});

const GroupHeadingText = styled.span({
  display: 'inline',
});

const GroupCountText = styled(Text)(({ theme }) => ({
  marginLeft: theme.spacing.md,
}));

const PairList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const PairCard = styled.article<{ $isSelected: boolean }>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    width: '100%',
    minWidth: 0,
    padding: $isSelected ? theme.spacing.lg : theme.spacing.none,
    borderRadius: theme.radius.lg,
    backgroundColor: $isSelected ? theme.color.bg.subtle : 'transparent',
    boxSizing: 'border-box',
    transition: 'background-color 160ms ease-out, padding 160ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const PairBoxes = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flex: '1 1 auto',
  alignItems: 'stretch',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const PersonBoxRoot = styled.label<{ $selected: boolean; $variant: 'box' | 'plain' }>(
  ({ $selected, $variant, theme }) => ({
    display: 'flex',
    flex: '1 1 0',
    alignItems: 'center',
    gap: theme.spacing.lg,
    minWidth: 0,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: theme.radius.lg,
    backgroundColor:
      $variant === 'plain'
        ? 'transparent'
        : $selected
          ? theme.color.bg['brand-soft']
          : theme.color.bg.subtle,
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
  }),
);

const PersonAvatarName = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const PersonName = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GuideColumn = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: 0,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.subtle,
  boxSizing: 'border-box',
}));

const GuideDivider = styled.div(({ theme }) => ({
  width: `calc(100% - ${theme.spacing.xl} * 2)`,
  height: 0,
  margin: `0 auto`,
  borderTop: `1px solid ${theme.color.border.subtle}`,
}));

const EmptyGuideBox = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.subtle,
  boxSizing: 'border-box',
}));

const LinkBadge = styled.span(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 1,
  display: 'inline-grid',
  placeItems: 'center',
  width: theme.pxToRem(28),
  height: theme.pxToRem(28),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.default,
  transform: 'translate(-50%, -50%)',
}));

const DeselectButton = styled(IconButton)(({ theme }) => ({
  flex: '0 0 auto',
  backgroundColor: theme.color.bg.overlay,
}));
