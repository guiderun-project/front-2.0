import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText } from '@/components/HiddenText';
import { Icon } from '@/components/Icon';
import { Select, type SelectOption } from '@/components/Select';
import { Text } from '@/components/Text';

import type { FilterProps, FilterVariant } from './Filter.types';

const FILTER_ICON_SIZE = 16;
const DEFAULT_PLACEHOLDER = '선택';
const CYCLE_BEHAVIOR_HINT = '누르면 다음 옵션으로 바뀌어요';

type FilterTriggerButtonProps = {
  ariaLabel?: string;
  className?: string;
  disabled: boolean;
  icon: FilterProps['icon'];
  isOpen?: boolean;
  label: string;
  mode: 'sheet' | 'cycle';
  onClick: () => void;
  variant: FilterVariant;
};

export const Filter = <TValue extends string = string>(
  props: FilterProps<TValue>,
): ReactElement => {
  const {
    ariaLabel,
    className,
    disabled = false,
    icon,
    neutralValue,
    onChange,
    options,
    placeholder,
    value,
    variant = 'line',
  } = props;
  const selectedOption = findSelectedOption(options, value);
  // A neutral value ("전체") keeps its option selected in the sheet but shows
  // the placeholder (category name) on the trigger, so the applied category
  // stays identifiable.
  const isNeutral = value !== undefined && value === neutralValue;
  const triggerOption = isNeutral ? undefined : selectedOption;

  if (props.mode === 'cycle') {
    const nextOption = findNextEnabledOption(options, value);
    const isTriggerDisabled = disabled || !nextOption;
    const label = getTriggerLabel({
      placeholder,
      selectedOption: triggerOption,
    });

    const handleCycle = () => {
      if (!nextOption) {
        return;
      }

      onChange(nextOption.value);
    };

    return (
      <FilterTriggerButton
        ariaLabel={ariaLabel}
        className={className}
        disabled={isTriggerDisabled}
        icon={icon}
        label={label}
        mode="cycle"
        variant={variant}
        onClick={handleCycle}
      />
    );
  }

  return (
    <Select
      confirmable={props.confirmable}
      confirmText={props.confirmText}
      disabled={disabled}
      isBackdropCloseDisabled={props.isBackdropCloseDisabled}
      isEscapeCloseDisabled={props.isEscapeCloseDisabled}
      maxHeight={props.maxHeight}
      options={options}
      sheetTitle={props.sheetTitle}
      value={value}
      renderTrigger={({ disabled: isTriggerDisabled, isOpen, open, selectedOption }) => (
        <FilterTriggerButton
          ariaLabel={ariaLabel}
          className={className}
          disabled={isTriggerDisabled}
          icon={icon}
          isOpen={isOpen}
          label={getTriggerLabel({
            fallback: typeof props.sheetTitle === 'string' ? props.sheetTitle : undefined,
            placeholder,
            selectedOption: isNeutral ? undefined : selectedOption,
          })}
          mode="sheet"
          variant={variant}
          onClick={open}
        />
      )}
      onChange={onChange}
    />
  );
};

const FilterTriggerButton = ({
  ariaLabel,
  className,
  disabled,
  icon,
  isOpen,
  label,
  mode,
  onClick,
  variant,
}: FilterTriggerButtonProps): ReactElement => {
  const isCycle = mode === 'cycle';
  // Compose the visible label into the accessible name so screen reader users
  // hear both the filter category and the currently applied value, and the
  // visible label stays part of the name (label in name).
  const composedName = ariaLabel ? `${ariaLabel}, ${label}` : undefined;
  const accessibleName =
    composedName && isCycle ? `${composedName}, ${CYCLE_BEHAVIOR_HINT}` : composedName;

  return (
    <FilterTrigger
      $variant={variant}
      aria-expanded={mode === 'sheet' ? isOpen : undefined}
      aria-haspopup={mode === 'sheet' ? 'dialog' : undefined}
      aria-label={accessibleName}
      className={className}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <FilterLabel
        aria-atomic={isCycle ? true : undefined}
        // Cycle triggers keep focus on the button while only the label text
        // changes, so announce the new value via a polite live region.
        aria-live={isCycle ? 'polite' : undefined}
        as="span"
        color={disabled ? 'text.disabled' : 'text.secondary'}
        font="body-s-m"
      >
        {label}
      </FilterLabel>
      {isCycle && !ariaLabel ? <HiddenText>{CYCLE_BEHAVIOR_HINT}</HiddenText> : null}
      <Icon
        aria-hidden={true}
        color={disabled ? 'icon.disabled' : 'icon.secondary'}
        icon={icon}
        size={FILTER_ICON_SIZE}
      />
    </FilterTrigger>
  );
};

const findSelectedOption = <TValue extends string>(
  options: readonly SelectOption<TValue>[],
  value?: TValue,
): SelectOption<TValue> | undefined => {
  return options.find((option) => option.value === value);
};

const findNextEnabledOption = <TValue extends string>(
  options: readonly SelectOption<TValue>[],
  value?: TValue,
): SelectOption<TValue> | undefined => {
  const selectedIndex = options.findIndex((option) => option.value === value);
  const startIndex = selectedIndex >= 0 ? selectedIndex + 1 : 0;

  for (let offset = 0; offset < options.length; offset += 1) {
    const option = options[(startIndex + offset) % options.length];

    if (!option.disabled) {
      return option;
    }
  }

  return undefined;
};

const getTriggerLabel = <TValue extends string>({
  fallback,
  placeholder,
  selectedOption,
}: {
  fallback?: string;
  placeholder?: string;
  selectedOption?: SelectOption<TValue>;
}): string => {
  return selectedOption?.label ?? placeholder ?? fallback ?? DEFAULT_PLACEHOLDER;
};

const FilterTrigger = styled.button<{ $variant: FilterVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.pxToRem(37)};
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.lg}`};
  border: ${({ $variant, theme }) =>
    $variant === 'line' ? `${theme.pxToRem(1.4)} solid ${theme.color.border.default}` : 0};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.secondary};
  background: ${({ $variant, theme }) =>
    $variant === 'solid' ? theme.color.bg.subtle : 'transparent'};
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    opacity 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.border.strong};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const FilterLabel = styled(Text)`
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  word-break: break-word;
`;
