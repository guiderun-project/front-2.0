import type { ColorMode } from './color';

type GradientValue = string;

export const gradientBaseColor = {
  bg: {
    'brand-event-overlay': '#1D242E',
  },
} as const;

const gradientModes = {
  light: {
    bg: {
      subtle: 'linear-gradient(180deg, #F0F3F9 0%, #F6F7F9 100%)',
      'brand-main':
        'linear-gradient(180deg, var(--primitive-brand-cyan-300, #5ECCF0) -5.6%, var(--primitive-neutral-100, #EEF2F6) 34.51%)',
      'brand-event':
        'linear-gradient(180.00000000000182deg, #B2DCFF 1%, #C7F1FC 15%, #D8EDED 45%, #EEF2F6 100%)',
      'brand-event-overlay':
        'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
    },
  },
  dark: {
    bg: {
      subtle: 'linear-gradient(180deg, #F0F3F9 0%, #F6F7F9 100%)',
      'brand-main':
        'linear-gradient(180deg, var(--primitive-brand-cyan-800, #0C5B7D) 1.05%, var(--primitive-brand-cyan-950, #06314F) 18.35%, var(--primitive-neutral-900, #151B23) 39.04%)',
      'brand-event': `linear-gradient(180deg, #0F2342 -1.42%, rgba(15, 35, 66, 0) 22.74%), ${gradientBaseColor.bg['brand-event-overlay']}`,
      'brand-event-overlay':
        'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
    },
  },
} as const satisfies Record<ColorMode, Record<string, unknown>>;

export const gradient = {
  bg: {
    subtle: 'var(--gradient-bg-subtle)',
    'brand-main': 'var(--gradient-bg-brand-main)',
    'brand-event': 'var(--gradient-bg-brand-event)',
    'brand-event-overlay': 'var(--gradient-bg-brand-event-overlay)',
  },
} as const;

export const gradientTokenMap = {
  'bg.subtle': 'var(--gradient-bg-subtle)',
  'bg.brand-main': 'var(--gradient-bg-brand-main)',
  'bg.brand-event': 'var(--gradient-bg-brand-event)',
  'bg.brand-event-overlay': 'var(--gradient-bg-brand-event-overlay)',
} as const;

export type GradientToken = keyof typeof gradientTokenMap;

export const resolveGradientToken = (token: GradientToken): GradientValue => gradientTokenMap[token];

const flattenGradients = (
  value: Record<string, unknown>,
  path: string[] = [],
): Array<[name: string, gradient: string]> => {
  return Object.entries(value).flatMap(([key, childValue]) => {
    const nextPath = [...path, key];

    if (typeof childValue === 'string') {
      return [[nextPath.join('-'), childValue] as [string, string]];
    }

    return flattenGradients(childValue as Record<string, unknown>, nextPath);
  });
};

const createGradientModeCssVariables = (modeGradients: Record<string, unknown>) => {
  return flattenGradients(modeGradients)
    .map(([name, value]) => `  --gradient-${name}: ${value};`)
    .join('\n');
};

export const gradientModeCssVariables = {
  light: createGradientModeCssVariables(gradientModes.light),
  dark: createGradientModeCssVariables(gradientModes.dark),
} as const satisfies Record<ColorMode, string>;
