import type { ColorMode } from './color';
import { pxToRem } from './size';

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
        'linear-gradient(180deg, #5ECCF0 0%, rgba(94, 204, 240, 0) 49.187%)',
      'brand-event':
        'linear-gradient(180deg, #B2DCFF 1.2%, #C7F1FC 15%, #D8EDED 44.9%, rgba(216, 237, 237, 0) 100%)',
      'brand-event-overlay':
        'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
      footer:
        'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--color-bg-default) 17.308%)',
      'footer-subtle':
        'linear-gradient(180deg, rgba(238, 242, 246, 0) 0%, var(--color-bg-subtle) 17.31%)',
    },
    feedback: {
      toastSweep: {
        success:
          'linear-gradient(97deg, rgba(0, 155, 219, 0) 8.94%, rgba(0, 155, 219, 0.14) 42.91%, rgba(0, 155, 219, 0) 90.21%)',
        error:
          'linear-gradient(97deg, rgba(240, 68, 56, 0) 8.94%, rgba(240, 68, 56, 0.14) 42.91%, rgba(240, 68, 56, 0) 90.21%)',
      },
    },
  },
  dark: {
    bg: {
      subtle: 'linear-gradient(180deg, #F0F3F9 0%, #F6F7F9 100%)',
      'brand-main':
        'linear-gradient(180deg, #0C5B7D 0%, #094768 21.321%, rgba(6, 49, 79, 0.8) 51.443%, rgba(6, 49, 79, 0.2) 78.815%, rgba(6, 49, 79, 0) 100%)',
      'brand-event':
        'linear-gradient(180deg, #0F2342 1.2%, rgba(15, 35, 66, 0) 90%)',
      'brand-event-overlay':
        'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
      footer:
        'linear-gradient(180deg, rgba(14, 19, 25, 0) 0%, var(--color-bg-default) 17.308%)',
      'footer-subtle':
        'linear-gradient(180deg, rgba(21, 27, 35, 0) 0%, var(--color-bg-subtle) 17.31%)',
    },
    feedback: {
      toastSweep: {
        success:
          'linear-gradient(97deg, rgba(0, 155, 219, 0) 8.94%, rgba(0, 155, 219, 0.14) 42.91%, rgba(0, 155, 219, 0) 90.21%)',
        error:
          'linear-gradient(97deg, rgba(240, 68, 56, 0) 8.94%, rgba(240, 68, 56, 0.14) 42.91%, rgba(240, 68, 56, 0) 90.21%)',
      },
    },
  },
} as const satisfies Record<ColorMode, Record<string, unknown>>;

export const gradient = {
  bg: {
    subtle: 'var(--gradient-bg-subtle)',
    'brand-main': 'var(--gradient-bg-brand-main)',
    'brand-event': 'var(--gradient-bg-brand-event)',
    'brand-event-overlay': 'var(--gradient-bg-brand-event-overlay)',
    footer: 'var(--gradient-bg-footer)',
    'footer-subtle': 'var(--gradient-bg-footer-subtle)',
  },
  feedback: {
    toastSweep: {
      success: 'var(--gradient-feedback-toastSweep-success)',
      error: 'var(--gradient-feedback-toastSweep-error)',
    },
  },
} as const;

export const gradientTokenMap = {
  'bg.subtle': 'var(--gradient-bg-subtle)',
  'bg.brand-main': 'var(--gradient-bg-brand-main)',
  'bg.brand-event': 'var(--gradient-bg-brand-event)',
  'bg.brand-event-overlay': 'var(--gradient-bg-brand-event-overlay)',
  'bg.footer': 'var(--gradient-bg-footer)',
  'bg.footer-subtle': 'var(--gradient-bg-footer-subtle)',
  'feedback.toastSweep.success': 'var(--gradient-feedback-toastSweep-success)',
  'feedback.toastSweep.error': 'var(--gradient-feedback-toastSweep-error)',
} as const;

export type GradientToken = keyof typeof gradientTokenMap;

export const resolveGradientToken = (token: GradientToken): GradientValue => gradientTokenMap[token];

export const gradientBackgroundHeight = {
  'bg.brand-main': pxToRem(640),
  'bg.brand-event': pxToRem(640),
} as const satisfies Partial<Record<GradientToken, string>>;

export const resolveGradientBackgroundHeight = (token: GradientToken): string =>
  gradientBackgroundHeight[token as keyof typeof gradientBackgroundHeight] ?? '100%';

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
