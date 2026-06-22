import type { ReactElement, SVGProps } from 'react';

import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { graphicRegistry, type GraphicName } from './graphicRegistry';

const DEFAULT_GRAPHIC_COLOR = 'icon.primary' satisfies ColorToken;

export type GraphicProps = {
  color?: ColorToken;
  graphic: GraphicName;
  label?: string;
} & Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'color' | 'height' | 'role' | 'width'
>;

export const Graphic = ({
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  color = DEFAULT_GRAPHIC_COLOR,
  graphic,
  label,
  style,
  ...props
}: GraphicProps): ReactElement => {
  const {
    Component: SvgGraphic,
    height,
    label: defaultLabel,
    width,
  } = graphicRegistry[graphic];
  const isAriaHidden = ariaHidden === true || ariaHidden === 'true';

  return (
    <SvgGraphic
      aria-hidden={ariaHidden}
      aria-label={isAriaHidden ? undefined : (ariaLabel ?? label ?? defaultLabel)}
      focusable="false"
      height={height}
      role={isAriaHidden ? undefined : 'img'}
      style={{
        ...style,
        color: resolveColorToken(color),
        display: 'inline-block',
        flexShrink: 0,
        height,
        verticalAlign: 'middle',
        width,
      }}
      width={width}
      {...props}
    />
  );
};
