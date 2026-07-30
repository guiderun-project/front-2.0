import type { ReactElement } from "react";
import { useId } from "react";

import styled from "@emotion/styled";

import { Button } from "@/components/Button";
import { HiddenText } from "@/components/HiddenText";

import { Input } from "./Input";
import type { TimerInputProps } from "./Input.types";
import { INFO_TYPOGRAPHY, typographyStyle } from "./fieldStyles";

export const TimerInput = ({
  timerText,
  timerLabel = "남은 시간",
  confirmLabel = "확인",
  confirmLevel = "primary",
  confirmStatus = "default",
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
          <Button
            disabled={confirmDisabled}
            level={confirmLevel}
            onClick={onConfirm}
            size="s"
            status={confirmStatus}
            type="button"
          >
            {confirmLabel}
          </Button>
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
