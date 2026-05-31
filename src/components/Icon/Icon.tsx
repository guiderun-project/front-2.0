import type { ReactElement, SVGProps } from 'react';

import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { iconRegistry, type IconName } from './iconRegistry';

const DEFAULT_ICON_SIZE = 20;
const DEFAULT_ICON_COLOR = 'icon.primary' satisfies ColorToken;

type IconProps = {
  icon: IconName;
  size?: number;
  color?: ColorToken;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'width'>;

export const Icon = ({
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  color = DEFAULT_ICON_COLOR,
  icon,
  role,
  size = DEFAULT_ICON_SIZE,
  style,
  ...props
}: IconProps): ReactElement => {
  const SvgIcon = iconRegistry[icon];
  const isDecorative = !ariaLabel;

  return (
    <SvgIcon
      aria-hidden={isDecorative ? (ariaHidden ?? true) : ariaHidden}
      aria-label={ariaLabel}
      height={size}
      role={isDecorative ? role : (role ?? 'img')}
      style={{
        ...style,
        color: resolveColorToken(color),
        display: 'inline-block',
        flexShrink: 0,
        height: size,
        verticalAlign: 'middle',
        width: size,
      }}
      width={size}
      {...props}
    />
  );
};
