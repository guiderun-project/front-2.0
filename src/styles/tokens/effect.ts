export const effect = {
  'card-shadow': '0 4px 24px 0 rgba(51, 59, 70, 0.1)',
  'bottom-shadow': '0 0 32px 0 rgba(51, 59, 70, 0.1)',
  'toast-shadow': '0 8px 24px 0 rgba(51, 59, 70, 0.12)',
  'color-mode-toggle-light-shadow': '0 2px 2px 0 rgba(0, 0, 0, 0.25)',
  'color-mode-toggle-dark-shadow': '0 2px 4px 0 rgba(0, 0, 0, 0.25)',
} as const;

export type EffectToken = keyof typeof effect;
