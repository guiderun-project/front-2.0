import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';

import { BottomSheet } from '@/components/BottomSheet';
import { HiddenText } from '@/components/HiddenText';
import { Icon } from '@/components/Icon';
import { useFieldErrorAnnouncement } from '@/components/Input/useFieldErrorAnnouncement';
import { Text } from '@/components/Text';

import type { SelectOption, SelectOptions, SelectProps } from './Select.types';

const DEFAULT_CONFIRM_TEXT = '확인';
const SELECT_TRIGGER_ICON_SIZE = 24;
const SELECT_CHECK_ICON_SIZE = 24;
const SELECT_TRIGGER_CONTENT_HEIGHT = 40;
const SELECT_TRIGGER_FILLED_LABEL_TOP = -2;
const SELECT_TRIGGER_VALUE_TOP = 21;
const REQUIRED_LABEL_TEXT = '(필수)';

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
  required = false,
  sheetTitle,
  triggerRef,
  value,
}: SelectProps<TValue>): ReactElement => {
  const reactId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<TValue | undefined>(value);
  const selectedOption = findSelectedOption(options, value);
  const activeValue = confirmable ? pendingValue : value;
  const isConfirmDisabled = pendingValue === undefined || pendingValue === value;
  const hasError = Boolean(errorText);
  const errorId = `${reactId}-error`;
  const triggerBaseAccessibleName = ariaLabel ?? label;
  const triggerRequiredAccessibleName = required
    ? `${triggerBaseAccessibleName} ${REQUIRED_LABEL_TEXT}`
    : triggerBaseAccessibleName;
  const triggerAccessibleName = selectedOption
    ? `${triggerRequiredAccessibleName}, 현재 선택: ${selectedOption.srLabel ?? selectedOption.label}`
    : triggerRequiredAccessibleName;
  // 오류 메시지는 조건부로 삽입되어 등장 시점이 낭독되지 않으므로, 상시
  // 마운트된 라이브 리전 미러로 안내한다. JSX 오류 메시지는 렌더마다 참조가
  // 바뀌어 반복 낭독을 유발할 수 있으므로 문자열/숫자만 안내하는 가드,
  // rAF 기반 재낭독 보장, 검증-포커스 흐름(트리거로 포커스가 이동해 와
  // describedby가 낭독하는 경우)의 미러 생략은 Input과 공용인
  // useFieldErrorAnnouncement가 맡는다.
  const announcedError = useFieldErrorAnnouncement(errorText, rootRef);

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
      <SelectRoot ref={rootRef} data-error={hasError || undefined}>
        {renderTrigger ? (
          renderTrigger({
            open: handleOpen,
            isOpen: open,
            selectedOption,
            value,
            disabled,
            hasError,
            errorId,
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
                {required ? <HiddenText>{REQUIRED_LABEL_TEXT}</HiddenText> : null}
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
          <SelectErrorMessage id={errorId}>
            {errorText}
          </SelectErrorMessage>
        ) : null}
        <HiddenText role="alert">{announcedError}</HiddenText>
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
  const listRef = useRef<HTMLDivElement>(null);
  // 단일 선택 의미는 radiogroup/radio + aria-checked로 전달하고, APG 라디오
  // 그룹 패턴의 키보드 계약(roving tabindex + 방향키 포커스 이동)을 함께
  // 제공한다. 선택된 옵션(없거나 비활성이면 첫 활성 옵션)만 탭 정지점이 된다.
  const selectedIndex = options.findIndex(
    (option) => option.value === value && !option.disabled,
  );
  const tabbableIndex =
    selectedIndex !== -1
      ? selectedIndex
      : options.findIndex((option) => !option.disabled);

  // SelectCardGroup과 달리 방향키에서 onChange를 호출하지 않는다(선택이
  // 포커스를 따라가지 않음). 비확인형 모드에서는 onChange가 시트를 닫으므로
  // 첫 방향키 입력에 시트가 닫혀 버리기 때문이다. 방향키는 포커스만 옮기고
  // 선택은 Enter/Space(버튼 클릭)로 확정한다.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;

    if (delta === 0) {
      return;
    }

    const radios = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]:not(:disabled)',
    );

    if (!radios || radios.length === 0) {
      return;
    }

    const currentIndex = Array.prototype.indexOf.call(radios, event.target);

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();
    radios[(currentIndex + delta + radios.length) % radios.length].focus();
  };

  return (
    <SelectCheckListRoot
      ref={listRef}
      aria-label={ariaLabel}
      role="radiogroup"
      onKeyDown={handleKeyDown}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <SelectOptionButton
            key={option.value}
            $selected={isSelected}
            aria-checked={isSelected}
            aria-disabled={option.disabled || undefined}
            aria-label={option.srLabel}
            disabled={option.disabled}
            role="radio"
            tabIndex={index === tabbableIndex ? 0 : -1}
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
