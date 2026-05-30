import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import {
  CheckBox,
  CONFIRM_POPUP_VARIANT,
  ConfirmPopup,
  Icon,
  IconButton,
  PageLayout,
  Text,
  type IconButtonShape,
  type IconName,
  type PageLayoutBackground,
} from '@/components';
import {
  colorModeCssVariables,
  type ColorMode,
  type ColorToken,
  type TypographyToken,
} from '@/styles/tokens';

const ICON_SIZES = [24, 20, 16, 12] as const;

type PageBackgroundOption = {
  background: PageLayoutBackground;
  label: string;
};

const COLOR_BACKGROUND_OPTIONS: ReadonlyArray<PageBackgroundOption> = [
  { background: 'bg.default', label: 'Default' },
  { background: 'bg.subtle', label: 'Subtle' },
  { background: 'bg.surface', label: 'Surface' },
  { background: 'bg.brand-soft', label: 'Brand soft' },
];

const GRADIENT_BACKGROUND_OPTIONS: ReadonlyArray<PageBackgroundOption> = [
  { background: 'gradient.bg.subtle', label: 'Subtle' },
  { background: 'gradient.bg.brand-main', label: 'Brand main' },
  { background: 'gradient.bg.brand-event', label: 'Brand event' },
];

const TEXT_EXAMPLES: ReadonlyArray<{ font: TypographyToken; label: string; sample: string }> = [
  { font: 'display-l', label: 'display-l', sample: 'GuideRun' },
  { font: 'heading-l-b', label: 'heading-l-b', sample: 'Heading Large Bold' },
  { font: 'heading-l-sb', label: 'heading-l-sb', sample: 'Heading Large Semibold' },
  { font: 'heading-m-b', label: 'heading-m-b', sample: 'Heading Medium Bold' },
  { font: 'heading-m-sb', label: 'heading-m-sb', sample: 'Heading Medium Semibold' },
  { font: 'heading-m-m', label: 'heading-m-m', sample: 'Heading Medium Medium' },
  { font: 'heading-m-r', label: 'heading-m-r', sample: 'Heading Medium Regular' },
  { font: 'heading-s-sb', label: 'heading-s-sb', sample: 'Heading Small Semibold' },
  { font: 'heading-s-m', label: 'heading-s-m', sample: 'Heading Small Medium' },
  { font: 'body-l-b', label: 'body-l-b', sample: 'Body Large Bold' },
  { font: 'body-l-sb', label: 'body-l-sb', sample: 'Body Large Semibold' },
  { font: 'body-l-m', label: 'body-l-m', sample: 'Body Large Medium' },
  { font: 'body-m-sb', label: 'body-m-sb', sample: 'Body Medium Semibold' },
  { font: 'body-m-m', label: 'body-m-m', sample: 'Body Medium Medium' },
  { font: 'body-s-sb', label: 'body-s-sb', sample: 'Body Small Semibold' },
  { font: 'body-s-m', label: 'body-s-m', sample: 'Body Small Medium' },
  { font: 'body-s-r', label: 'body-s-r', sample: 'Body Small Regular' },
  { font: 'detail-m-sb', label: 'detail-m-sb', sample: 'Detail Medium Semibold' },
  { font: 'detail-m-m', label: 'detail-m-m', sample: 'Detail Medium Medium' },
  { font: 'detail-m-r', label: 'detail-m-r', sample: 'Detail Medium Regular' },
  { font: 'detail-s-sb', label: 'detail-s-sb', sample: 'Detail Small Semibold' },
  { font: 'detail-s-r', label: 'detail-s-r', sample: 'Detail Small Regular' },
];

const TEXT_CODE_EXAMPLES = [
  {
    label: 'Heading',
    code: `<Text as="h1" font="heading-l-b">
  Components
</Text>`,
  },
  {
    label: 'Secondary copy',
    code: `<Text color="text.secondary" font="body-s-r">
  Shared UI primitives currently available in the app.
</Text>`,
  },
] as const;

const ICON_EXAMPLES: ReadonlyArray<{ icon: IconName; color?: ColorToken }> = [
  { icon: 'calendar-lined', color: 'icon.secondary' },
  { icon: 'check-lined', color: 'text.brand' },
  { icon: 'chevron-down-lined' },
  { icon: 'chevron-left-lined' },
  { icon: 'chevron-right-lined' },
  { icon: 'chevron-up-lined' },
  { icon: 'delete-filled', color: 'text.danger' },
  { icon: 'delete-lined', color: 'text.danger' },
  { icon: 'download-lined', color: 'icon.secondary' },
  { icon: 'edit-lined', color: 'icon.secondary' },
  { icon: 'help-circle-filled', color: 'bg.brand' },
  { icon: 'home-filled' },
  { icon: 'home-lined' },
  { icon: 'link-lined', color: 'text.brand' },
  { icon: 'list-filled' },
  { icon: 'list-lined' },
  { icon: 'map-lined', color: 'text.brand' },
  { icon: 'more-vertical-lined' },
  { icon: 'plus-lined', color: 'text.brand' },
  { icon: 'search-lined' },
  { icon: 'share-lined', color: 'icon.secondary' },
  { icon: 'shuffle-lined', color: 'icon.secondary' },
  { icon: 'trash-lined', color: 'text.danger' },
  { icon: 'user-filled' },
  { icon: 'user-lined' },
  { icon: 'user-x-lined', color: 'text.danger' },
];

const ICON_CODE_EXAMPLES = [
  {
    label: 'Default',
    code: `<Icon icon="home-filled" />`,
  },
  {
    label: 'Size and color',
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
    ariaLabel: '닫기',
    background: 'bg.elevated',
    icon: 'delete-lined',
    iconSize: 24,
    label: '48 round',
    shape: 'round',
    size: 48,
  },
  { ariaLabel: '뒤로가기', icon: 'chevron-left-lined', iconSize: 24, label: '24 bare' },
  {
    ariaLabel: '검색',
    background: 'bg.brand-weak',
    color: 'text.brand',
    icon: 'search-lined',
    iconSize: 18,
    label: '32 brand weak',
    size: 32,
  },
  {
    ariaLabel: '추가',
    background: 'bg.brand',
    color: 'text.inverse',
    icon: 'plus-lined',
    iconSize: 20,
    label: '40 brand',
    shape: 'round',
    size: 40,
  },
  {
    ariaLabel: '편집',
    background: 'bg.surface',
    color: 'icon.secondary',
    icon: 'edit-lined',
    iconSize: 20,
    label: '36 surface',
    size: 36,
  },
  {
    ariaLabel: '공유',
    background: 'bg.brand-weak2',
    color: 'text.brand',
    icon: 'share-lined',
    iconSize: 18,
    label: '32 round',
    shape: 'round',
    size: 32,
  },
  {
    ariaLabel: '완료',
    background: 'bg.inverse',
    color: 'text.inverse',
    icon: 'check-lined',
    iconSize: 18,
    label: '36 inverse',
    shape: 'round',
    size: 36,
  },
  { ariaLabel: '메뉴', icon: 'more-vertical-lined', iconSize: 24, label: '24 menu' },
  {
    ariaLabel: '다운로드',
    background: 'bg.elevated',
    color: 'icon.secondary',
    icon: 'download-lined',
    iconSize: 22,
    label: '44 elevated',
    shape: 'round',
    size: 44,
  },
  {
    ariaLabel: '삭제',
    background: 'bg.surface',
    color: 'text.danger',
    icon: 'trash-lined',
    iconSize: 20,
    label: '40 danger',
    size: 40,
  },
  {
    ariaLabel: '회원 제외',
    color: 'text.danger',
    disabled: true,
    icon: 'user-x-lined',
    iconSize: 24,
    label: 'disabled',
  },
];

const ICON_BUTTON_CODE_EXAMPLES = [
  {
    label: 'Bare action',
    code: `<IconButton
  icon="chevron-left-lined"
  iconSize={24}
  aria-label="뒤로가기"
/>`,
  },
  {
    label: 'Round action',
    code: `<IconButton
  icon="plus-lined"
  size={40}
  iconSize={20}
  color="text.inverse"
  background="bg.brand"
  shape="round"
  aria-label="추가"
/>`,
  },
] as const;

const CHECKBOX_EXAMPLES: ReadonlyArray<{
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
}> = [
  { label: 'Unchecked' },
  { defaultChecked: true, label: 'Checked' },
  { disabled: true, label: 'Disabled unchecked' },
  { defaultChecked: true, disabled: true, label: 'Disabled checked' },
];

const CHECKBOX_CODE_EXAMPLES = [
  {
    label: 'Label wrapper',
    code: `<label>
  <CheckBox checked={checked} onChange={handleChange} />
  <Text>전체 동의</Text>
</label>`,
  },
  {
    label: 'Standalone',
    code: `<CheckBox
  aria-label="공지 선택"
  checked={checked}
  onChange={handleChange}
/>`,
  },
] as const;

const CONFIRM_POPUP_CODE_EXAMPLES = [
  {
    label: 'Default',
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
    label: 'Loading',
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

const CONFIRM_POPUP_EXAMPLES = {
  default: {
    actionLabel: 'default',
    buttonLabel: 'Open default',
    confirmText: '저장',
    description: '저장하지 않으면 지금 입력한 내용이 사라져요.',
    subtitle: '러닝 그룹',
    title: '변경사항을 저장할까요?',
    variant: CONFIRM_POPUP_VARIANT.DEFAULT,
  },
  danger: {
    actionLabel: 'danger',
    buttonLabel: 'Open danger',
    confirmText: '삭제',
    description: '삭제한 러닝 그룹은 다시 복구할 수 없어요.',
    subtitle: '러닝 그룹 삭제',
    title: '정말 삭제할까요?',
    variant: CONFIRM_POPUP_VARIANT.DANGER,
  },
  loading: {
    actionLabel: 'loading',
    buttonLabel: 'Open loading',
    confirmText: '보내기',
    description: '초대 대상자에게 알림이 전송됩니다.',
    subtitle: '초대장 발송',
    title: '초대장을 보낼까요?',
    variant: CONFIRM_POPUP_VARIANT.DEFAULT,
  },
} as const;

type ConfirmPopupExample = keyof typeof CONFIRM_POPUP_EXAMPLES;

type CodeExample = {
  label: string;
  code: string;
};

export const HomePage = () => {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [pageBackground, setPageBackground] = useState<PageLayoutBackground>('bg.subtle');
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState(false);
  const [activeConfirmPopup, setActiveConfirmPopup] = useState<ConfirmPopupExample | null>(null);
  const [isConfirmPopupLoading, setIsConfirmPopupLoading] = useState(false);
  const [lastConfirmPopupAction, setLastConfirmPopupAction] = useState('Last action: none');
  const confirmPopupLoadingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const previousColorMode = root.getAttribute('data-color-mode');

    root.setAttribute('data-color-mode', colorMode);

    return () => {
      if (previousColorMode) {
        root.setAttribute('data-color-mode', previousColorMode);
        return;
      }

      root.removeAttribute('data-color-mode');
    };
  }, [colorMode]);

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

  const handleToggleColorMode = () => {
    setColorMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  const handleOpenConfirmPopup = (example: ConfirmPopupExample) => {
    clearConfirmPopupLoadingTimer();
    setIsConfirmPopupLoading(false);
    setActiveConfirmPopup(example);
  };

  const handleCancelConfirmPopup = () => {
    const actionLabel = activeConfirmPopup
      ? CONFIRM_POPUP_EXAMPLES[activeConfirmPopup].actionLabel
      : 'popup';

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

    if (activeConfirmPopup !== 'loading') {
      setLastConfirmPopupAction(`Last action: ${actionLabel} confirmed`);
      setActiveConfirmPopup(null);
      return;
    }

    setIsConfirmPopupLoading(true);
    setLastConfirmPopupAction('Last action: loading started');
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
    <Page $colorMode={colorMode} background={pageBackground} data-color-mode={colorMode}>
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
          <ThemeToggle type="button" onClick={handleToggleColorMode}>
            {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
          </ThemeToggle>
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
            <BackgroundOptionGroup aria-label="Gradient background" role="group">
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
              <Text key={size} align="center" color="text.tertiary" font="detail-m-m">
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
            ({ ariaLabel, background, color, disabled, icon, iconSize, label, shape, size }) => (
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
              <Text color={disabled ? 'text.disabled' : 'text.secondary'} font="detail-m-r">
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
            ConfirmPopup
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            Default, danger, loading
          </Text>
        </SectionTitle>
        <PopupSampleGrid>
          {(Object.keys(CONFIRM_POPUP_EXAMPLES) as ConfirmPopupExample[]).map((example) => (
            <SampleButton
              key={example}
              type="button"
              onClick={() => handleOpenConfirmPopup(example)}
            >
              {CONFIRM_POPUP_EXAMPLES[example].buttonLabel}
            </SampleButton>
          ))}
        </PopupSampleGrid>
        <Text color="text.secondary" font="body-s-r">
          {lastConfirmPopupAction}
        </Text>
        <CodeExamples examples={CONFIRM_POPUP_CODE_EXAMPLES} />
      </ShowcaseSection>

      {activeConfirmPopupExample ? (
        <ConfirmPopup
          confirmLoading={activeConfirmPopup === 'loading' && isConfirmPopupLoading}
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
    </Page>
  );
};

const CodeExamples = ({ examples }: { examples: ReadonlyArray<CodeExample> }) => (
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

const getModeVariables = (mode: ColorMode) => css`
  ${colorModeCssVariables[mode]}
`;

const Page = styled(PageLayout)<{ $colorMode: ColorMode }>`
  ${({ $colorMode }) => getModeVariables($colorMode)}
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
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

const ThemeToggle = styled.button`
  flex: 0 0 auto;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.subtle};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.bg.surface};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
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
  font-family: ${({ theme }) => theme.typography['detail-m-m'].fontFamily};
  font-size: ${({ theme }) => theme.typography['detail-m-m'].fontSize};
  font-weight: ${({ theme }) => theme.typography['detail-m-m'].fontWeight};
  letter-spacing: ${({ theme }) => theme.typography['detail-m-m'].letterSpacing};
  line-height: ${({ theme }) => theme.typography['detail-m-m'].lineHeight};
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

  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.color.border.brand};
    color: ${({ theme }) => theme.color.text.brand};
    background: ${({ theme }) => theme.color.bg['brand-soft']};
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

const TextList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TextRow = styled.div`
  display: grid;
  grid-template-columns: minmax(${({ theme }) => theme.pxToRem(140)}, ${({ theme }) => theme.pxToRem(200)}) 1fr;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xl};
  min-height: ${({ theme }) => theme.pxToRem(32)};
`;

const IconTable = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
`;

const IconTableHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(${({ theme }) => theme.pxToRem(180)}, 1fr) repeat(4, ${({ theme }) => theme.pxToRem(48)});
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: ${({ theme }) => theme.pxToRem(420)};
`;

const IconTableRow = styled.div`
  display: grid;
  grid-template-columns: minmax(${({ theme }) => theme.pxToRem(180)}, 1fr) repeat(4, ${({ theme }) => theme.pxToRem(48)});
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

const CheckBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, ${({ theme }) => theme.pxToRem(180)}), 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const CheckBoxSample = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const InteractiveCheckBoxSample = styled.label`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: ${({ theme }) => theme.pxToRem(32)};
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const PopupSampleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
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

const CodeExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, ${({ theme }) => theme.pxToRem(280)}), 1fr));
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
