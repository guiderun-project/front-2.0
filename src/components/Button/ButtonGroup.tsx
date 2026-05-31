import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

import styled from '@emotion/styled';

import { Button } from './Button';
import type { ButtonGroupProps, ButtonGroupRatio, ButtonProps } from './Button.types';

type ButtonGroupStyleProps = {
  $buttonCount: number;
  $ratio: ButtonGroupRatio;
};

type ButtonGroupComponent = ((props: ButtonGroupProps) => ReactElement | null) & {
  Button: typeof Button;
};

const BUTTON_GROUP_FLEX_GROW = {
  '50:50': [1, 1],
  '35:65': [35, 65],
} as const;

const isButtonElement = (child: ReactNode): child is ReactElement<ButtonProps> =>
  isValidElement<ButtonProps>(child) && child.type === Button;

const ButtonGroupRoot = ({
  children,
  level,
  ratio = '50:50',
  size = 'm',
  status,
  ...props
}: ButtonGroupProps): ReactElement | null => {
  const buttons = Children.toArray(children).filter(isButtonElement);
  const buttonCount = buttons.length;

  if (buttonCount < 1 || buttonCount > 2) {
    return null;
  }

  return (
    <ButtonGroupContainer $buttonCount={buttonCount} $ratio={ratio} {...props}>
      {buttons.map((button) => {
        const injectedProps: Partial<ButtonProps> = {
          level: button.props.level ?? level,
          size: button.props.size ?? size,
          status: button.props.status ?? status,
        };

        return cloneElement(button, injectedProps);
      })}
    </ButtonGroupContainer>
  );
};

const ButtonGroupContainer = styled.div<ButtonGroupStyleProps>(
  ({ $buttonCount, $ratio, theme }) => ({
    display: 'flex',
    flexDirection: $ratio === '100:100' ? 'column' : 'row',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    padding: `${theme.spacing.none} ${theme.spacing['2xl']}`,
    gap: theme.spacing.md,

    '& > button': {
      width: '100%',
      minWidth: 0,
    },

    '& > button:nth-of-type(1)': {
      flex:
        $buttonCount === 2 && $ratio !== '100:100'
          ? `${BUTTON_GROUP_FLEX_GROW[$ratio][0]} 1 0`
          : undefined,
    },

    '& > button:nth-of-type(2)': {
      flex:
        $buttonCount === 2 && $ratio !== '100:100'
          ? `${BUTTON_GROUP_FLEX_GROW[$ratio][1]} 1 0`
          : undefined,
    },
  }),
);

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Button }) as ButtonGroupComponent;
