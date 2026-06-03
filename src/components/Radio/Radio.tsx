import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';

const RADIO_HIT_AREA_SIZE = 24;
const RADIO_VISUAL_SIZE = 22;
const RADIO_ICON_SIZE = 16;

type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'type'>;

export const Radio = ({ className, disabled, ...props }: RadioProps): ReactElement => {
  return (
    <RadioRoot className={className}>
      <RadioInput disabled={disabled} type="radio" {...props} />
      <RadioVisual aria-hidden="true">
        <RadioIconWrap>
          <Icon aria-hidden={true} color="icon.inverse" icon="check-thick-lined" size={RADIO_ICON_SIZE} />
        </RadioIconWrap>
      </RadioVisual>
    </RadioRoot>
  );
};

const RadioRoot = styled.span`
  position: relative;
  display: inline-grid;
  flex: 0 0 auto;
  width: ${({ theme }) => theme.pxToRem(RADIO_HIT_AREA_SIZE)};
  height: ${({ theme }) => theme.pxToRem(RADIO_HIT_AREA_SIZE)};
  place-items: center;
  vertical-align: middle;
`;

const RadioInput = styled.input`
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
    --radio-icon-opacity: 1;
    --radio-icon-scale: 1;

    border-color: ${({ theme }) => theme.color.bg['brand-primary']};
    background-color: ${({ theme }) => theme.color.bg['brand-primary']};
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

const RadioVisual = styled.span`
  --radio-icon-opacity: 0;
  --radio-icon-scale: 0.65;

  display: grid;
  width: ${({ theme }) => theme.pxToRem(RADIO_VISUAL_SIZE)};
  height: ${({ theme }) => theme.pxToRem(RADIO_VISUAL_SIZE)};
  place-items: center;
  border: 1.32px solid ${({ theme }) => theme.color.border.default};
  border-radius: ${({ theme }) => theme.radius.full};
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

const RadioIconWrap = styled.span`
  display: grid;
  place-items: center;
  opacity: var(--radio-icon-opacity);
  transform: scale(var(--radio-icon-scale));
  transition:
    opacity 100ms ease-out,
    transform 120ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: opacity 100ms ease-out;
  }
`;
