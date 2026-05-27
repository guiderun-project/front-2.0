export const gradient = {
  bg: {
    subtle: 'linear-gradient(180deg, #F0F3F9 0%, #F6F7F9 100%)',
    'brand-main':
      'linear-gradient(212.9603387001598deg, #5ECCF0 0%, #EEF2F6 38%, #0C5B7D 0%, #06314F 46%, #151B23 100%)',
    'brand-event':
      'linear-gradient(180.00000000000182deg, #B2DCFF 1%, #C7F1FC 15%, #D8EDED 45%, #EEF2F6 100%)',
    'brand-event-overlay':
      'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
  },
} as const;

export const gradientBaseColor = {
  bg: {
    'brand-event-overlay': '#1D242E',
  },
} as const;

export const gradientTokenMap = {
  'bg.subtle': 'linear-gradient(180deg, #F0F3F9 0%, #F6F7F9 100%)',
  'bg.brand-main':
    'linear-gradient(212.9603387001598deg, #5ECCF0 0%, #EEF2F6 38%, #0C5B7D 0%, #06314F 46%, #151B23 100%)',
  'bg.brand-event':
    'linear-gradient(180.00000000000182deg, #B2DCFF 1%, #C7F1FC 15%, #D8EDED 45%, #EEF2F6 100%)',
  'bg.brand-event-overlay':
    'linear-gradient(180.00000000000182deg, #0F2342 1%, rgba(15, 35, 66, 0) 28%)',
} as const;

export type GradientToken = keyof typeof gradientTokenMap;

export const resolveGradientToken = (token: GradientToken) => gradientTokenMap[token];
