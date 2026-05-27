import { useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { CheckBox, Icon, IconButton, Text, type IconButtonShape, type IconName } from '@/components';
import {
  colorModeCssVariables,
  type ColorMode,
  type ColorToken,
  type TypographyToken,
} from '@/styles/tokens';

const ICON_SIZES = [24, 20, 16, 12] as const;

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
  { icon: 'check-lined', color: 'text.brand' },
  { icon: 'chevron-down-lined' },
  { icon: 'chevron-left-lined' },
  { icon: 'chevron-right-lined' },
  { icon: 'chevron-up-lined' },
  { icon: 'delete-lined', color: 'text.danger' },
  { icon: 'download-lined', color: 'icon.secondary' },
  { icon: 'edit-lined', color: 'icon.secondary' },
  { icon: 'help-circle-filled', color: 'bg.brand' },
  { icon: 'home-filled' },
  { icon: 'home-lined' },
  { icon: 'link-lined', color: 'text.brand' },
  { icon: 'list-filled' },
  { icon: 'list-lined' },
  { icon: 'more-vertical-lined' },
  { icon: 'plus-lined', color: 'text.brand' },
  { icon: 'search-lined' },
  { icon: 'share-lined', color: 'icon.secondary' },
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

type CodeExample = {
  label: string;
  code: string;
};

export const HomePage = () => {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState(false);

  const handleToggleColorMode = () => {
    setColorMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <Page $colorMode={colorMode} data-color-mode={colorMode}>
      <Header>
        <HeaderCopy>
          <Text as="h1" font="heading-l-b">
            Components
          </Text>
          <Text color="text.secondary" font="body-s-r">
            Shared UI primitives currently available in the app.
          </Text>
        </HeaderCopy>
        <ThemeToggle type="button" onClick={handleToggleColorMode}>
          {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
        </ThemeToggle>
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

const Page = styled.main<{ $colorMode: ColorMode }>`
  ${({ $colorMode }) => getModeVariables($colorMode)}
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.default};
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
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
