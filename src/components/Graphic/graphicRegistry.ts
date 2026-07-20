import type { ComponentType, SVGProps } from 'react';

import CongratsGraphic from '@/assets/graphics/congrats.svg?react';
import WelcomeGraphic from '@/assets/graphics/welcome.svg?react';

type SvgGraphicComponent = ComponentType<SVGProps<SVGSVGElement>>;

type GraphicDefinition = {
  Component: SvgGraphicComponent;
  height: number;
  width: number;
};

export const graphicRegistry = {
  congrats: {
    Component: CongratsGraphic,
    height: 120,
    width: 120,
  },
  welcome: {
    Component: WelcomeGraphic,
    height: 120,
    width: 220,
  },
} as const satisfies Record<string, GraphicDefinition>;

export type GraphicName = keyof typeof graphicRegistry;
