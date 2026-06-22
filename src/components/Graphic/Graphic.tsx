import type { ReactElement, SVGProps } from 'react';

import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { graphicRegistry, type GraphicName } from './graphicRegistry';

const DEFAULT_GRAPHIC_COLOR = 'icon.primary' satisfies ColorToken;

export type GraphicProps = {
  color?: ColorToken;
  decorative?: boolean;
  graphic: GraphicName;
  label?: string;
} & Omit<
  SVGProps<SVGSVGElement>,
  'aria-hidden' | 'aria-label' | 'children' | 'color' | 'height' | 'role' | 'width'
>;

export const Graphic = ({
  color = DEFAULT_GRAPHIC_COLOR,
  decorative = false,
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

  return (
    <SvgGraphic
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : (label ?? defaultLabel)}
      focusable="false"
      height={height}
      role={decorative ? undefined : 'img'}
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
