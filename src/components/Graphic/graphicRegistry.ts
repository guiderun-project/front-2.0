import type { ComponentType, SVGProps } from 'react';

import CongratsGraphic from '@/assets/graphics/congrats.svg?react';
import MainGraphic from '@/assets/graphics/main.svg?react';
import WelcomeGraphic from '@/assets/graphics/welcome.svg?react';

type SvgGraphicComponent = ComponentType<SVGProps<SVGSVGElement>>;

type GraphicDefinition = {
  Component: SvgGraphicComponent;
  height: number;
  label: string;
  width: number;
};

export const graphicRegistry = {
  congrats: {
    Component: CongratsGraphic,
    height: 120,
    label: '축하 그래픽',
    width: 120,
  },
  main: {
    Component: MainGraphic,
    height: 70,
    label: '러너 그래픽',
    width: 94,
  },
  welcome: {
    Component: WelcomeGraphic,
    height: 120,
    label: '환영 그래픽',
    width: 220,
  },
} as const satisfies Record<string, GraphicDefinition>;

export type GraphicName = keyof typeof graphicRegistry;
