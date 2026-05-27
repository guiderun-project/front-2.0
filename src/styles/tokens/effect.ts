export const effect = {
  'card-shadow': '0 4px 24px 0 rgba(51, 59, 70, 0.1)',
  'bottom-shadow': '0 0 32px 0 rgba(51, 59, 70, 0.1)',
} as const;

export type EffectToken = keyof typeof effect;
