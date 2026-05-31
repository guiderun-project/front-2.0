import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

import styled from '@emotion/styled';

import { Button } from './Button';
import type { ButtonGroupProps, ButtonGroupRatio } from './Button.types';

type ButtonGroupStyleProps = {
  $ratio: ButtonGroupRatio;
};

const BUTTON_GROUP_FLEX_GROW = {
  '50:50': [1, 1],
  '35:65': [35, 65],
} as const;

const isButtonElement = (child: ReactNode): child is ReactElement =>
  isValidElement(child) && child.type === Button;

const ButtonGroupRoot = ({
  children,
  ratio = '50:50',
  ...props
}: ButtonGroupProps): ReactElement | null => {
  const buttons = Children.toArray(children).filter(isButtonElement);
  const buttonCount = buttons.length;

  if (buttonCount < 1 || buttonCount > 2) {
    return null;
  }

  return (
    <ButtonGroupContainer $ratio={ratio} {...props}>
      {buttons.map((button, index) => {
        const grow =
          buttonCount === 2 && ratio !== '100:100' ? BUTTON_GROUP_FLEX_GROW[ratio][index] : 1;

        return (
          <ButtonGroupItem key={button.key ?? index} $grow={grow}>
            {button}
          </ButtonGroupItem>
        );
      })}
    </ButtonGroupContainer>
  );
};

const ButtonGroupContainer = styled.div<ButtonGroupStyleProps>(
  ({ $ratio, theme }) => ({
    display: 'flex',
    flexDirection: $ratio === '100:100' ? 'column' : 'row',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    paddingInline: theme.spacing['2xl'],
    gap: theme.spacing.md,

    '& > div > button': {
      boxSizing: 'border-box',
      width: '100%',
      minWidth: 0,
    },
  }),
);

const ButtonGroupItem = styled.div<{ $grow: number }>(({ $grow }) => ({
  flex: `${$grow} 1 0`,
  width: '100%',
  minWidth: 0,
}));

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Button });
