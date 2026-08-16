import { useId, useState, type ReactElement } from "react";

import styled from "@emotion/styled";

import { getApiErrorMessage } from "@/api/core";
import type { MatchingPartner, MatchingUser, RunningGroup } from "@/api/types";
import { HiddenText, Icon, Text } from "@/components";
import { RUNNER_TYPE_LABELS } from "@/constants";
import type { AppTheme } from "@/styles/theme";

import type {
  MatchingStatusViewModel,
  MatchingStatusViewRow,
} from "../hooks/matchingStatusViewModel";
import {
  getEventGroupDisplayLabel,
  type EventGroupLabelContext,
} from "../utils";
import { AnnouncedPanelState } from "./PanelState";
import { ProfileAvatar } from "./ProfileAvatar";
import {
  highContrastBoundary,
  HIGH_CONTRAST_SELECTOR,
} from "@/styles/highContrastStyles";

type MatchingPanelProps = {
  data?: MatchingStatusViewModel;
  error: unknown;
  eventCategory: EventGroupLabelContext["eventCategory"];
  eventType: EventGroupLabelContext["eventType"];
  isError: boolean;
  isPending: boolean;
  showMyPartnerSummary: boolean;
};

export const MatchingPanel = ({
  data,
  error,
  eventCategory,
  eventType,
  isError,
  isPending,
  showMyPartnerSummary,
}: MatchingPanelProps): ReactElement => {
  if (isPending) {
    return (
      <AnnouncedPanelState role="status">
        매칭 현황을 불러오는 중입니다.
      </AnnouncedPanelState>
    );
  }

  if (isError || !data) {
    return (
      <AnnouncedPanelState role="alert">
        {getApiErrorMessage(error, "매칭 현황을 불러오지 못했습니다.")}
      </AnnouncedPanelState>
    );
  }

  if (data.isEmpty) {
    return (
      <AnnouncedPanelState role="status">
        아직 매칭 현황이 없습니다.
      </AnnouncedPanelState>
    );
  }

  return (
    <PanelRoot aria-label="매칭 현황">
      <ResultsSection>
        {showMyPartnerSummary ? (
          <MyPartnerSummary partners={data.myPartners} />
        ) : null}

        <GroupList>
          {data.groups.map((group, index) => (
            <MatchingGroupCard
              key={group.runningGroup}
              eventCategory={eventCategory}
              eventType={eventType}
              group={group}
              hasDivider={index < data.groups.length - 1}
            />
          ))}
        </GroupList>
      </ResultsSection>

      <SectionDivider aria-hidden={true} />
      <MatchingCriteriaAccordion defaultOpen={true} />
    </PanelRoot>
  );
};

type MatchingGroupCardProps = {
  eventCategory: EventGroupLabelContext["eventCategory"];
  eventType: EventGroupLabelContext["eventType"];
  group: MatchingStatusViewModel["groups"][number];
  hasDivider: boolean;
};

const MatchingGroupCard = ({
  eventCategory,
  eventType,
  group,
  hasDivider,
}: MatchingGroupCardProps): ReactElement => {
  const groupLabel = getEventGroupDisplayLabel(
    { eventCategory, eventType },
    group.runningGroup,
  );

  return (
    <GroupCard $hasDivider={hasDivider}>
      <GroupHeading>
        <GroupHeadingText role="text">
          <Text as="span" color="text.primary" font="body-m-sb">
            {groupLabel}
          </Text>
          <Text as="span" color="text.tertiary" font="body-m-m">
            {group.totalCount}명
          </Text>
        </GroupHeadingText>
      </GroupHeading>
      <MatchingRows aria-label={`${groupLabel} 매칭 결과`} role="list">
        {group.rows.map((row) => (
          <MatchingResultRow key={row.id} row={row} />
        ))}
      </MatchingRows>
    </GroupCard>
  );
};

type MyPartnerSummaryProps = {
  partners: MatchingPartner[];
};

const MyPartnerSummary = ({
  partners,
}: MyPartnerSummaryProps): ReactElement => {
  return (
    <MyPartnerCard>
      <HiddenText>{getMyPartnerSummaryDescription(partners)}</HiddenText>
      <Text aria-hidden={true} color="text.primary" font="body-m-sb">
        내 파트너
      </Text>
      {partners.length > 0 ? (
        <PartnerList aria-hidden={true}>
          {partners.map((partner) => (
            <PartnerItem key={partner.userId}>
              <ProfileAvatar name={partner.name} type={partner.type} />
              <Text color="text.tertiary" font="detail-m-m">
                기존 {partner.defaultGroup}그룹
              </Text>
            </PartnerItem>
          ))}
        </PartnerList>
      ) : (
        <Text aria-hidden={true} color="text.tertiary" font="detail-m-m">
          아직 파트너 매칭 전이에요
        </Text>
      )}
    </MyPartnerCard>
  );
};

const getMyPartnerSummaryDescription = (partners: MatchingPartner[]) => {
  if (partners.length === 0) {
    return "내 파트너 아직 파트너 매칭 전이에요";
  }

  return `내 파트너 ${partners
    .map(
      (partner) =>
        `${RUNNER_TYPE_LABELS[partner.type]} ${partner.name} 기존 ${partner.defaultGroup}그룹`,
    )
    .join(", ")}`;
};

type MatchingResultRowProps = {
  row: MatchingStatusViewRow;
};

type ParticipantSlotVariant = "matched" | "unmatched";

const MatchingResultRow = ({ row }: MatchingResultRowProps): ReactElement => {
  return (
    <MatchingRowItem>
      <HiddenText>{getMatchingRowDescription(row)}</HiddenText>
      <MatchingRowVisual aria-hidden={true}>
        <ParticipantSlot $variant={row.vi ? "matched" : "unmatched"}>
          {row.vi ? (
            <ProfileAvatar name={row.vi.name} type={row.vi.type} />
          ) : (
            <UnmatchedSlot />
          )}
        </ParticipantSlot>

        <LinkIconCircle aria-hidden={true}>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="link-lined"
            size={16}
          />
        </LinkIconCircle>

        <ParticipantSlot
          $variant={row.guides.length > 0 ? "matched" : "unmatched"}
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

const getMatchingRowDescription = (row: MatchingStatusViewRow) => {
  if (row.vi && row.guides.length > 0) {
    return `${row.vi.name}의 가이드러너 ${formatMatchingUserNames(row.guides)}`;
  }

  if (row.vi) {
    return `시각장애러너 ${row.vi.name} 매칭되지 않음`;
  }

  if (row.guides.length > 0) {
    return `가이드러너 ${formatMatchingUserNames(row.guides)} 매칭되지 않음`;
  }

  return "시각장애러너 매칭되지 않음, 가이드러너 매칭되지 않음";
};

const formatMatchingUserNames = (users: MatchingUser[]) => {
  return users.map((user) => user.name).join(", ");
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
      {/* APG 아코디언 패턴: 제목을 헤딩 탐색(로터)에 노출하기 위해 버튼을 h2 로 감싼다. */}
      <CriteriaHeading>
        <CriteriaHeaderButton
          aria-controls={contentId}
          aria-expanded={isOpen}
          type="button"
          onClick={handleToggle}
        >
          <Text color="text.secondary" font="body-l-sb">
            매칭기준
          </Text>
          <ChevronIcon $isOpen={isOpen}>
            <Icon
              aria-hidden={true}
              color="icon.primary"
              icon="chevron-down-lined"
              size={20}
            />
          </ChevronIcon>
        </CriteriaHeaderButton>
      </CriteriaHeading>

      <CriteriaPanel
        aria-hidden={!isOpen}
        data-state={isOpen ? "open" : "closed"}
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
                        <HiddenText>
                          {`${criterion.group}팀 러닝기록 ${criterion.accessibilityValue}`}
                        </HiddenText>
                        <CriteriaItemVisual aria-hidden={true}>
                          <CriteriaGroupLetter $group={criterion.group}>
                            {criterion.group}
                          </CriteriaGroupLetter>
                          <CriteriaValue
                            color="text.secondary"
                            font="detail-m-r"
                          >
                            {criterion.value}
                          </CriteriaValue>
                        </CriteriaItemVisual>
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

type CriteriaGroup = Extract<RunningGroup, "A" | "B" | "C" | "D" | "E">;

const MATCHING_CRITERIA: Array<{
  group: CriteriaGroup;
  guide: string;
  guideAccessibilityValue: string;
  vi: string;
  viAccessibilityValue: string;
}> = [
  {
    group: "A",
    vi: "~50분",
    viAccessibilityValue: "50분 이하",
    guide: "~45분",
    guideAccessibilityValue: "45분 이하",
  },
  {
    group: "B",
    vi: "51~56분",
    viAccessibilityValue: "51분 이상 56분 이하",
    guide: "46~52분",
    guideAccessibilityValue: "46분 이상 52분 이하",
  },
  {
    group: "C",
    vi: "57~65분",
    viAccessibilityValue: "57분 이상 65분 이하",
    guide: "53~59분",
    guideAccessibilityValue: "53분 이상 59분 이하",
  },
  {
    group: "D",
    vi: "66분~",
    viAccessibilityValue: "66분 이상",
    guide: "60분~",
    guideAccessibilityValue: "60분 이상",
  },
  {
    group: "E",
    vi: "기록 없음",
    viAccessibilityValue: "기록 없음",
    guide: "기록 없음",
    guideAccessibilityValue: "기록 없음",
  },
];

const MATCHING_CRITERIA_COLUMNS = [
  {
    type: "vi",
    title: "시각장애러너",
    items: MATCHING_CRITERIA.map(({ group, vi, viAccessibilityValue }) => ({
      accessibilityValue: viAccessibilityValue,
      group,
      value: vi,
    })),
  },
  {
    type: "guide",
    title: "가이드러너",
    items: MATCHING_CRITERIA.map(
      ({ group, guide, guideAccessibilityValue }) => ({
        accessibilityValue: guideAccessibilityValue,
        group,
        value: guide,
      }),
    ),
  },
] as const;

const MATCHING_CRITERIA_NOTES = [
  "클래스 참여 시, 배정된 팀을 기준으로 파트너 매칭이 이루어지며, 함께 운동하시던 파트너와 다시 함께 훈련을 희망하신다면 우선적으로 매칭 합니다.",
  "일반적으로 가이드러너가 시각장애러너보다 1.5배 빠른 조깅이 가능한 경우 안정된 훈련이 가능합니다.",
  "미성년자 러너의 경우, 서브 파트너 주자로 성인 러너(보호자 가능)와 함께 될 수 있으면 동성 파트너로만 매칭합니다.",
  "미리 매칭이 공지 되었을지라도 상황에 따라 현장에서 변동될 수 있습니다.",
];

const CRITERIA_GROUP_COLOR_KEY = {
  A: "team-a",
  B: "team-b",
  C: "team-c",
  D: "team-d",
  E: "team-e",
} as const;

const getCriteriaGroupColor = (theme: AppTheme, group: CriteriaGroup) => {
  return theme.color.profile[CRITERIA_GROUP_COLOR_KEY[group]];
};

const PanelRoot = styled.section({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const ResultsSection = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  width: "100%",
  padding: `${theme.spacing["3xl"]} ${theme.spacing["2xl"]} ${theme.spacing["2xl"]}`,
  boxSizing: "border-box",
}));

const MyPartnerCard = styled.article(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing.lg,
  width: "100%",
  minWidth: 0,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
  borderRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.default,
  boxSizing: "border-box",
  ...highContrastBoundary(theme),
}));

const PartnerList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const PartnerItem = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const GroupList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing["2xl"],
  gap: theme.spacing["3xl"],
  borderRadius: theme.radius.xl,
  backgroundColor: theme.color.bg.elevated,
  ...highContrastBoundary(theme),
}));

const GroupCard = styled.article<{ $hasDivider: boolean }>(
  ({ $hasDivider, theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.lg,
    paddingBottom: $hasDivider ? theme.spacing["3xl"] : 0,
    borderBottom: $hasDivider ? `1px solid ${theme.color.border.subtle}` : 0,
  }),
);

const GroupHeading = styled.h2({
  display: "flex",
  margin: 0,
});

const GroupHeadingText = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing.md,
}));

const MatchingRows = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
  listStyle: "none",
}));

const MatchingRowItem = styled.li({
  minWidth: 0,
});

const MatchingRowVisual = styled.div(({ theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  alignItems: "stretch",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const ParticipantSlot = styled.div<{ $variant: ParticipantSlotVariant }>(
  ({ $variant, theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: theme.pxToRem(48),
    padding: theme.spacing.lg,
    border:
      $variant === "unmatched"
        ? `${theme.pxToRem(1.2)} dashed ${theme.color.border.strong}`
        : `${theme.pxToRem(1.2)} solid transparent`,
    borderRadius: theme.radius.lg,
    backgroundColor:
      $variant === "unmatched" ? theme.color.bg.surface : theme.color.bg.subtle,
    boxSizing: "border-box",

    [HIGH_CONTRAST_SELECTOR]: {
      borderColor:
        $variant === "unmatched"
          ? theme.color.border.strong
          : theme.color.border.default,
    },
  }),
);

const GuideList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const LinkIconCircle = styled.span(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 1,
  display: "inline-grid",
  placeItems: "center",
  width: theme.pxToRem(28),
  height: theme.pxToRem(28),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.default,
  transform: "translate(-50%, -50%)",
}));

const QuestionMarkChip = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: theme.pxToRem(24),
  height: theme.pxToRem(24),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg["dim-soft"],
  overflow: "hidden",
  flexShrink: 0,
}));

const QuestionMark = styled(Text)({
  textAlign: "center",
});

const SectionDivider = styled.div(({ theme }) => ({
  width: "100%",
  height: theme.spacing.lg,
  backgroundColor: theme.color.border.subtle,

  [HIGH_CONTRAST_SELECTOR]: {
    height: "1px",
  },
}));

const CriteriaSection = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing["4xl"]}`,
  boxSizing: "border-box",
}));

const CriteriaHeading = styled.h2({
  display: "flex",
  margin: 0,
});

const CriteriaHeaderButton = styled.button(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing.lg,
  width: "100%",
  minHeight: theme.pxToRem(68),
  padding: `${theme.spacing["3xl"]} ${theme.spacing["2xl"]}`,
  border: 0,
  backgroundColor: "transparent",
  cursor: "pointer",
  textAlign: "left",
  touchAction: "manipulation",
  WebkitTapHighlightColor: "transparent",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.xs}`,
  },
}));

const ChevronIcon = styled.span<{ $isOpen: boolean }>(({ $isOpen }) => ({
  display: "inline-flex",
  transition: "transform 180ms ease-out",
  transform: $isOpen ? "rotate(0deg)" : "rotate(180deg)",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const CriteriaPanel = styled.div({
  display: "grid",
  gridTemplateRows: "0fr",
  opacity: 0,
  overflow: "hidden",
  visibility: "hidden",
  transition:
    "grid-template-rows 180ms ease-out, opacity 180ms ease-out, visibility 0ms linear 180ms",

  '&[data-state="open"]': {
    gridTemplateRows: "1fr",
    opacity: 1,
    visibility: "visible",
    transition:
      "grid-template-rows 180ms ease-out, opacity 180ms ease-out, visibility 0ms linear 0ms",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

const CriteriaPanelInner = styled.div({
  minHeight: 0,
  overflow: "hidden",
});

const CriteriaContent = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xl,
  padding: `${theme.spacing.none} ${theme.spacing.xl}`,
}));

const CriteriaCard = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing.xs,
  alignItems: "start",
  width: "100%",
  padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing["3xl"]}`,
  borderRadius: theme.radius.xl,
  backgroundColor: theme.color.bg.elevated,
  boxSizing: "border-box",
}));

const CriteriaColumn = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing.lg,
  minWidth: 0,
}));

const CriteriaColumnHeader = styled(Text)(({ theme }) => ({
  width: "100%",
  padding: `${theme.spacing.lg} ${theme.spacing.none}`,
  textAlign: "center",
  whiteSpace: "nowrap",
}));

const CriteriaList = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing.xl,
  margin: 0,
  padding: `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing.none} ${theme.spacing.md}`,
  listStyle: "none",
}));

const CriteriaItem = styled.li(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const CriteriaItemVisual = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "flex-start",
  gap: theme.spacing.md,
  minWidth: 0,
}));

const CriteriaGroupLetter = styled.span<{ $group: CriteriaGroup }>(
  ({ $group, theme }) => {
    const typography = theme.typography["body-l-b"];

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
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
  whiteSpace: "nowrap",
});

const CriteriaNotes = styled.ul(({ theme }) => {
  const typography = theme.typography["detail-m-r"];

  return {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
    margin: 0,
    paddingInlineStart: theme.spacing["2xl"],
    color: theme.color.text.tertiary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
  };
});
