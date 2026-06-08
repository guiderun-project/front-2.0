import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import styled from "@emotion/styled";

import {
  Badge,
  BottomSheet,
  Button,
  ButtonGroup,
  CheckBox,
  ColorModeToggle,
  CONFIRM_POPUP_VARIANT,
  ConfirmPopup,
  Filter,
  HiddenText,
  Icon,
  IconButton,
  Input,
  PageLayout,
  Pagination,
  Radio,
  RunnerTypeAvatar,
  Select,
  Tabs,
  Text,
  type ButtonGroupRatio,
  type ButtonLevel,
  type ButtonSize,
  type ButtonStatus,
  Textarea,
  TimeInput,
  TimerInput,
  TopNavigation,
  type IconButtonShape,
  type IconName,
  type PageLayoutBackground,
  type SelectOptions,
  type TimeValue,
} from "@/components";
import { type ColorToken, type TypographyToken } from "@/styles/tokens";

const ICON_SIZES = [24, 20, 16, 12] as const;

type PageBackgroundOption = {
  background: PageLayoutBackground;
  label: string;
};

const COLOR_BACKGROUND_OPTIONS: ReadonlyArray<PageBackgroundOption> = [
  { background: "bg.default", label: "Default" },
  { background: "bg.subtle", label: "Subtle" },
  { background: "bg.surface", label: "Surface" },
  { background: "bg.brand-soft", label: "Brand soft" },
];

const GRADIENT_BACKGROUND_OPTIONS: ReadonlyArray<PageBackgroundOption> = [
  { background: "gradient.bg.subtle", label: "Subtle" },
  { background: "gradient.bg.brand-main", label: "Brand main" },
  { background: "gradient.bg.brand-event", label: "Brand event" },
];

const BUTTON_SIZE_EXAMPLES: ReadonlyArray<{ label: string; size: ButtonSize }> =
  [
    { label: "S", size: "s" },
    { label: "M", size: "m" },
    { label: "L", size: "l" },
  ];

const BUTTON_LEVEL_EXAMPLES: ReadonlyArray<ButtonLevel> = [
  "primary",
  "secondary",
  "line-type",
  "quaternary",
];

const BUTTON_STATUS_EXAMPLES: ReadonlyArray<{
  disabled?: boolean;
  label: string;
  status: ButtonStatus;
}> = [
  { label: "Default", status: "default" },
  { label: "Selected", status: "selected" },
  { label: "Pressed", status: "pressed" },
  { disabled: true, label: "Disabled", status: "disabled" },
];

const BUTTON_CODE_EXAMPLES = [
  {
    label: "Basic usage",
    code: `<Button level="primary" size="m">
  확인
</Button>`,
  },
  {
    label: "With icon",
    code: `<Button
  level="secondary"
  size="s"
  leftIcon={{ icon: 'plus-lined' }}
>
  추가
</Button>`,
  },
  {
    label: "State",
    code: `<Button
  disabled
  level="primary"
  size="l"
  status="disabled"
>
  확인
</Button>`,
  },
  {
    label: "Full width",
    code: `<Button fullWidth size="l">
  신청하기
</Button>`,
  },
] as const;

const TOP_NAVIGATION_CODE_EXAMPLES = [
  {
    label: "left / title / right",
    code: `<TopNavigation
  left={{ icon: 'chevron-left-lined', ariaLabel: '뒤로가기' }}
  title="제목"
  titleAs="h2"
  right={[
    { icon: 'delete-lined', ariaLabel: '닫기' },
    { icon: 'share-lined', ariaLabel: '공유하기' },
    { icon: 'more-vertical-lined', ariaLabel: '더보기' },
  ]}
/>`,
  },
] as const;

const BUTTON_GROUP_EXAMPLES: ReadonlyArray<{
  buttons: ReadonlyArray<{
    label: string;
    level?: ButtonLevel;
  }>;
  description: string;
  label: string;
  ratio?: ButtonGroupRatio;
}> = [
  {
    buttons: [{ label: "로그인하기" }],
    description: "count 1",
    label: "Single",
  },
  {
    buttons: [{ label: "아니요", level: "secondary" }, { label: "로그인하기" }],
    description: "2 buttons / 50:50",
    label: "50:50",
    ratio: "50:50",
  },
  {
    buttons: [{ label: "아니요", level: "secondary" }, { label: "로그인하기" }],
    description: "2 buttons / 35:65",
    label: "35:65",
    ratio: "35:65",
  },
  {
    buttons: [{ label: "아니요", level: "secondary" }, { label: "로그인하기" }],
    description: "2 buttons / vertical",
    label: "100:100",
    ratio: "100:100",
  },
] as const;

const BUTTON_GROUP_CODE_EXAMPLES = [
  {
    label: "Ratio",
    code: `<ButtonGroup ratio="35:65">
  <ButtonGroup.Button level="secondary" size="m">아니요</ButtonGroup.Button>
  <ButtonGroup.Button size="m">로그인하기</ButtonGroup.Button>
</ButtonGroup>`,
  },
  {
    label: "Vertical",
    code: `<ButtonGroup ratio="100:100">
  <ButtonGroup.Button level="secondary" size="m">아니요</ButtonGroup.Button>
  <ButtonGroup.Button size="m">로그인하기</ButtonGroup.Button>
</ButtonGroup>`,
  },
] as const;

const FIXED_BOTTOM_CTA_CODE_EXAMPLES = [
  {
    label: "Single button",
    code: `<FixedBottomCta>
  <ButtonGroup>
    <ButtonGroup.Button size="l">신청하기</ButtonGroup.Button>
  </ButtonGroup>
</FixedBottomCta>`,
  },
  {
    label: "Two columns",
    code: `<FixedBottomCta>
  <ButtonGroup ratio="50:50">
    <ButtonGroup.Button level="secondary" size="l">취소</ButtonGroup.Button>
    <ButtonGroup.Button size="l">신청하기</ButtonGroup.Button>
  </ButtonGroup>
</FixedBottomCta>`,
  },
  {
    label: "Two rows",
    code: `<FixedBottomCta>
  <ButtonGroup ratio="100:100">
    <ButtonGroup.Button level="secondary" size="l">장바구니</ButtonGroup.Button>
    <ButtonGroup.Button size="l">바로 신청</ButtonGroup.Button>
  </ButtonGroup>
</FixedBottomCta>`,
  },
] as const;

const TEXT_EXAMPLES: ReadonlyArray<{
  font: TypographyToken;
  label: string;
  sample: string;
}> = [
  { font: "display-l", label: "display-l", sample: "GuideRun" },
  { font: "heading-l-b", label: "heading-l-b", sample: "Heading Large Bold" },
  {
    font: "heading-l-sb",
    label: "heading-l-sb",
    sample: "Heading Large Semibold",
  },
  { font: "heading-m-b", label: "heading-m-b", sample: "Heading Medium Bold" },
  {
    font: "heading-m-sb",
    label: "heading-m-sb",
    sample: "Heading Medium Semibold",
  },
  {
    font: "heading-m-m",
    label: "heading-m-m",
    sample: "Heading Medium Medium",
  },
  {
    font: "heading-m-r",
    label: "heading-m-r",
    sample: "Heading Medium Regular",
  },
  {
    font: "heading-s-sb",
    label: "heading-s-sb",
    sample: "Heading Small Semibold",
  },
  { font: "heading-s-m", label: "heading-s-m", sample: "Heading Small Medium" },
  { font: "body-l-b", label: "body-l-b", sample: "Body Large Bold" },
  { font: "body-l-sb", label: "body-l-sb", sample: "Body Large Semibold" },
  { font: "body-l-m", label: "body-l-m", sample: "Body Large Medium" },
  { font: "body-m-sb", label: "body-m-sb", sample: "Body Medium Semibold" },
  { font: "body-m-m", label: "body-m-m", sample: "Body Medium Medium" },
  { font: "body-s-sb", label: "body-s-sb", sample: "Body Small Semibold" },
  { font: "body-s-m", label: "body-s-m", sample: "Body Small Medium" },
  { font: "body-s-r", label: "body-s-r", sample: "Body Small Regular" },
  {
    font: "detail-m-sb",
    label: "detail-m-sb",
    sample: "Detail Medium Semibold",
  },
  { font: "detail-m-m", label: "detail-m-m", sample: "Detail Medium Medium" },
  { font: "detail-m-r", label: "detail-m-r", sample: "Detail Medium Regular" },
  {
    font: "detail-s-sb",
    label: "detail-s-sb",
    sample: "Detail Small Semibold",
  },
  { font: "detail-s-r", label: "detail-s-r", sample: "Detail Small Regular" },
];

const TEXT_CODE_EXAMPLES = [
  {
    label: "Heading",
    code: `<Text as="h1" font="heading-l-b">
  Components
</Text>`,
  },
  {
    label: "Secondary copy",
    code: `<Text color="text.secondary" font="body-s-r">
  Shared UI primitives currently available in the app.
</Text>`,
  },
] as const;

const BADGE_SOFT_TONE_EXAMPLES = [
  { label: "Neutral", tone: "gray" },
  { label: "Orange", tone: "orange" },
  { label: "Blue", tone: "blue" },
  { label: "Violet", tone: "violet" },
  { label: "Green", tone: "green" },
  { label: "Cyan", tone: "cyan" },
  { label: "Cyan", tone: "cyan2" },
] as const;

const BADGE_SOLID_TONE_EXAMPLES = [
  { label: "Neutral", tone: "gray" },
  { label: "Cyan", tone: "cyan" },
] as const;

const BADGE_CODE_EXAMPLES = [
  {
    label: "Soft",
    code: `<Badge tone="orange" size="m">
  Orange
</Badge>`,
  },
  {
    label: "Solid",
    code: `<Badge variant="solid" tone="cyan">
  Cyan
</Badge>`,
  },
] as const;

const ICON_EXAMPLES: ReadonlyArray<{ icon: IconName; color?: ColorToken }> = [
  { icon: "alert-circle-filled", color: "icon.secondary" },
  { icon: "calendar-lined", color: "icon.secondary" },
  { icon: "check-lined", color: "text.brand" },
  { icon: "chevron-down-lined" },
  { icon: "chevron-left-lined" },
  { icon: "chevron-right-lined" },
  { icon: "chevron-up-lined" },
  { icon: "delete-filled", color: "text.danger" },
  { icon: "delete-lined", color: "text.danger" },
  { icon: "download-lined", color: "icon.secondary" },
  { icon: "edit-lined", color: "icon.secondary" },
  { icon: "help-circle-filled", color: "bg.brand-primary" },
  { icon: "home-filled" },
  { icon: "home-lined" },
  { icon: "link-lined", color: "text.brand" },
  { icon: "list-filled" },
  { icon: "list-lined" },
  { icon: "map-lined", color: "text.brand" },
  { icon: "more-vertical-lined" },
  { icon: "plus-lined", color: "text.brand" },
  { icon: "search-lined" },
  { icon: "share-lined", color: "icon.secondary" },
  { icon: "shuffle-lined", color: "icon.secondary" },
  { icon: "sort-lined", color: "icon.secondary" },
  { icon: "trash-lined", color: "text.danger" },
  { icon: "user-filled" },
  { icon: "user-lined" },
  { icon: "user-x-lined", color: "text.danger" },
];

const ICON_CODE_EXAMPLES = [
  {
    label: "Default",
    code: `<Icon icon="home-filled" />`,
  },
  {
    label: "Size and color",
    code: `<Icon
  icon="trash-lined"
  size={24}
  color="text.danger"
/>`,
  },
] as const;

const ICON_BUTTON_EXAMPLES: ReadonlyArray<{
  ariaLabel: string;
  background?: ColorToken;
  color?: ColorToken;
  disabled?: boolean;
  icon: IconName;
  iconSize?: number;
  label: string;
  shape?: IconButtonShape;
  size?: number;
}> = [
  {
    ariaLabel: "닫기",
    background: "bg.elevated",
    icon: "delete-lined",
    iconSize: 24,
    label: "48 round",
    shape: "round",
    size: 48,
  },
  {
    ariaLabel: "뒤로가기",
    icon: "chevron-left-lined",
    iconSize: 24,
    label: "24 bare",
  },
  {
    ariaLabel: "검색",
    background: "bg.brand-soft",
    color: "text.brand",
    icon: "search-lined",
    iconSize: 18,
    label: "32 brand soft",
    size: 32,
  },
  {
    ariaLabel: "추가",
    background: "bg.brand-primary",
    color: "text.inverse",
    icon: "plus-lined",
    iconSize: 20,
    label: "40 brand primary",
    shape: "round",
    size: 40,
  },
  {
    ariaLabel: "편집",
    background: "bg.surface",
    color: "icon.secondary",
    icon: "edit-lined",
    iconSize: 20,
    label: "36 surface",
    size: 36,
  },
  {
    ariaLabel: "공유",
    background: "bg.brand-soft2",
    color: "text.brand",
    icon: "share-lined",
    iconSize: 18,
    label: "32 round",
    shape: "round",
    size: 32,
  },
  {
    ariaLabel: "완료",
    background: "text.primary",
    color: "text.inverse",
    icon: "check-lined",
    iconSize: 18,
    label: "36 contrast",
    shape: "round",
    size: 36,
  },
  {
    ariaLabel: "메뉴",
    icon: "more-vertical-lined",
    iconSize: 24,
    label: "24 menu",
  },
  {
    ariaLabel: "다운로드",
    background: "bg.elevated",
    color: "icon.secondary",
    icon: "download-lined",
    iconSize: 22,
    label: "44 elevated",
    shape: "round",
    size: 44,
  },
  {
    ariaLabel: "삭제",
    background: "bg.surface",
    color: "text.danger",
    icon: "trash-lined",
    iconSize: 20,
    label: "40 danger",
    size: 40,
  },
  {
    ariaLabel: "회원 제외",
    color: "text.danger",
    disabled: true,
    icon: "user-x-lined",
    iconSize: 24,
    label: "disabled",
  },
];

const ICON_BUTTON_CODE_EXAMPLES = [
  {
    label: "Bare action",
    code: `<IconButton
  icon="chevron-left-lined"
  iconSize={24}
  aria-label="뒤로가기"
/>`,
  },
  {
    label: "Round action",
    code: `<IconButton
  icon="plus-lined"
  size={40}
  iconSize={20}
  color="text.inverse"
  background="bg.brand-primary"
  shape="round"
  aria-label="추가"
/>`,
  },
] as const;

const COLOR_MODE_TOGGLE_CODE_EXAMPLES = [
  {
    label: "Default",
    code: `<ColorModeToggle />`,
  },
  {
    label: "Disabled",
    code: `<ColorModeToggle disabled />`,
  },
] as const;

const RUNNER_TYPE_AVATAR_SIZES = [
  { label: "S / 18px", size: "s" },
  { label: "M / 24px", size: "m" },
  { label: "XL / 72px", size: "xl" },
] as const;

const RUNNER_TYPE_AVATAR_EXAMPLES = [
  { label: "시각장애러너", type: "vi" },
  { label: "가이드러너", type: "guide" },
] as const;

const RUNNER_TYPE_AVATAR_CODE_EXAMPLES = [
  {
    label: "Default size",
    code: `<RunnerTypeAvatar type="vi" />`,
  },
  {
    label: "XL guide",
    code: `<RunnerTypeAvatar type="guide" size="xl" />`,
  },
] as const;

const CHECKBOX_EXAMPLES: ReadonlyArray<{
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
}> = [
  { label: "Unchecked" },
  { defaultChecked: true, label: "Checked" },
  { disabled: true, label: "Disabled unchecked" },
  { defaultChecked: true, disabled: true, label: "Disabled checked" },
];

const CHECKBOX_CODE_EXAMPLES = [
  {
    label: "Label wrapper",
    code: `<label>
  <CheckBox checked={checked} onChange={handleChange} />
  <Text>전체 동의</Text>
</label>`,
  },
  {
    label: "Standalone",
    code: `<CheckBox
  aria-label="공지 선택"
  checked={checked}
  onChange={handleChange}
/>`,
  },
] as const;

const RADIO_EXAMPLES: ReadonlyArray<{
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
  value: string;
}> = [
  { label: "Unchecked", value: "unchecked" },
  { defaultChecked: true, label: "Checked", value: "checked" },
  { disabled: true, label: "Disabled unchecked", value: "disabled-unchecked" },
  {
    defaultChecked: true,
    disabled: true,
    label: "Disabled checked",
    value: "disabled-checked",
  },
];

const RADIO_SAMPLE_OPTIONS = [
  { label: "오전 러닝", value: "morning" },
  { label: "저녁 러닝", value: "evening" },
] as const;

type RadioSampleValue = (typeof RADIO_SAMPLE_OPTIONS)[number]["value"];

const ignoreRadioExampleChange = () => undefined;

const RADIO_CODE_EXAMPLES = [
  {
    label: "Radio group",
    code: `<fieldset>
  <legend>러닝 시간</legend>
  <label>
    <Radio
      name="runningTime"
      value="morning"
      checked={selectedValue === 'morning'}
      onChange={handleChange}
    />
    <Text>오전 러닝</Text>
  </label>
</fieldset>`,
  },
  {
    label: "Standalone",
    code: `<Radio
  aria-label="오전 러닝 선택"
  name="runningTime"
  value="morning"
  checked={selectedValue === 'morning'}
  onChange={handleChange}
/>`,
  },
] as const;

const TABS_EQUAL_ITEMS = [
  {
    id: "all",
    label: "전체",
    title: "전체 러닝",
    description: "신청 가능 여부와 관계없이 모든 러닝을 보여줍니다.",
  },
  {
    id: "recruiting",
    label: "모집중",
    title: "모집중 러닝",
    description: "지금 참가 신청을 받을 수 있는 러닝만 모아봅니다.",
  },
  {
    id: "closed",
    label: "마감",
    title: "마감된 러닝",
    description: "모집이 마감되었거나 종료된 러닝을 확인합니다.",
  },
] as const;

const TABS_SCROLLABLE_ITEMS = [
  { id: "week-1", label: "1주차", title: "1주차 러닝" },
  { id: "week-2", label: "2주차", title: "2주차 러닝" },
  { id: "week-3", label: "3주차", title: "3주차 러닝" },
  { id: "week-4", label: "4주차", title: "4주차 러닝" },
  { id: "week-5", label: "5주차", title: "5주차 러닝" },
  { id: "week-6", label: "6주차", title: "6주차 러닝" },
  { id: "week-7", label: "7주차", title: "7주차 러닝" },
  { id: "week-8", label: "8주차", title: "8주차 러닝" },
] as const;

const TABS_COMPACT_ITEMS = [
  {
    id: "summary",
    isDisabled: false,
    label: "요약",
    title: "요약",
    description: "중요한 운영 지표를 빠르게 확인합니다.",
  },
  {
    id: "members",
    isDisabled: false,
    label: "멤버",
    title: "멤버",
    description: "참여 멤버와 역할 정보를 확인합니다.",
  },
  {
    id: "archive",
    isDisabled: true,
    label: "보관함",
    title: "보관함",
    description: "비활성 탭은 키보드 이동과 선택 대상에서 제외됩니다.",
  },
] as const;

const TABS_KEEP_MOUNTED_ITEMS = [
  {
    id: "memo",
    label: "메모",
    title: "메모",
    placeholder: "탭을 이동해도 입력값이 유지됩니다.",
  },
  {
    id: "checklist",
    label: "체크리스트",
    title: "체크리스트",
    placeholder: "준비물을 적어보세요.",
  },
] as const;

const TABS_CODE_EXAMPLES = [
  {
    label: "Equal panels",
    code: `<Tabs
  aria-label="러닝 상태"
  selectedKey={status}
  onSelectionChange={(key) => setStatus(String(key))}
>
  <Tabs.List>
    <Tabs.Tab id="all">전체</Tabs.Tab>
    <Tabs.Tab id="recruiting">모집중</Tabs.Tab>
    <Tabs.Tab id="closed">마감</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel id="all">
      <EventList status="all" />
    </Tabs.Panel>
    <Tabs.Panel id="recruiting">
      <EventList status="recruiting" />
    </Tabs.Panel>
    <Tabs.Panel id="closed">
      <EventList status="closed" />
    </Tabs.Panel>
  </Tabs.Panels>
</Tabs>`,
  },
  {
    label: "Scrollable panels",
    code: `<Tabs
  aria-label="주차별 러닝"
  layout="scrollable"
  selectedKey={week}
  onSelectionChange={(key) => setWeek(String(key))}
>
  <Tabs.List>
    {weeks.map((week) => (
      <Tabs.Tab key={week.id} id={week.id}>
        {week.label}
      </Tabs.Tab>
    ))}
  </Tabs.List>

  <Tabs.Panels>
    {weeks.map((week) => (
      <Tabs.Panel key={week.id} id={week.id}>
        <WeekSchedule week={week.id} />
      </Tabs.Panel>
    ))}
  </Tabs.Panels>
</Tabs>`,
  },
  {
    label: "keepMounted panel",
    code: `<Tabs
  aria-label="작성 정보"
  selectedKey={section}
  onSelectionChange={(key) => setSection(String(key))}
>
  <Tabs.List>
    <Tabs.Tab id="memo">메모</Tabs.Tab>
    <Tabs.Tab id="checklist">체크리스트</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel id="memo" keepMounted>
      <MemoField />
    </Tabs.Panel>
    <Tabs.Panel id="checklist" keepMounted>
      <ChecklistField />
    </Tabs.Panel>
  </Tabs.Panels>
</Tabs>`,
  },
] as const;

type OperationType = "basic" | "group";

const OPERATION_OPTIONS: SelectOptions<OperationType> = [
  { value: "basic", label: "기본 훈련" },
  {
    value: "group",
    label: "그룹별 훈련",
    description: "대회준비 그룹과 기초보강 그룹으로 나뉘어요",
  },
];

type RecruitmentStatus = "open" | "closed";

const RECRUITMENT_STATUS_OPTIONS: SelectOptions<RecruitmentStatus> = [
  { value: "open", label: "모집중" },
  { value: "closed", label: "모집마감" },
];

type FilterSort = "recent" | "deadline" | "popular";

const FILTER_SORT_OPTIONS: SelectOptions<FilterSort> = [
  { value: "recent", label: "최근순" },
  { value: "deadline", label: "마감임박순" },
  { value: "popular", label: "인기순" },
];

type FilterCycleSort = "latest" | "oldest";

const FILTER_CYCLE_SORT_OPTIONS: SelectOptions<FilterCycleSort> = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된 순" },
];

const SELECT_CODE_EXAMPLES = [
  {
    label: "Field trigger",
    code: `type OperationType = 'basic' | 'group';

const operationOptions: SelectOptions<OperationType> = [
  { value: 'basic', label: '기본 훈련' },
  { value: 'group', label: '그룹별 훈련' },
];

<Select
  confirmable
  label="모임 운영방식"
  placeholder="모임 운영방식"
  sheetTitle="모임 운영방식"
  value={operationType}
  options={operationOptions}
  onChange={setOperationType}
/>`,
  },
  {
    label: "Immediate change",
    code: `<Select
  confirmable={false}
  label="훈련 방식"
  placeholder="훈련 방식"
  sheetTitle="훈련 방식"
  value={trainingType}
  options={operationOptions}
  onChange={setTrainingType}
/>`,
  },
  {
    label: "Custom trigger",
    code: `<Select
  confirmable
  sheetTitle="모집 상태"
  value={status}
  options={statusOptions}
  onChange={setStatus}
  renderTrigger={({ open, selectedOption, disabled }) => (
    <StatusChip type="button" disabled={disabled} onClick={open}>
      {selectedOption?.label ?? '모집중'}
    </StatusChip>
  )}
/>`,
  },
] as const;

const FILTER_CODE_EXAMPLES = [
  {
    label: "Line",
    code: `<Filter
  icon="sort-lined"
  options={sortOptions}
  sheetTitle="정렬"
  value={sort}
  onChange={setSort}
/>`,
  },
  {
    label: "Solid",
    code: `<Filter
  icon="sort-lined"
  variant="solid"
  options={sortOptions}
  sheetTitle="정렬"
  value={sort}
  onChange={setSort}
/>`,
  },
  {
    label: "Cycle",
    code: `<Filter
  icon="sort-lined"
  mode="cycle"
  options={sortOptions}
  value={sort}
  onChange={setSort}
/>`,
  },
  {
    label: "Disabled",
    code: `<Filter
  disabled
  icon="sort-lined"
  options={sortOptions}
  sheetTitle="정렬"
  value={sort}
  onChange={setSort}
/>`,
  },
] as const;

const CONFIRM_POPUP_CODE_EXAMPLES = [
  {
    label: "Default",
    code: `<ConfirmPopup
  open={open}
  subtitle="러닝 그룹"
  title="변경사항을 저장할까요?"
  description="저장하지 않으면 지금 입력한 내용이 사라져요."
  onCancel={close}
  onConfirm={save}
/>`,
  },
  {
    label: "Loading",
    code: `<ConfirmPopup
  open={open}
  title="초대장을 보낼까요?"
  confirmText="보내기"
  confirmLoading={isSending}
  onCancel={close}
  onConfirm={sendInvite}
/>`,
  },
] as const;

const INPUT_CODE_EXAMPLES = [
  {
    label: "Single-line",
    code: `<Input
  label="이름"
  placeholder="이름을 입력해주세요"
  maxLength={20}
  clearable
  value={name}
  onChange={(event) => setName(event.target.value)}
/>`,
  },
  {
    label: "Error",
    code: `<Input
  label="이름"
  placeholder="이름을 입력해주세요"
  errorText="오류 메시지"
  maxLength={20}
/>`,
  },
  {
    label: "Multi-line",
    code: `<Textarea
  label="모임 상세 내용"
  placeholder="상세 내용을 입력해주세요"
  helperText="안내 메시지"
  maxLength={100}
/>`,
  },
  {
    label: "Timer + confirm",
    code: `<TimerInput
  label="전화번호"
  placeholder="-없이 숫자만 입력"
  timerText="03:00"
  value={phone}
  onChange={(event) => setPhone(event.target.value)}
/>`,
  },
  {
    label: "Time (시:분:초)",
    code: `<TimeInput
  label="10KM 러닝기록"
  helperText="안내 메시지"
  value={time}
  onChange={setTime}
/>`,
  },
] as const;

const BOTTOM_SHEET_CODE_EXAMPLES = [
  {
    label: "Heading and footer",
    code: `<BottomSheet
  open={open}
  heading={{
    subtitle: '서브 타이틀',
    title: '타이틀을 작성해주세요',
    description: '설명을 작성해주세요',
  }}
  footer={<Button>다음</Button>}
  isBackdropCloseDisabled
  onOpenChange={setOpen}
>
  <FormContent />
</BottomSheet>`,
  },
  {
    label: "Top bar list",
    code: `<BottomSheet
  open={open}
  topBarTitle="러닝 모집 관리"
  onOpenChange={setOpen}
>
  <ActionList />
</BottomSheet>`,
  },
  {
    label: "Label only",
    code: `<BottomSheet
  open={open}
  ariaLabel="공유 옵션"
  onOpenChange={setOpen}
>
  <ShareOptions />
</BottomSheet>`,
  },
  {
    label: "Scrollable content",
    code: `<BottomSheet
  open={open}
  maxHeight="26.25rem"
  heading={{ title: '긴 콘텐츠 예시' }}
  footer={<Button>고정 Footer</Button>}
  onOpenChange={setOpen}
>
  <LongContent />
</BottomSheet>`,
  },
] as const;

const SCROLL_BOTTOM_SHEET_ITEMS = [
  "러닝 이름",
  "러닝 날짜",
  "집결 장소",
  "모집 인원",
  "러닝 거리",
  "평균 페이스",
  "준비물",
  "참가비",
  "환불 안내",
  "안전 수칙",
  "뒤풀이 여부",
  "추가 공지",
] as const;

const CONFIRM_POPUP_EXAMPLES = {
  default: {
    actionLabel: "default",
    buttonLabel: "Open default",
    confirmText: "저장",
    description: "저장하지 않으면 지금 입력한 내용이 사라져요.",
    subtitle: "러닝 그룹",
    title: "변경사항을 저장할까요?",
    variant: CONFIRM_POPUP_VARIANT.DEFAULT,
  },
  danger: {
    actionLabel: "danger",
    buttonLabel: "Open danger",
    confirmText: "삭제",
    description: "삭제한 러닝 그룹은 다시 복구할 수 없어요.",
    subtitle: "러닝 그룹 삭제",
    title: "정말 삭제할까요?",
    variant: CONFIRM_POPUP_VARIANT.DANGER,
  },
  loading: {
    actionLabel: "loading",
    buttonLabel: "Open loading",
    confirmText: "보내기",
    description: "초대 대상자에게 알림이 전송됩니다.",
    subtitle: "초대장 발송",
    title: "초대장을 보낼까요?",
    variant: CONFIRM_POPUP_VARIANT.DEFAULT,
  },
} as const;

type ConfirmPopupExample = keyof typeof CONFIRM_POPUP_EXAMPLES;

type BottomSheetExample = "heading" | "list" | "scroll";

type CodeExample = {
  label: string;
  code: string;
};

const PAGINATION_CODE_EXAMPLES = [
  {
    label: "Controlled",
    code: "<Pagination currentPage={page} totalPages={12} onChange={setPage} />",
  },
  {
    label: "Single page",
    code: "<Pagination currentPage={1} totalPages={1} onChange={setPage} />",
  },
] as const;

const useRadioSampleSelection = (
  initialValue: RadioSampleValue = RADIO_SAMPLE_OPTIONS[0].value,
) => {
  const [selectedValue, setSelectedValue] =
    useState<RadioSampleValue>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value as RadioSampleValue);
  };

  return { handleChange, selectedValue };
};

export const DesignPage = () => {
  const [pageBackground, setPageBackground] =
    useState<PageLayoutBackground>("bg.subtle");
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState(false);
  const { handleChange: handleRadioChange, selectedValue: selectedRadioValue } =
    useRadioSampleSelection();
  const [equalTabKey, setEqualTabKey] = useState("all");
  const [scrollableTabKey, setScrollableTabKey] = useState("week-4");
  const [compactTabKey, setCompactTabKey] = useState("summary");
  const [keepMountedTabKey, setKeepMountedTabKey] = useState("memo");
  const [operationType, setOperationType] = useState<OperationType>();
  const [trainingType, setTrainingType] = useState<OperationType>();
  const [recruitmentStatus, setRecruitmentStatus] =
    useState<RecruitmentStatus>("open");
  const [lineFilterSort, setLineFilterSort] = useState<FilterSort>("recent");
  const [solidFilterSort, setSolidFilterSort] = useState<FilterSort>("recent");
  const [cycleFilterSort, setCycleFilterSort] =
    useState<FilterCycleSort>("latest");
  const [paginationPage, setPaginationPage] = useState(1);
  const [activeConfirmPopup, setActiveConfirmPopup] =
    useState<ConfirmPopupExample | null>(null);
  const [activeBottomSheet, setActiveBottomSheet] =
    useState<BottomSheetExample | null>(null);
  const [isConfirmPopupLoading, setIsConfirmPopupLoading] = useState(false);
  const [lastConfirmPopupAction, setLastConfirmPopupAction] =
    useState("Last action: none");
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputTime, setInputTime] = useState<TimeValue>({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const confirmPopupLoadingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confirmPopupLoadingTimerRef.current !== null) {
        window.clearTimeout(confirmPopupLoadingTimerRef.current);
      }
    };
  }, []);

  const clearConfirmPopupLoadingTimer = () => {
    if (confirmPopupLoadingTimerRef.current === null) {
      return;
    }

    window.clearTimeout(confirmPopupLoadingTimerRef.current);
    confirmPopupLoadingTimerRef.current = null;
  };

  const handleOpenConfirmPopup = (example: ConfirmPopupExample) => {
    clearConfirmPopupLoadingTimer();
    setIsConfirmPopupLoading(false);
    setActiveConfirmPopup(example);
  };

  const handleOpenBottomSheet = (example: BottomSheetExample) => {
    setActiveBottomSheet(example);
  };

  const handleCloseBottomSheet = () => {
    setActiveBottomSheet(null);
  };

  const handleCancelConfirmPopup = () => {
    const actionLabel = activeConfirmPopup
      ? CONFIRM_POPUP_EXAMPLES[activeConfirmPopup].actionLabel
      : "popup";

    clearConfirmPopupLoadingTimer();
    setIsConfirmPopupLoading(false);
    setLastConfirmPopupAction(`Last action: ${actionLabel} canceled`);
    setActiveConfirmPopup(null);
  };

  const handleConfirmPopup = () => {
    if (!activeConfirmPopup) {
      return;
    }

    const actionLabel = CONFIRM_POPUP_EXAMPLES[activeConfirmPopup].actionLabel;

    if (activeConfirmPopup !== "loading") {
      setLastConfirmPopupAction(`Last action: ${actionLabel} confirmed`);
      setActiveConfirmPopup(null);
      return;
    }

    setIsConfirmPopupLoading(true);
    setLastConfirmPopupAction("Last action: loading started");
    clearConfirmPopupLoadingTimer();
    confirmPopupLoadingTimerRef.current = window.setTimeout(() => {
      setIsConfirmPopupLoading(false);
      setLastConfirmPopupAction(`Last action: ${actionLabel} confirmed`);
      setActiveConfirmPopup(null);
      confirmPopupLoadingTimerRef.current = null;
    }, 1200);
  };

  const activeConfirmPopupExample = activeConfirmPopup
    ? CONFIRM_POPUP_EXAMPLES[activeConfirmPopup]
    : null;

  return (
    <Page background={pageBackground}>
      <Header>
        <HeaderCopy>
          <Text as="h1" font="heading-l-b">
            Components
          </Text>
          <Text color="text.secondary" font="body-s-r">
            Shared UI primitives currently available in the app.
          </Text>
        </HeaderCopy>
        <HeaderControls>
          <ColorModeToggle />
          <BackgroundControls aria-label="Page background">
            <BackgroundOptionGroup aria-label="Color background" role="group">
              <BackgroundGroupLabel>bg</BackgroundGroupLabel>
              <BackgroundOptions>
                {COLOR_BACKGROUND_OPTIONS.map(({ background, label }) => (
                  <BackgroundOption
                    key={background}
                    aria-pressed={pageBackground === background}
                    type="button"
                    onClick={() => setPageBackground(background)}
                  >
                    {label}
                  </BackgroundOption>
                ))}
              </BackgroundOptions>
            </BackgroundOptionGroup>
            <BackgroundOptionGroup
              aria-label="Gradient background"
              role="group"
            >
              <BackgroundGroupLabel>gradient bg</BackgroundGroupLabel>
              <BackgroundOptions>
                {GRADIENT_BACKGROUND_OPTIONS.map(({ background, label }) => (
                  <BackgroundOption
                    key={background}
                    aria-pressed={pageBackground === background}
                    type="button"
                    onClick={() => setPageBackground(background)}
                  >
                    {label}
                  </BackgroundOption>
                ))}
              </BackgroundOptions>
            </BackgroundOptionGroup>
          </BackgroundControls>
        </HeaderControls>
      </Header>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            TopNavigation
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            left, title, right
          </Text>
        </SectionTitle>
        <TopNavigation
          left={{ icon: "chevron-left-lined", ariaLabel: "뒤로가기" }}
          right={[
            { icon: "delete-lined", ariaLabel: "닫기" },
            { icon: "share-lined", ariaLabel: "공유하기" },
            { icon: "more-vertical-lined", ariaLabel: "더보기" },
          ]}
          title="제목"
          titleAs="h2"
        />
        <CodeExamples examples={TOP_NAVIGATION_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Button
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Size, level, status
          </Text>
        </SectionTitle>
        <ButtonMatrixList>
          {BUTTON_SIZE_EXAMPLES.map(({ label, size }) => (
            <ButtonMatrixBlock key={size}>
              <ButtonMatrixTitle>
                <Text as="h3" font="heading-s-m">
                  Size {label}
                </Text>
                <Text color="text.tertiary" font="detail-m-r">
                  level / status
                </Text>
              </ButtonMatrixTitle>
              <ButtonMatrixTable>
                <ButtonMatrixHeader>
                  <Text color="text.tertiary" font="detail-m-m">
                    level
                  </Text>
                  {BUTTON_STATUS_EXAMPLES.map(
                    ({ label: statusLabel, status }) => (
                      <Text
                        key={status}
                        align="center"
                        color="text.tertiary"
                        font="detail-m-m"
                      >
                        {statusLabel}
                      </Text>
                    ),
                  )}
                </ButtonMatrixHeader>
                {BUTTON_LEVEL_EXAMPLES.map((level) => (
                  <ButtonMatrixRow key={level}>
                    <ButtonMatrixLabelCell>
                      <Text color="text.secondary" font="detail-m-r">
                        {level}
                      </Text>
                    </ButtonMatrixLabelCell>
                    {BUTTON_STATUS_EXAMPLES.map(({ disabled, status }) => (
                      <ButtonMatrixButtonCell key={status}>
                        <Button
                          disabled={disabled}
                          level={level}
                          size={size}
                          status={status}
                        >
                          확인
                        </Button>
                      </ButtonMatrixButtonCell>
                    ))}
                  </ButtonMatrixRow>
                ))}
              </ButtonMatrixTable>
            </ButtonMatrixBlock>
          ))}
        </ButtonMatrixList>
        <ButtonFullWidthPreview>
          <Text color="text.tertiary" font="detail-m-m">
            Full width
          </Text>
          <Button fullWidth size="l">
            신청하기
          </Button>
        </ButtonFullWidthPreview>
        <CodeExamples examples={BUTTON_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            ButtonGroup
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Count, ratio
          </Text>
        </SectionTitle>
        <ButtonGroupPreviewList>
          {BUTTON_GROUP_EXAMPLES.map(
            ({ buttons, description, label, ratio }) => (
              <ButtonGroupSample key={label}>
                <ButtonGroupSampleTitle>
                  <Text as="h3" font="heading-s-m">
                    {label}
                  </Text>
                  <Text color="text.tertiary" font="detail-m-r">
                    {description}
                  </Text>
                </ButtonGroupSampleTitle>
                <ButtonGroup ratio={ratio}>
                  {buttons.map(({ label: buttonLabel, level }) => (
                    <ButtonGroup.Button
                      key={buttonLabel}
                      level={level}
                      size="m"
                    >
                      {buttonLabel}
                    </ButtonGroup.Button>
                  ))}
                </ButtonGroup>
              </ButtonGroupSample>
            ),
          )}
        </ButtonGroupPreviewList>
        <CodeExamples examples={BUTTON_GROUP_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            FixedBottomCta
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Fixed bottom action shell
          </Text>
        </SectionTitle>
        <CodeExamples examples={FIXED_BOTTOM_CTA_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Text
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Typography tokens
          </Text>
        </SectionTitle>
        <TextList>
          {TEXT_EXAMPLES.map(({ font, label, sample }) => (
            <TextRow key={font}>
              <Text color="text.tertiary" font="detail-m-m">
                {label}
              </Text>
              <Text font={font}>{sample}</Text>
            </TextRow>
          ))}
        </TextList>
        <CodeExamples examples={TEXT_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Badge
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Soft, solid, S/M
          </Text>
        </SectionTitle>
        <BadgeShowcase>
          <BadgeGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Soft S
            </Text>
            <BadgeRow>
              {BADGE_SOFT_TONE_EXAMPLES.map(({ label, tone }) => (
                <Badge key={`soft-s-${tone}`} tone={tone}>
                  {label}
                </Badge>
              ))}
            </BadgeRow>
          </BadgeGroup>
          <BadgeGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Soft M
            </Text>
            <BadgeRow>
              {BADGE_SOFT_TONE_EXAMPLES.map(({ label, tone }) => (
                <Badge key={`soft-m-${tone}`} size="m" tone={tone}>
                  {label}
                </Badge>
              ))}
            </BadgeRow>
          </BadgeGroup>
          <BadgeGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Solid S
            </Text>
            <BadgeRow>
              {BADGE_SOLID_TONE_EXAMPLES.map(({ label, tone }) => (
                <Badge key={`solid-s-${tone}`} tone={tone} variant="solid">
                  {label}
                </Badge>
              ))}
            </BadgeRow>
          </BadgeGroup>
          <BadgeGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Solid M
            </Text>
            <BadgeRow>
              {BADGE_SOLID_TONE_EXAMPLES.map(({ label, tone }) => (
                <Badge
                  key={`solid-m-${tone}`}
                  size="m"
                  tone={tone}
                  variant="solid"
                >
                  {label}
                </Badge>
              ))}
            </BadgeRow>
          </BadgeGroup>
        </BadgeShowcase>
        <CodeExamples examples={BADGE_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Select
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Field trigger, custom trigger, confirm, immediate
          </Text>
        </SectionTitle>
        <SelectSampleGrid>
          <SelectSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Default field trigger
            </Text>
            <Select
              confirmable
              label="모임 운영방식"
              options={OPERATION_OPTIONS}
              placeholder="모임 운영방식"
              sheetTitle="모임 운영방식"
              value={operationType}
              onChange={setOperationType}
            />
          </SelectSampleItem>
          <SelectSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Immediate field trigger
            </Text>
            <Select
              confirmable={false}
              label="훈련 방식"
              options={OPERATION_OPTIONS}
              placeholder="훈련 방식"
              sheetTitle="훈련 방식"
              value={trainingType}
              onChange={setTrainingType}
            />
          </SelectSampleItem>
          <SelectSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Custom chip trigger
            </Text>
            <Select
              confirmable
              options={RECRUITMENT_STATUS_OPTIONS}
              sheetTitle="모집 상태"
              value={recruitmentStatus}
              renderTrigger={({ disabled, open, selectedOption }) => (
                <StatusChip disabled={disabled} type="button" onClick={open}>
                  <Text as="span" color="text.brand" font="body-s-sb">
                    {selectedOption?.label ?? "모집중"}
                  </Text>
                  <Icon
                    aria-hidden={true}
                    color="text.brand"
                    icon="chevron-down-lined"
                    size={16}
                  />
                </StatusChip>
              )}
              onChange={setRecruitmentStatus}
            />
          </SelectSampleItem>
        </SelectSampleGrid>
        <CodeExamples examples={SELECT_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Filter
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Line, solid, cycle, disabled
          </Text>
        </SectionTitle>
        <FilterSampleGrid>
          <FilterSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Line
            </Text>
            <Filter
              icon="sort-lined"
              options={FILTER_SORT_OPTIONS}
              sheetTitle="정렬"
              value={lineFilterSort}
              onChange={setLineFilterSort}
            />
          </FilterSampleItem>
          <FilterSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Solid
            </Text>
            <Filter
              icon="sort-lined"
              options={FILTER_SORT_OPTIONS}
              sheetTitle="정렬"
              value={solidFilterSort}
              variant="solid"
              onChange={setSolidFilterSort}
            />
          </FilterSampleItem>
          <FilterSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Cycle
            </Text>
            <Filter
              icon="sort-lined"
              mode="cycle"
              options={FILTER_CYCLE_SORT_OPTIONS}
              value={cycleFilterSort}
              onChange={setCycleFilterSort}
            />
          </FilterSampleItem>
          <FilterSampleItem>
            <Text color="text.secondary" font="detail-m-r">
              Disabled
            </Text>
            <Filter
              disabled
              icon="sort-lined"
              options={FILTER_SORT_OPTIONS}
              sheetTitle="정렬"
              value="popular"
              onChange={setLineFilterSort}
            />
          </FilterSampleItem>
        </FilterSampleGrid>
        <CodeExamples examples={FILTER_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Icon
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            24 / 20 / 16 / 12
          </Text>
        </SectionTitle>
        <IconTable>
          <IconTableHeader>
            <Text color="text.tertiary" font="detail-m-m">
              Name
            </Text>
            {ICON_SIZES.map((size) => (
              <Text
                key={size}
                align="center"
                color="text.tertiary"
                font="detail-m-m"
              >
                {size}px
              </Text>
            ))}
          </IconTableHeader>
          {ICON_EXAMPLES.map(({ color, icon }) => (
            <IconTableRow key={icon}>
              <Text color="text.secondary" font="detail-m-r">
                {icon}
              </Text>
              {ICON_SIZES.map((size) => (
                <IconCell key={`${icon}-${size}`}>
                  <Icon color={color} icon={icon} size={size} />
                </IconCell>
              ))}
            </IconTableRow>
          ))}
        </IconTable>
        <CodeExamples examples={ICON_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            IconButton
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Size, icon color, background, shape, disabled
          </Text>
        </SectionTitle>
        <IconButtonGrid>
          {ICON_BUTTON_EXAMPLES.map(
            ({
              ariaLabel,
              background,
              color,
              disabled,
              icon,
              iconSize,
              label,
              shape,
              size,
            }) => (
              <IconButtonSample key={label + icon}>
                <IconButton
                  aria-label={ariaLabel}
                  background={background}
                  color={color}
                  disabled={disabled}
                  icon={icon}
                  iconSize={iconSize}
                  shape={shape}
                  size={size}
                />
                <Text color="text.secondary" font="detail-m-r">
                  {label}
                </Text>
              </IconButtonSample>
            ),
          )}
        </IconButtonGrid>
        <CodeExamples examples={ICON_BUTTON_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            ColorModeToggle
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Light / dark, disabled
          </Text>
        </SectionTitle>
        <ColorModeToggleShowcase>
          <ColorModeToggle />
          <ColorModeToggle disabled />
        </ColorModeToggleShowcase>
        <CodeExamples examples={COLOR_MODE_TOGGLE_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            RunnerTypeAvatar
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            VI / Guide, S / M / XL
          </Text>
        </SectionTitle>
        <RunnerTypeAvatarTable>
          <RunnerTypeAvatarTableHeader>
            <Text color="text.tertiary" font="detail-m-m">
              Type
            </Text>
            {RUNNER_TYPE_AVATAR_SIZES.map(({ label, size }) => (
              <Text
                key={size}
                align="center"
                color="text.tertiary"
                font="detail-m-m"
              >
                {label}
              </Text>
            ))}
          </RunnerTypeAvatarTableHeader>
          {RUNNER_TYPE_AVATAR_EXAMPLES.map(({ label, type }) => (
            <RunnerTypeAvatarTableRow key={type}>
              <Text color="text.secondary" font="detail-m-r">
                {label}
              </Text>
              {RUNNER_TYPE_AVATAR_SIZES.map(({ size }) => (
                <RunnerTypeAvatarCell key={`${type}-${size}`}>
                  <RunnerTypeAvatar size={size} type={type} />
                </RunnerTypeAvatarCell>
              ))}
            </RunnerTypeAvatarTableRow>
          ))}
        </RunnerTypeAvatarTable>
        <CodeExamples examples={RUNNER_TYPE_AVATAR_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            CheckBox
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Unchecked, checked, disabled
          </Text>
        </SectionTitle>
        <CheckBoxGrid>
          {CHECKBOX_EXAMPLES.map(({ defaultChecked, disabled, label }) => (
            <CheckBoxSample key={label} $disabled={disabled}>
              <CheckBox defaultChecked={defaultChecked} disabled={disabled} />
              <Text
                color={disabled ? "text.disabled" : "text.secondary"}
                font="detail-m-r"
              >
                {label}
              </Text>
            </CheckBoxSample>
          ))}
        </CheckBoxGrid>
        <InteractiveCheckBoxSample>
          <CheckBox
            checked={isCheckBoxSelected}
            onChange={(event) => setIsCheckBoxSelected(event.target.checked)}
          />
          <Text font="body-s-r">Interactive sample</Text>
        </InteractiveCheckBoxSample>
        <CodeExamples examples={CHECKBOX_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Radio
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Unchecked, checked, disabled, single selection
          </Text>
        </SectionTitle>
        <RadioGrid>
          {RADIO_EXAMPLES.map(({ defaultChecked, disabled, label, value }) => (
            <RadioSample key={value} $disabled={disabled}>
              <Radio
                checked={Boolean(defaultChecked)}
                disabled={disabled}
                name={`radio-state-${value}`}
                onChange={ignoreRadioExampleChange}
                value={value}
              />
              <Text
                color={disabled ? "text.disabled" : "text.secondary"}
                font="detail-m-r"
              >
                {label}
              </Text>
            </RadioSample>
          ))}
        </RadioGrid>
        <InteractiveRadioFieldset>
          <legend>
            <HiddenText>러닝 시간 선택 예시</HiddenText>
          </legend>
          <RadioOptionList>
            {RADIO_SAMPLE_OPTIONS.map(({ label, value }) => (
              <InteractiveRadioOption key={value}>
                <Radio
                  checked={selectedRadioValue === value}
                  name="radio-interactive-sample"
                  value={value}
                  onChange={handleRadioChange}
                />
                <Text
                  color={
                    selectedRadioValue === value
                      ? "text.primary"
                      : "text.secondary"
                  }
                  font="body-s-r"
                >
                  {label}
                </Text>
              </InteractiveRadioOption>
            ))}
          </RadioOptionList>
        </InteractiveRadioFieldset>
        <CodeExamples examples={RADIO_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Tabs
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Panels, scrollable, keepMounted
          </Text>
        </SectionTitle>
        <TabsShowcase>
          <TabsExampleGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Full width equal
            </Text>
            <Tabs
              aria-label="러닝 상태"
              selectedKey={equalTabKey}
              onSelectionChange={(key) => setEqualTabKey(String(key))}
            >
              <Tabs.List>
                {TABS_EQUAL_ITEMS.map(({ id, label }) => (
                  <Tabs.Tab id={id} key={id}>
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panels>
                {TABS_EQUAL_ITEMS.map(({ description, id, title }) => (
                  <Tabs.Panel id={id} key={id}>
                    <TabsPanelContent>
                      <Text font="body-s-m">{title}</Text>
                      <Text color="text.secondary" font="detail-m-r">
                        {description}
                      </Text>
                    </TabsPanelContent>
                  </Tabs.Panel>
                ))}
              </Tabs.Panels>
            </Tabs>
          </TabsExampleGroup>

          <TabsExampleGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Full width scrollable
            </Text>
            <Tabs
              aria-label="주차별 러닝"
              layout="scrollable"
              selectedKey={scrollableTabKey}
              onSelectionChange={(key) => setScrollableTabKey(String(key))}
            >
              <Tabs.List>
                {TABS_SCROLLABLE_ITEMS.map(({ id, label }) => (
                  <Tabs.Tab id={id} key={id}>
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panels>
                {TABS_SCROLLABLE_ITEMS.map(({ id, title }) => (
                  <Tabs.Panel id={id} key={id}>
                    <TabsPanelContent>
                      <Text font="body-s-m">{title}</Text>
                      <TabsPanelList>
                        <TabsPanelItem>
                          <Text color="text.tertiary" font="detail-m-m">
                            시간
                          </Text>
                          <Text color="text.secondary" font="detail-m-r">
                            토요일 오전 8:00
                          </Text>
                        </TabsPanelItem>
                        <TabsPanelItem>
                          <Text color="text.tertiary" font="detail-m-m">
                            코스
                          </Text>
                          <Text color="text.secondary" font="detail-m-r">
                            한강공원 5km
                          </Text>
                        </TabsPanelItem>
                      </TabsPanelList>
                    </TabsPanelContent>
                  </Tabs.Panel>
                ))}
              </Tabs.Panels>
            </Tabs>
          </TabsExampleGroup>

          <TabsExampleGroup>
            <Text color="text.tertiary" font="detail-m-m">
              Hug width and disabled
            </Text>
            <Tabs
              aria-label="운영 정보"
              fullWidth={false}
              layout="hug"
              selectedKey={compactTabKey}
              onSelectionChange={(key) => setCompactTabKey(String(key))}
            >
              <Tabs.List>
                {TABS_COMPACT_ITEMS.map(({ id, isDisabled, label }) => (
                  <Tabs.Tab id={id} isDisabled={isDisabled} key={id}>
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panels>
                {TABS_COMPACT_ITEMS.map(({ description, id, title }) => (
                  <Tabs.Panel id={id} key={id}>
                    <TabsPanelContent>
                      <Text font="body-s-m">{title}</Text>
                      <Text color="text.secondary" font="detail-m-r">
                        {description}
                      </Text>
                    </TabsPanelContent>
                  </Tabs.Panel>
                ))}
              </Tabs.Panels>
            </Tabs>
          </TabsExampleGroup>

          <TabsExampleGroup>
            <Text color="text.tertiary" font="detail-m-m">
              keepMounted panels
            </Text>
            <Tabs
              aria-label="작성 정보"
              selectedKey={keepMountedTabKey}
              onSelectionChange={(key) => setKeepMountedTabKey(String(key))}
            >
              <Tabs.List>
                {TABS_KEEP_MOUNTED_ITEMS.map(({ id, label }) => (
                  <Tabs.Tab id={id} key={id}>
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panels>
                {TABS_KEEP_MOUNTED_ITEMS.map(({ id, placeholder, title }) => (
                  <Tabs.Panel id={id} keepMounted key={id}>
                    <TabsPanelContent>
                      <Text font="body-s-m">{title}</Text>
                      <TabsDemoInput
                        aria-label={`${title} 입력`}
                        placeholder={placeholder}
                      />
                    </TabsPanelContent>
                  </Tabs.Panel>
                ))}
              </Tabs.Panels>
            </Tabs>
          </TabsExampleGroup>
        </TabsShowcase>
        <CodeExamples examples={TABS_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            ConfirmPopup
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Default, danger, loading
          </Text>
        </SectionTitle>
        <PopupSampleGrid>
          {(Object.keys(CONFIRM_POPUP_EXAMPLES) as ConfirmPopupExample[]).map(
            (example) => (
              <SampleButton
                key={example}
                type="button"
                onClick={() => handleOpenConfirmPopup(example)}
              >
                {CONFIRM_POPUP_EXAMPLES[example].buttonLabel}
              </SampleButton>
            ),
          )}
        </PopupSampleGrid>
        <Text color="text.secondary" font="body-s-r">
          {lastConfirmPopupAction}
        </Text>
        <CodeExamples examples={CONFIRM_POPUP_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Input
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Single-line, multi-line, timer, time
          </Text>
        </SectionTitle>
        <FieldList>
          <Input
            clearable
            helperText="안내 메시지"
            label="이름"
            maxLength={20}
            onChange={(event) => setInputName(event.target.value)}
            placeholder="이름을 입력해주세요"
            value={inputName}
          />
          <Input
            errorText="오류 메시지"
            label="이름"
            maxLength={20}
            placeholder="이름을 입력해주세요"
          />
          <Textarea
            helperText="안내 메시지"
            label="모임 상세 내용"
            maxLength={100}
            placeholder="상세 내용을 입력해주세요"
          />
          <TimerInput
            label="전화번호"
            onChange={(event) => setInputPhone(event.target.value)}
            placeholder="-없이 숫자만 입력"
            timerText="03:00"
            value={inputPhone}
          />
          <TimeInput
            helperText="안내 메시지"
            label="10KM 러닝기록"
            onChange={setInputTime}
            value={inputTime}
          />
        </FieldList>
        <CodeExamples examples={INPUT_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            BottomSheet
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Heading, top bar, fixed footer
          </Text>
        </SectionTitle>
        <PopupSampleGrid>
          <SampleButton
            type="button"
            onClick={() => handleOpenBottomSheet("heading")}
          >
            Open heading sheet
          </SampleButton>
          <SampleButton
            type="button"
            onClick={() => handleOpenBottomSheet("list")}
          >
            Open action list
          </SampleButton>
          <SampleButton
            type="button"
            onClick={() => handleOpenBottomSheet("scroll")}
          >
            Open scroll footer
          </SampleButton>
        </PopupSampleGrid>
        <CodeExamples examples={BOTTOM_SHEET_CODE_EXAMPLES} />
      </ShowcaseSection>

      <ShowcaseSection>
        <SectionTitle>
          <Text as="h2" font="heading-s-m">
            Pagination
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Block window, prev/next
          </Text>
        </SectionTitle>
        <PaginationSampleList>
          <PaginationSampleRow>
            <Text color="text.secondary" font="detail-m-r">
              Interactive (12p, page {paginationPage})
            </Text>
            <Pagination
              currentPage={paginationPage}
              onChange={setPaginationPage}
              totalPages={12}
            />
          </PaginationSampleRow>
          <PaginationSampleRow>
            <Text color="text.secondary" font="detail-m-r">
              1 page
            </Text>
            <Pagination currentPage={1} onChange={() => {}} totalPages={1} />
          </PaginationSampleRow>
          <PaginationSampleRow>
            <Text color="text.secondary" font="detail-m-r">
              3 pages
            </Text>
            <Pagination currentPage={1} onChange={() => {}} totalPages={3} />
          </PaginationSampleRow>
          <PaginationSampleRow>
            <Text color="text.secondary" font="detail-m-r">
              Over 5 (page 6)
            </Text>
            <Pagination currentPage={6} onChange={() => {}} totalPages={12} />
          </PaginationSampleRow>
        </PaginationSampleList>
        <CodeExamples examples={PAGINATION_CODE_EXAMPLES} />
      </ShowcaseSection>

      {activeConfirmPopupExample ? (
        <ConfirmPopup
          confirmLoading={
            activeConfirmPopup === "loading" && isConfirmPopupLoading
          }
          confirmText={activeConfirmPopupExample.confirmText}
          description={activeConfirmPopupExample.description}
          open={activeConfirmPopup !== null}
          subtitle={activeConfirmPopupExample.subtitle}
          title={activeConfirmPopupExample.title}
          variant={activeConfirmPopupExample.variant}
          onCancel={handleCancelConfirmPopup}
          onConfirm={handleConfirmPopup}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setActiveConfirmPopup(null);
            }
          }}
        />
      ) : null}

      <BottomSheet
        footer={
          <BottomSheetFooterButton
            type="button"
            onClick={handleCloseBottomSheet}
          >
            다음
          </BottomSheetFooterButton>
        }
        heading={{
          subtitle: "서브 타이틀",
          title: "타이틀을 작성해주세요",
          description: "설명을 작성해주세요",
        }}
        isBackdropCloseDisabled
        open={activeBottomSheet === "heading"}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleCloseBottomSheet();
          }
        }}
      >
        <BottomSheetFormContent>
          <DemoField aria-label="이름" placeholder="이름" />
          <DemoFieldInfo>
            <Text color="text.tertiary" font="detail-m-m">
              안내 메시지
            </Text>
            <Text color="text.tertiary" font="detail-m-r">
              <Text as="span" color="text.brand" font="detail-m-m">
                0
              </Text>
              /00자
            </Text>
          </DemoFieldInfo>
        </BottomSheetFormContent>
      </BottomSheet>

      <BottomSheet
        open={activeBottomSheet === "list"}
        topBarTitle="러닝 모집 관리"
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleCloseBottomSheet();
          }
        }}
      >
        <BottomSheetActionList aria-label="러닝 모집 관리 작업">
          <BottomSheetActionItem type="button" onClick={handleCloseBottomSheet}>
            <Icon
              aria-hidden={true}
              color="icon.secondary"
              icon="list-lined"
              size={20}
            />
            <Text font="body-m-m">모집 마감하기</Text>
          </BottomSheetActionItem>
          <BottomSheetActionItem type="button" onClick={handleCloseBottomSheet}>
            <Icon
              aria-hidden={true}
              color="icon.secondary"
              icon="edit-lined"
              size={20}
            />
            <Text font="body-m-m">모집 게시글 수정하기</Text>
          </BottomSheetActionItem>
          <BottomSheetActionItem type="button" onClick={handleCloseBottomSheet}>
            <Icon
              aria-hidden={true}
              color="text.danger"
              icon="trash-lined"
              size={20}
            />
            <Text color="text.danger" font="body-m-m">
              모집 게시글 삭제하기
            </Text>
          </BottomSheetActionItem>
          <BottomSheetActionItem type="button" onClick={handleCloseBottomSheet}>
            <Icon
              aria-hidden={true}
              color="icon.secondary"
              icon="download-lined"
              size={20}
            />
            <Text font="body-m-m">출석 인원 명단 추출</Text>
          </BottomSheetActionItem>
        </BottomSheetActionList>
      </BottomSheet>

      <BottomSheet
        footer={
          <BottomSheetFooterButton
            type="button"
            onClick={handleCloseBottomSheet}
          >
            고정 Footer
          </BottomSheetFooterButton>
        }
        heading={{
          title: "긴 콘텐츠 예시",
          description: "항목이 많아져도 하단 액션은 같은 자리에 유지됩니다.",
        }}
        maxHeight="26.25rem"
        open={activeBottomSheet === "scroll"}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleCloseBottomSheet();
          }
        }}
      >
        <BottomSheetScrollContent>
          {SCROLL_BOTTOM_SHEET_ITEMS.map((label, index) => (
            <BottomSheetScrollItem key={label}>
              <Text color="text.tertiary" font="detail-m-m">
                {String(index + 1).padStart(2, "0")}
              </Text>
              <Text font="body-m-m">{label}</Text>
            </BottomSheetScrollItem>
          ))}
        </BottomSheetScrollContent>
      </BottomSheet>
    </Page>
  );
};

const CodeExamples = ({
  examples,
}: {
  examples: ReadonlyArray<CodeExample>;
}) => (
  <CodeExampleGrid>
    {examples.map(({ code, label }) => (
      <CodeExampleItem key={label}>
        <Text color="text.tertiary" font="detail-m-m">
          {label}
        </Text>
        <CodeBlock>
          <Code>{code}</Code>
        </CodeBlock>
      </CodeExampleItem>
    ))}
  </CodeExampleGrid>
);

const Page = styled(PageLayout)`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing["3xl"]};
  padding-top: calc(
    env(safe-area-inset-top) + ${({ theme }) => theme.spacing["3xl"]}
  );
  padding-bottom: calc(
    env(safe-area-inset-bottom) + var(--app-fixed-bottom-offset, 0rem) + ${({ theme }) => theme.spacing["3xl"]}
  );
  color: ${({ theme }) => theme.color.text.primary};
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HeaderControls = styled.div`
  display: grid;
  justify-content: flex-end;
  justify-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BackgroundControls = styled.div`
  display: grid;
  justify-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BackgroundOptionGroup = styled.div`
  display: grid;
  justify-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BackgroundGroupLabel = styled.span`
  color: ${({ theme }) => theme.color.text.tertiary};
  font-family: ${({ theme }) => theme.typography["detail-m-m"].fontFamily};
  font-size: ${({ theme }) => theme.typography["detail-m-m"].fontSize};
  font-weight: ${({ theme }) => theme.typography["detail-m-m"].fontWeight};
  letter-spacing: ${({ theme }) =>
    theme.typography["detail-m-m"].letterSpacing};
  line-height: ${({ theme }) => theme.typography["detail-m-m"].lineHeight};
`;

const BackgroundOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BackgroundOption = styled.button`
  min-height: ${({ theme }) => theme.pxToRem(36)};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.secondary};
  background: ${({ theme }) => theme.color.bg.surface};
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &[aria-pressed="true"] {
    border-color: ${({ theme }) => theme.color.border.brand};
    color: ${({ theme }) => theme.color.text.brand};
    background: ${({ theme }) => theme.color.bg["brand-soft"]};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.border.default};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
`;

const ShowcaseSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.bg.subtle};
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ButtonMatrixList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ButtonMatrixBlock = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ButtonMatrixTitle = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ButtonMatrixTable = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
`;

const ButtonMatrixHeader = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(84)}, 0.75fr)
    repeat(4, minmax(${({ theme }) => theme.pxToRem(112)}, 1fr));
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: ${({ theme }) => theme.pxToRem(560)};
`;

const ButtonMatrixRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(84)}, 0.75fr)
    repeat(4, minmax(${({ theme }) => theme.pxToRem(112)}, 1fr));
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: ${({ theme }) => theme.pxToRem(560)};
  min-height: ${({ theme }) => theme.pxToRem(58)};
`;

const ButtonMatrixLabelCell = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonMatrixButtonCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.pxToRem(58)};
`;

const ButtonFullWidthPreview = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const ButtonGroupPreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${({ theme }) => theme.pxToRem(220)}), 1fr)
  );
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroupSample = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroupSampleTitle = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TextList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TextRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(
      ${({ theme }) => theme.pxToRem(140)},
      ${({ theme }) => theme.pxToRem(200)}
    )
    1fr;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xl};
  min-height: ${({ theme }) => theme.pxToRem(32)};
`;

const BadgeShowcase = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BadgeGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconTable = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
`;

const IconTableHeader = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(180)}, 1fr)
    repeat(4, ${({ theme }) => theme.pxToRem(48)});
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.pxToRem(420)};
`;

const IconTableRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(180)}, 1fr)
    repeat(4, ${({ theme }) => theme.pxToRem(48)});
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.pxToRem(420)};
  min-height: ${({ theme }) => theme.pxToRem(40)};
`;

const IconCell = styled.div`
  display: grid;
  place-items: center;
  min-height: ${({ theme }) => theme.pxToRem(32)};
`;

const IconButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const IconButtonSample = styled.div`
  display: inline-grid;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColorModeToggleShowcase = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RunnerTypeAvatarTable = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
`;

const RunnerTypeAvatarTableHeader = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(140)}, 1fr)
    repeat(3, ${({ theme }) => theme.pxToRem(96)});
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.pxToRem(440)};
`;

const RunnerTypeAvatarTableRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(${({ theme }) => theme.pxToRem(140)}, 1fr)
    repeat(3, ${({ theme }) => theme.pxToRem(96)});
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.pxToRem(440)};
  min-height: ${({ theme }) => theme.pxToRem(88)};
`;

const RunnerTypeAvatarCell = styled.div`
  display: grid;
  min-height: ${({ theme }) => theme.pxToRem(76)};
  place-items: center;
`;

const CheckBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${({ theme }) => theme.pxToRem(180)}), 1fr)
  );
  gap: ${({ theme }) => theme.spacing.md};
`;

const CheckBoxSample = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
`;

const InteractiveCheckBoxSample = styled.label`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${({ theme }) => theme.pxToRem(180)}), 1fr)
  );
  gap: ${({ theme }) => theme.spacing.md};
`;

const RadioSample = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
`;

const InteractiveRadioFieldset = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

const RadioOptionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InteractiveRadioOption = styled.label`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const TabsShowcase = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TabsExampleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const TabsPanelContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  padding: ${({ theme }) =>
    `${theme.spacing.xl} ${theme.spacing["2xl"]} ${theme.spacing.none}`};
`;

const TabsPanelList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TabsPanelItem = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TabsDemoInput = styled.input`
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(44)};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.default};
  ${({ theme }) => theme.typography["body-s-r"]}

  &::placeholder {
    color: ${({ theme }) => theme.color.text.tertiary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const PaginationSampleList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PaginationSampleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FieldList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  gap: ${({ theme }) => theme.spacing["3xl"]};
  max-width: ${({ theme }) => theme.pxToRem(335)};
`;

const PopupSampleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SelectSampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${({ theme }) => theme.pxToRem(280)}), 1fr)
  );
  align-items: start;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SelectSampleItem = styled.div`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const FilterSampleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FilterSampleItem = styled.div`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusChip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.pxToRem(36)};
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) =>
    `${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.md} ${theme.pxToRem(10)}`};
  border: 1px solid ${({ theme }) => theme.color.bg["brand-primary"]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.bg["brand-soft"]};
  cursor: pointer;
  transition:
    opacity 120ms ease,
    transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const SampleButton = styled.button`
  min-height: ${({ theme }) => theme.pxToRem(40)};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.surface};
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.color.bg.subtle};
    border-color: ${({ theme }) => theme.color.border.default};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
`;

const BottomSheetFormContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.none} ${theme.spacing["2xl"]} ${theme.spacing["3xl"]}`};
`;

const DemoField = styled.input`
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(74)};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.default};
  ${({ theme }) => theme.typography["heading-s-m"]}

  &::placeholder {
    color: ${({ theme }) => theme.color.text.tertiary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const DemoFieldInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BottomSheetFooterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(54)};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border: 1px solid ${({ theme }) => theme.color.border.brand};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.text.inverse};
  background: ${({ theme }) => theme.color.bg["brand-primary"]};
  cursor: pointer;
  ${({ theme }) => theme.typography["body-l-b"]}
  transition:
    opacity 120ms ease,
    transform 120ms ease;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
`;

const BottomSheetActionList = styled.div`
  display: grid;
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing["3xl"]}`};
`;

const BottomSheetActionItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(56)};
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing["2xl"]}`};
  border: 0;
  color: ${({ theme }) => theme.color.text.primary};
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 120ms ease,
    transform 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.color.bg.subtle};
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => `-${theme.spacing.sm}`};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
`;

const BottomSheetScrollContent = styled.div`
  display: grid;
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.none} ${theme.spacing["2xl"]} ${theme.spacing["3xl"]}`};
`;

const BottomSheetScrollItem = styled.div`
  display: flex;
  align-items: center;
  min-height: ${({ theme }) => theme.pxToRem(64)};
  gap: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};

  &:last-of-type {
    border-bottom: 0;
  }
`;

const CodeExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, ${({ theme }) => theme.pxToRem(280)}), 1fr)
  );
  gap: ${({ theme }) => theme.spacing.md};
`;

const CodeExampleItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const CodeBlock = styled.pre`
  min-width: 0;
  margin: 0;
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.bg.surface};
`;

const Code = styled.code`
  color: ${({ theme }) => theme.color.text.secondary};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: ${({ theme }) => theme.pxToRem(12)};
  line-height: 1.6;
  white-space: pre-wrap;
`;
