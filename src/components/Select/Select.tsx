import { useId, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet } from '@/components/BottomSheet';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';

import type { SelectOption, SelectOptions, SelectProps } from './Select.types';

const DEFAULT_CONFIRM_TEXT = '확인';
const SELECT_TRIGGER_ICON_SIZE = 24;
const SELECT_CHECK_ICON_SIZE = 24;
const SELECT_TRIGGER_CONTENT_HEIGHT = 40;
const SELECT_TRIGGER_FILLED_LABEL_TOP = -2;
const SELECT_TRIGGER_VALUE_TOP = 21;

type SelectCheckListProps<TValue extends string> = {
  options: SelectOptions<TValue>;
  value?: TValue;
  ariaLabel?: string;
  onChange: (value: TValue) => void;
};

export const Select = <TValue extends string = string>({
  ariaLabel,
  confirmable = false,
  confirmText = DEFAULT_CONFIRM_TEXT,
  disabled = false,
  errorText,
  isBackdropCloseDisabled,
  isEscapeCloseDisabled,
  label,
  maxHeight,
  onChange,
  options,
  placeholder,
  renderTrigger,
  sheetTitle,
  triggerRef,
  value,
}: SelectProps<TValue>): ReactElement => {
  const reactId = useId();
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<TValue | undefined>(value);
  const selectedOption = findSelectedOption(options, value);
  const activeValue = confirmable ? pendingValue : value;
  const isConfirmDisabled = pendingValue === undefined || pendingValue === value;
  const hasError = Boolean(errorText);
  const errorId = `${reactId}-error`;
  const triggerAccessibleName = selectedOption
    ? `${ariaLabel ?? label}, 현재 선택: ${selectedOption.label}`
    : ariaLabel ?? label;

  const handleOpen = () => {
    if (disabled) {
      return;
    }

    setPendingValue(value);
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      handleOpen();
      return;
    }

    setPendingValue(value);
    setOpen(false);
  };

  const handleOptionChange = (nextValue: TValue) => {
    if (confirmable) {
      setPendingValue(nextValue);
      return;
    }

    setPendingValue(nextValue);
    onChange(nextValue);
    setOpen(false);
  };

  const handleConfirm = () => {
    if (pendingValue === undefined || pendingValue === value) {
      return;
    }

    onChange(pendingValue);
    setOpen(false);
  };

  return (
    <>
      <SelectRoot data-error={hasError || undefined}>
        {renderTrigger ? (
          renderTrigger({
            open: handleOpen,
            isOpen: open,
            selectedOption,
            value,
            disabled,
          })
        ) : (
          <SelectTrigger
            ref={triggerRef}
            aria-describedby={hasError ? errorId : undefined}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={hasError || undefined}
            aria-label={triggerAccessibleName}
            disabled={disabled}
            type="button"
            onClick={handleOpen}
          >
            <SelectTriggerContent data-filled={selectedOption ? 'true' : undefined}>
              <SelectTriggerLabel>
                {selectedOption ? label : placeholder ?? label}
              </SelectTriggerLabel>
              <SelectTriggerValue
                aria-hidden={selectedOption ? undefined : true}
                color="text.primary"
                font="heading-s-m"
              >
                {selectedOption?.label ?? ''}
              </SelectTriggerValue>
            </SelectTriggerContent>
            <Icon
              aria-hidden={true}
              color={disabled ? 'icon.disabled' : 'icon.secondary'}
              icon="chevron-down-lined"
              size={SELECT_TRIGGER_ICON_SIZE}
            />
          </SelectTrigger>
        )}
        {hasError ? (
          <SelectErrorMessage id={errorId} role="alert">
            {errorText}
          </SelectErrorMessage>
        ) : null}
      </SelectRoot>

      <BottomSheet
        footer={
          confirmable ? (
            <ConfirmButton disabled={isConfirmDisabled} type="button" onClick={handleConfirm}>
              {confirmText}
            </ConfirmButton>
          ) : undefined
        }
        isBackdropCloseDisabled={isBackdropCloseDisabled}
        isEscapeCloseDisabled={isEscapeCloseDisabled}
        maxHeight={maxHeight}
        open={open}
        topBarTitle={sheetTitle}
        onOpenChange={handleOpenChange}
      >
        <SelectCheckList
          ariaLabel={typeof sheetTitle === 'string' ? `${sheetTitle} 옵션` : undefined}
          options={options}
          value={activeValue}
          onChange={handleOptionChange}
        />
      </BottomSheet>
    </>
  );
};

const SelectCheckList = <TValue extends string>({
  ariaLabel,
  onChange,
  options,
  value,
}: SelectCheckListProps<TValue>): ReactElement => {
  return (
    <SelectCheckListRoot aria-label={ariaLabel} role="listbox">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <SelectOptionButton
            key={option.value}
            $selected={isSelected}
            aria-disabled={option.disabled || undefined}
            aria-selected={isSelected}
            disabled={option.disabled}
            role="option"
            type="button"
            onClick={() => onChange(option.value)}
          >
            <SelectOptionText>
              <Text color="text.primary" font={isSelected ? 'body-l-sb' : 'body-l-m'}>
                {option.label}
              </Text>
              {option.description ? (
                <Text color="text.secondary" font="body-s-m">
                  {option.description}
                </Text>
              ) : null}
            </SelectOptionText>
            <SelectCheckIcon $selected={isSelected} aria-hidden="true">
              <Icon
                color="icon.brand"
                icon="check-thick-lined"
                size={SELECT_CHECK_ICON_SIZE}
              />
            </SelectCheckIcon>
          </SelectOptionButton>
        );
      })}
    </SelectCheckListRoot>
  );
};

const findSelectedOption = <TValue extends string>(
  options: SelectOptions<TValue>,
  value?: TValue,
): SelectOption<TValue> | undefined => {
  return options.find((option) => option.value === value);
};

const SelectRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

// TODO: 기본 트리거 디자인은 추후 디자인 변경에 맞춰 조정될 수 있습니다.
const SelectTrigger = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(74)};
  gap: ${({ theme }) => theme.spacing.s};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.color.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.default};
  cursor: pointer;
  text-align: left;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    opacity 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.border.strong};
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  [data-error='true'] & {
    border-color: ${({ theme }) => theme.color.border.danger};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.color.border.danger};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const SelectTriggerContent = styled.span`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s};
  min-height: ${({ theme }) => theme.pxToRem(SELECT_TRIGGER_CONTENT_HEIGHT)};
  min-width: 0;
`;

const SelectTriggerLabel = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.color.text.tertiary};
  font-family: ${({ theme }) => theme.typography['heading-s-m'].fontFamily};
  font-size: ${({ theme }) => theme.typography['heading-s-m'].fontSize};
  font-weight: ${({ theme }) => theme.typography['heading-s-m'].fontWeight};
  letter-spacing: ${({ theme }) => theme.typography['heading-s-m'].letterSpacing};
  line-height: ${({ theme }) => theme.typography['heading-s-m'].lineHeight};
  text-overflow: ellipsis;
  transform: translateY(-50%) scale(1);
  transform-origin: left center;
  transition:
    font-size 120ms ease,
    line-height 120ms ease,
    top 120ms ease,
    color 120ms ease,
    transform 120ms ease;
  white-space: nowrap;

  [data-filled='true'] & {
    top: ${({ theme }) => theme.pxToRem(SELECT_TRIGGER_FILLED_LABEL_TOP)};
    color: ${({ theme }) => theme.color.text.tertiary};
    font-family: ${({ theme }) => theme.typography['detail-m-m'].fontFamily};
    font-size: ${({ theme }) => theme.typography['detail-m-m'].fontSize};
    font-weight: ${({ theme }) => theme.typography['detail-m-m'].fontWeight};
    letter-spacing: ${({ theme }) => theme.typography['detail-m-m'].letterSpacing};
    line-height: ${({ theme }) => theme.typography['detail-m-m'].lineHeight};
    transform: translateY(0);
    transform-origin: left top;
  }

  [data-error='true'] & {
    color: ${({ theme }) => theme.color.text.danger};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 120ms ease;
  }
`;

const SelectTriggerValue = styled(Text)`
  position: absolute;
  right: 0;
  top: ${({ theme }) => theme.pxToRem(SELECT_TRIGGER_VALUE_TOP)};
  left: 0;
  min-width: 0;
  overflow: hidden;
  opacity: 0;
  text-overflow: ellipsis;
  transform: translateY(${({ theme }) => theme.spacing.xs});
  transition:
    opacity 120ms ease,
    transform 120ms ease;
  white-space: nowrap;

  [data-filled='true'] & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 120ms ease;
  }
`;

const SelectErrorMessage = styled.p`
  margin: 0;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.color.text.danger};
  font-family: ${({ theme }) => theme.typography['detail-m-m'].fontFamily};
  font-size: ${({ theme }) => theme.typography['detail-m-m'].fontSize};
  font-weight: ${({ theme }) => theme.typography['detail-m-m'].fontWeight};
  letter-spacing: ${({ theme }) => theme.typography['detail-m-m'].letterSpacing};
  line-height: ${({ theme }) => theme.typography['detail-m-m'].lineHeight};
`;

const SelectCheckListRoot = styled.div`
  display: grid;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.none} ${theme.spacing.none} ${theme.spacing['3xl']}`};
`;

const SelectOptionButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(58)};
  gap: ${({ theme }) => theme.pxToRem(10)};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['2xl']}`};
  border: 0;
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ $selected, theme }) =>
    $selected ? theme.color.bg['brand-soft'] : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition:
    background-color 160ms ease,
    opacity 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ $selected, theme }) =>
      $selected ? theme.color.bg['brand-soft'] : theme.color.bg.subtle};
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => `-${theme.spacing.sm}`};
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

const SelectOptionText = styled.span`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  word-break: break-word;
`;

const SelectCheckIcon = styled.span<{ $selected: boolean }>`
  display: grid;
  flex: 0 0 auto;
  width: ${({ theme }) => theme.pxToRem(SELECT_CHECK_ICON_SIZE)};
  height: ${({ theme }) => theme.pxToRem(SELECT_CHECK_ICON_SIZE)};
  place-items: center;
  opacity: ${({ $selected }) => ($selected ? 1 : 0)};
  transform: ${({ $selected }) => ($selected ? 'scale(1)' : 'scale(0.72)')};
  transition:
    opacity 140ms ease-out,
    transform 160ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: opacity 100ms ease-out;
  }
`;

const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ theme }) => theme.pxToRem(54)};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border: 1px solid ${({ theme }) => theme.color.border.brand};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.text.inverse};
  background: ${({ disabled, theme }) =>
    disabled ? theme.color.bg['brand-soft2'] : theme.color.bg['brand-primary']};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ theme }) => theme.typography['body-l-b']}
  transition:
    opacity 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }

  &:active:not(:disabled) {
    opacity: 0.8;
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;
