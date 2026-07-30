import type { ReactElement, SVGProps } from 'react';

import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { graphicRegistry, type GraphicName } from './graphicRegistry';

const DEFAULT_GRAPHIC_COLOR = 'icon.primary' satisfies ColorToken;

export type GraphicProps = {
  color?: ColorToken;
  graphic: GraphicName;
  /** 정보성 그래픽으로 노출할 때의 대체 텍스트. 미지정 시 장식 처리된다. */
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
  const { Component: SvgGraphic, height, width } = graphicRegistry[graphic];
  const accessibleLabel = ariaLabel ?? label;
  // Icon과 동일하게 라벨이 지정되지 않으면 장식 요소로 취급한다.
  const isDecorative =
    ariaHidden === true || ariaHidden === 'true' || accessibleLabel === undefined;

  return (
    <SvgGraphic
      aria-hidden={isDecorative ? (ariaHidden ?? true) : ariaHidden}
      aria-label={isDecorative ? undefined : accessibleLabel}
      focusable="false"
      height={height}
      role={isDecorative ? undefined : 'img'}
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
