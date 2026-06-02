import type { ReactElement } from "react";
import { useId } from "react";

import styled from "@emotion/styled";

import { HiddenText } from "@/components/HiddenText";

import { Input } from "./Input";
import type { TimerInputProps } from "./Input.types";
import { INFO_TYPOGRAPHY, typographyStyle } from "./fieldStyles";

const CONFIRM_BUTTON_MIN_WIDTH = 56;
const CONFIRM_BUTTON_HEIGHT = 32;

export const TimerInput = ({
  timerText,
  timerLabel = "남은 시간",
  confirmLabel = "확인",
  onConfirm,
  confirmDisabled,
  inputMode = "numeric",
  clearable = true,
  ...inputProps
}: TimerInputProps): ReactElement => {
  const timerId = useId();
  const hasTimer = timerText != null;

  return (
    <Input
      {...inputProps}
      clearable={clearable}
      describedById={hasTimer ? timerId : undefined}
      inputMode={inputMode}
      trailing={
        <Trailing>
          {hasTimer && (
            <Timer id={timerId} role="text">
              <HiddenText>{timerLabel}</HiddenText>
              <span aria-hidden={timerLabel ? undefined : true}>
                {timerText}
              </span>
            </Timer>
          )}
          <ConfirmButton
            disabled={confirmDisabled}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </ConfirmButton>
        </Trailing>
      }
    />
  );
};

const Trailing = styled.div(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  gap: theme.spacing.md,
}));

const Timer = styled.span(({ theme }) => ({
  flexShrink: 0,
  color: theme.color.text.secondary,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));

// TEMP: inline confirm button. Replace with the shared Button component once it
// exists, keeping the same bg.brand / inverse-text styling from the design.
const ConfirmButton = styled.button(({ theme }) => ({
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  minWidth: theme.pxToRem(CONFIRM_BUTTON_MIN_WIDTH),
  height: theme.pxToRem(CONFIRM_BUTTON_HEIGHT),
  padding: `0 ${theme.spacing.md}`,
  border: 0,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg['brand-primary'],
  color: theme.color.text.inverse,
  cursor: "pointer",
  touchAction: "manipulation",
  ...typographyStyle(theme, "detail-m-sb"),
  transition: "opacity 120ms ease, transform 120ms ease",

  "@media (hover: hover)": {
    "&:hover:not(:disabled)": {
      opacity: 0.92,
    },
  },

  "&:active:not(:disabled)": {
    transform: "scale(0.97)",
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.48,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "&:active:not(:disabled)": {
      transform: "none",
    },
  },
}));
