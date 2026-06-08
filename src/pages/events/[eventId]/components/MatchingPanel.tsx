import { useId, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MatchingUser, RunningGroup } from '@/api/types';
import { Badge, Icon, Text } from '@/components';
import type { AppTheme } from '@/styles/theme';

import type {
  MatchingStatusViewModel,
  MatchingStatusViewRow,
} from '../hooks/matchingStatusViewModel';
import { PanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

type MatchingPanelProps = {
  data?: MatchingStatusViewModel;
  isError: boolean;
  isPending: boolean;
  showMyPartnerSummary: boolean;
};

export const MatchingPanel = ({
  data,
  isError,
  isPending,
  showMyPartnerSummary,
}: MatchingPanelProps): ReactElement => {
  if (isPending) {
    return <PanelState>매칭 현황을 불러오는 중입니다.</PanelState>;
  }

  if (isError || !data) {
    return <PanelState>매칭 현황을 불러오지 못했습니다.</PanelState>;
  }

  if (data.isEmpty) {
    return <PanelState>아직 매칭 현황이 없습니다.</PanelState>;
  }

  return (
    <PanelRoot aria-label="매칭 현황">
      <ResultsSection>
        {showMyPartnerSummary ? (
          <MyPartnerSummary partners={data.myPartners} />
        ) : null}

        <GroupList>
          {data.groups.map((group) => (
            <MatchingGroupCard key={group.runningGroup} group={group} />
          ))}
        </GroupList>
      </ResultsSection>

      <SectionDivider aria-hidden={true} />
      <MatchingCriteriaAccordion defaultOpen={true} />
    </PanelRoot>
  );
};

type MatchingGroupCardProps = {
  group: MatchingStatusViewModel['groups'][number];
};

const MatchingGroupCard = ({
  group,
}: MatchingGroupCardProps): ReactElement => {
  return (
    <GroupCard>
      <GroupHeader>
        <Text as="h2" color="text.primary" font="heading-s-sb">
          {group.runningGroup}그룹
        </Text>
        <Text color="text.tertiary" font="body-m-m">
          {group.totalCount}명
        </Text>
      </GroupHeader>
      <MatchingRows
        aria-label={`${group.runningGroup}그룹 매칭 결과`}
        role="list"
      >
        {group.rows.map((row) => (
          <MatchingResultRow key={row.id} row={row} />
        ))}
      </MatchingRows>
    </GroupCard>
  );
};

type MyPartnerSummaryProps = {
  partners: MatchingUser[];
};

const MyPartnerSummary = ({
  partners,
}: MyPartnerSummaryProps): ReactElement => {
  return (
    <MyPartnerCard>
      <Text color="text.tertiary" font="body-m-m">
        내 파트너
      </Text>
      {partners.length > 0 ? (
        <PartnerList>
          {partners.map((partner) => (
            <PartnerItem key={partner.userId}>
              <ProfileAvatar name={partner.name} type={partner.type} />
            </PartnerItem>
          ))}
        </PartnerList>
      ) : (
        <Badge size="s" tone="gray">
          대기중
        </Badge>
      )}
    </MyPartnerCard>
  );
};

type MatchingResultRowProps = {
  row: MatchingStatusViewRow;
};

type ParticipantSlotVariant = 'matched' | 'unmatched';

const MatchingResultRow = ({ row }: MatchingResultRowProps): ReactElement => {
  return (
    <MatchingRowItem aria-label={row.accessibilityLabel} role="listitem">
      <MatchingRowVisual aria-hidden={true}>
        <ParticipantSlot $variant={row.vi ? 'matched' : 'unmatched'}>
          {row.vi ? (
            <ProfileAvatar name={row.vi.name} type={row.vi.type} />
          ) : (
            <UnmatchedSlot />
          )}
        </ParticipantSlot>

        <LinkIconCircle>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="link-lined"
            size={16}
          />
        </LinkIconCircle>

        <ParticipantSlot
          $variant={row.guides.length > 0 ? 'matched' : 'unmatched'}
        >
          {row.guides.length > 0 ? (
            <GuideList>
              {row.guides.map((guide) => (
                <ProfileAvatar
                  key={guide.userId}
                  name={guide.name}
                  type={guide.type}
                />
              ))}
            </GuideList>
          ) : (
            <UnmatchedSlot />
          )}
        </ParticipantSlot>
      </MatchingRowVisual>
    </MatchingRowItem>
  );
};

const UnmatchedSlot = (): ReactElement => {
  return (
    <QuestionMarkChip>
      <QuestionMark color="text.tertiary" font="heading-s-m">
        ?
      </QuestionMark>
    </QuestionMarkChip>
  );
};

// 공용 Accordion 디자인이 확정되면 shared component로 전환할 수 있습니다.
const MatchingCriteriaAccordion = ({
  defaultOpen = false,
}: {
  defaultOpen?: boolean;
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  return (
    <CriteriaSection>
      <CriteriaHeaderButton
        aria-controls={contentId}
        aria-expanded={isOpen}
        type="button"
        onClick={handleToggle}
      >
        <Text color="text.secondary" font="heading-s-sb">
          매칭기준
        </Text>
        <ChevronIcon $isOpen={isOpen}>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="chevron-right-lined"
            size={20}
          />
        </ChevronIcon>
      </CriteriaHeaderButton>

      <CriteriaPanel
        aria-hidden={!isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        id={contentId}
        inert={!isOpen ? true : undefined}
      >
        <CriteriaPanelInner>
          <CriteriaContent>
            <CriteriaCard aria-label="러너 유형별 매칭 기준">
              {MATCHING_CRITERIA_COLUMNS.map((column) => (
                <CriteriaColumn key={column.type}>
                  <CriteriaColumnHeader color="text.primary" font="detail-m-sb">
                    {column.title}
                  </CriteriaColumnHeader>
                  <CriteriaList aria-label={`${column.title} 매칭 기준`}>
                    {column.items.map((criterion) => (
                      <CriteriaItem key={criterion.group}>
                        <CriteriaGroupLetter $group={criterion.group}>
                          {criterion.group}
                        </CriteriaGroupLetter>
                        <CriteriaValue color="text.secondary" font="detail-m-r">
                          {criterion.value}
                        </CriteriaValue>
                      </CriteriaItem>
                    ))}
                  </CriteriaList>
                </CriteriaColumn>
              ))}
            </CriteriaCard>

            <CriteriaNotes>
              {MATCHING_CRITERIA_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </CriteriaNotes>
          </CriteriaContent>
        </CriteriaPanelInner>
      </CriteriaPanel>
    </CriteriaSection>
  );
};

type CriteriaGroup = Extract<RunningGroup, 'A' | 'B' | 'C' | 'D' | 'E'>;

const MATCHING_CRITERIA: Array<{
  group: CriteriaGroup;
  guide: string;
  vi: string;
}> = [
  { group: 'A', vi: '~50분', guide: '~45분' },
  { group: 'B', vi: '51~56분', guide: '46~52분' },
  { group: 'C', vi: '57~65분', guide: '53~59분' },
  { group: 'D', vi: '66분~', guide: '60분~' },
  { group: 'E', vi: '기록 없음', guide: '기록 없음' },
];

const MATCHING_CRITERIA_COLUMNS = [
  {
    type: 'vi',
    title: '시각장애러너',
    items: MATCHING_CRITERIA.map(({ group, vi }) => ({
      group,
      value: vi,
    })),
  },
  {
    type: 'guide',
    title: '가이드러너',
    items: MATCHING_CRITERIA.map(({ group, guide }) => ({
      group,
      value: guide,
    })),
  },
] as const;

const MATCHING_CRITERIA_NOTES = [
  '클래스 참여 시, 배정된 팀을 기준으로 파트너 매칭이 이루어지며, 함께 운동하시던 파트너와 다시 함께 훈련을 희망하신다면 우선적으로 매칭 합니다.',
  '일반적으로 가이드러너가 시각장애러너보다 1.5배 빠른 조깅이 가능한 경우 안정된 훈련이 가능합니다.',
  '미성년자 러너의 경우, 서브 파트너 주자로 성인 러너(보호자 가능)와 함께 될 수 있으면 동성 파트너로만 매칭합니다.',
  '미리 매칭이 공지 되었을지라도 상황에 따라 현장에서 변동될 수 있습니다.',
];

const CRITERIA_GROUP_COLOR_KEY = {
  A: 'team-a',
  B: 'team-b',
  C: 'team-c',
  D: 'team-d',
  E: 'team-e',
} as const;

const getCriteriaGroupColor = (theme: AppTheme, group: CriteriaGroup) => {
  return theme.color.profile[CRITERIA_GROUP_COLOR_KEY[group]];
};

const PanelRoot = styled.section({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const ResultsSection = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing['2xl']}`,
  boxSizing: 'border-box',
}));

const MyPartnerCard = styled.article(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing['3xl'],
  width: '100%',
  minWidth: 0,
  padding: theme.spacing.xl,
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.elevated,
  boxSizing: 'border-box',
}));

const PartnerList = styled.div(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: theme.spacing.md,
  justifyContent: 'flex-end',
  minWidth: 0,
}));

const PartnerItem = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing.md,
  minWidth: 0,
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
  padding: theme.spacing.xl,
  borderRadius: theme.radius.xl,
  backgroundColor: theme.color.bg.elevated,
}));

const GroupHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
}));

const MatchingRows = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const MatchingRowItem = styled.div({
  minWidth: 0,
});

const MatchingRowVisual = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  alignItems: 'stretch',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const ParticipantSlot = styled.div<{ $variant: ParticipantSlotVariant }>(
  ({ $variant, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: theme.pxToRem(48),
    padding: theme.spacing.lg,
    border: $variant === 'unmatched'
      ? `${theme.pxToRem(1.2)} dashed ${theme.color.border.strong}`
      : `${theme.pxToRem(1.2)} solid transparent`,
    borderRadius: theme.radius.lg,
    backgroundColor:
      $variant === 'unmatched'
        ? theme.color.bg.surface
        : theme.color.bg.subtle,
    boxSizing: 'border-box',
  }),
);

const GuideList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const LinkIconCircle = styled.span(({ theme }) => ({
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

const QuestionMarkChip = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.pxToRem(24),
  height: theme.pxToRem(24),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg['dim-soft'],
  overflow: 'hidden',
  flexShrink: 0,
}));

const QuestionMark = styled(Text)({
  textAlign: 'center',
});

const SectionDivider = styled.div(({ theme }) => ({
  width: '100%',
  height: theme.spacing.lg,
  backgroundColor: theme.color.border.subtle,
}));

const CriteriaSection = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const CriteriaHeaderButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.lg,
  width: '100%',
  minHeight: theme.pxToRem(68),
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.xs}`,
  },
}));

const ChevronIcon = styled.span<{ $isOpen: boolean }>(({ $isOpen }) => ({
  display: 'inline-flex',
  transition: 'transform 180ms ease-out',
  transform: $isOpen ? 'rotate(90deg)' : 'rotate(0deg)',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const CriteriaPanel = styled.div({
  display: 'grid',
  gridTemplateRows: '0fr',
  opacity: 0,
  overflow: 'hidden',
  visibility: 'hidden',
  transition:
    'grid-template-rows 180ms ease-out, opacity 180ms ease-out, visibility 0ms linear 180ms',

  '&[data-state="open"]': {
    gridTemplateRows: '1fr',
    opacity: 1,
    visibility: 'visible',
    transition:
      'grid-template-rows 180ms ease-out, opacity 180ms ease-out, visibility 0ms linear 0ms',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const CriteriaPanelInner = styled.div({
  minHeight: 0,
  overflow: 'hidden',
});

const CriteriaContent = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  padding: `${theme.spacing.none} ${theme.spacing.xl}`,
}));

const CriteriaCard = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing.xs,
  alignItems: 'start',
  width: '100%',
  padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing['3xl']}`,
  borderRadius: theme.radius.xl,
  backgroundColor: theme.color.bg.elevated,
  boxSizing: 'border-box',
}));

const CriteriaColumn = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  minWidth: 0,
}));

const CriteriaColumnHeader = styled(Text)(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing.lg} ${theme.spacing.none}`,
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

const CriteriaList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing.xl,
  margin: 0,
  padding: `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing.none} ${theme.spacing.md}`,
  listStyle: 'none',
}));

const CriteriaItem = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const CriteriaGroupLetter = styled.span<{ $group: CriteriaGroup }>(
  ({ $group, theme }) => {
    const typography = theme.typography['body-l-b'];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: getCriteriaGroupColor(theme, $group),
      width: theme.pxToRem(20),
      height: theme.pxToRem(20),
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
    };
  },
);

const CriteriaValue = styled(Text)({
  whiteSpace: 'nowrap',
});

const CriteriaNotes = styled.ul(({ theme }) => {
  const typography = theme.typography['detail-m-r'];

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    margin: 0,
    paddingInlineStart: theme.spacing['2xl'],
    color: theme.color.text.tertiary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    wordBreak: 'keep-all',
    overflowWrap: 'anywhere',
  };
});
