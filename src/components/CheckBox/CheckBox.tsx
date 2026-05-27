import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';

const CHECKBOX_SIZE = 24;
const CHECKBOX_ICON_SIZE = 16;

export type CheckBoxProps = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'type'>;

export const CheckBox = ({ className, disabled, ...props }: CheckBoxProps): ReactElement => {
  return (
    <CheckBoxRoot className={className}>
      <CheckBoxInput disabled={disabled} type="checkbox" {...props} />
      <CheckBoxVisual aria-hidden="true">
        <CheckIconWrap>
          <Icon aria-hidden={true} color="text.inverse" icon="check-lined" size={CHECKBOX_ICON_SIZE} />
        </CheckIconWrap>
      </CheckBoxVisual>
    </CheckBoxRoot>
  );
};

const CheckBoxRoot = styled.span`
  position: relative;
  display: inline-grid;
  flex: 0 0 auto;
  width: ${({ theme }) => theme.pxToRem(CHECKBOX_SIZE)};
  height: ${({ theme }) => theme.pxToRem(CHECKBOX_SIZE)};
  place-items: center;
  vertical-align: middle;
`;

const CheckBoxInput = styled.input`
  position: absolute;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.control};
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  opacity: 0;
  touch-action: manipulation;

  &:checked + span {
    --checkbox-icon-opacity: 1;
    --checkbox-icon-scale: 1;

    border-color: ${({ theme }) => theme.color.bg.brand};
    background-color: ${({ theme }) => theme.color.bg.brand};
  }

  &:active:not(:disabled) + span {
    transform: scale(0.96);
  }

  &:focus-visible + span {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:disabled + span {
    cursor: not-allowed;
    opacity: 0.48;
  }

  @media (prefers-reduced-motion: reduce) {
    &:active:not(:disabled) + span {
      transform: none;
    }
  }
`;

const CheckBoxVisual = styled.span`
  --checkbox-icon-opacity: 0;
  --checkbox-icon-scale: 0.65;

  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border: 1.2px solid ${({ theme }) => theme.color.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  pointer-events: none;
  transition:
    background-color 120ms ease-out,
    border-color 120ms ease-out,
    opacity 120ms ease-out,
    transform 70ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition:
      background-color 120ms ease-out,
      border-color 120ms ease-out,
      opacity 100ms ease-out;
  }
`;

const CheckIconWrap = styled.span`
  display: grid;
  place-items: center;
  opacity: var(--checkbox-icon-opacity);
  transform: scale(var(--checkbox-icon-scale));
  transition:
    opacity 100ms ease-out,
    transform 120ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: opacity 100ms ease-out;
  }
`;
