import type { ColorMode, ColorToken } from './color';
import type { EffectToken } from './effect';
import type { GradientToken } from './gradient';

export type ContrastMode = 'normal' | 'high';

export type HighContrastRole =
  | 'surface'
  | 'content'
  | 'outline'
  | 'inverse-surface'
  | 'inverse-content';

type HighContrastDecoration = HighContrastRole | 'none';

const HIGH_CONTRAST_BLACK = '#000000';
const HIGH_CONTRAST_WHITE = '#FFFFFF';

const highContrastPalette = {
  light: {
    surface: HIGH_CONTRAST_WHITE,
    content: HIGH_CONTRAST_BLACK,
    outline: HIGH_CONTRAST_BLACK,
    'inverse-surface': HIGH_CONTRAST_BLACK,
    'inverse-content': HIGH_CONTRAST_WHITE,
  },
  dark: {
    surface: HIGH_CONTRAST_BLACK,
    content: HIGH_CONTRAST_WHITE,
    outline: HIGH_CONTRAST_WHITE,
    'inverse-surface': HIGH_CONTRAST_WHITE,
    'inverse-content': HIGH_CONTRAST_BLACK,
  },
} as const satisfies Record<ColorMode, Record<HighContrastRole, string>>;

export const highContrastColorRoles = {
  'bg.default': 'surface',
  'bg.subtle': 'surface',
  'bg.surface': 'surface',
  'bg.elevated': 'surface',
  'bg.brand-primary': 'inverse-surface',
  'bg.brand-soft': 'surface',
  'bg.dim-strong': 'surface',
  'bg.light-strong': 'surface',
  'bg.brand-subtle': 'inverse-surface',
  'bg.brand-soft2': 'surface',
  'bg.brand-surface': 'inverse-surface',
  'bg.brand-event': 'surface',
  'bg.light-soft': 'surface',
  'bg.dim-soft': 'surface',
  'bg.overlay': 'surface',
  'bg.glass': 'surface',
  'bg.accent1': 'surface',
  'bg.accent2': 'surface',
  'text.primary': 'content',
  'text.secondary': 'content',
  'text.tertiary': 'content',
  'text.quaternary': 'content',
  'text.inverse': 'inverse-content',
  'text.brand': 'content',
  'text.disabled': 'content',
  'text.danger': 'content',
  'text.brand-subtle': 'content',
  'border.default': 'outline',
  'border.subtle': 'outline',
  'border.danger': 'outline',
  'border.focused': 'outline',
  'border.strong': 'outline',
  'border.brand': 'outline',
  'border.primary': 'outline',
  'profile.team-a': 'content',
  'profile.team-b': 'content',
  'profile.team-c': 'content',
  'profile.team-d': 'content',
  'profile.team-e': 'content',
  'profile.vi': 'content',
  'profile.guide': 'content',
  'icon.primary': 'content',
  'icon.secondary': 'content',
  'icon.tertiary': 'content',
  'icon.inverse': 'inverse-content',
  'icon.brand': 'content',
  'icon.disabled': 'content',
  'icon.brand-secondary': 'content',
  'badge.bg.gray': 'surface',
  'badge.bg.blue': 'surface',
  'badge.bg.orange': 'surface',
  'badge.bg.violet': 'surface',
  'badge.bg.cyan': 'surface',
  'badge.bg.green': 'surface',
  'badge.bg.solid-gray': 'inverse-surface',
  'badge.bg.solid-cyan': 'inverse-surface',
  'badge.text.gray': 'content',
  'badge.text.blue': 'content',
  'badge.text.orange': 'content',
  'badge.text.violet': 'content',
  'badge.text.cyan': 'content',
  'badge.text.green': 'content',
  'badge.text.primitive': 'inverse-content',
  'badge.text.cyan_2': 'content',
  'button.subtle.text': 'content',
  'loading.skeleton.base': 'surface',
  'loading.skeleton.highlight': 'surface',
} as const satisfies Record<ColorToken, HighContrastRole>;

const highContrastGradientRoles = {
  'bg.subtle': 'surface',
  'bg.brand-main': 'surface',
  'bg.brand-event': 'surface',
  'bg.brand-event-overlay': 'none',
  'bg.footer': 'surface',
  'bg.footer-subtle': 'surface',
  'feedback.toastSweep.success': 'none',
  'feedback.toastSweep.error': 'none',
} as const satisfies Record<GradientToken, HighContrastDecoration>;

const highContrastEffectRoles = {
  'card-shadow': 'none',
  'bottom-shadow': 'none',
  'toast-shadow': 'none',
  'color-mode-toggle-light-shadow': 'none',
  'color-mode-toggle-dark-shadow': 'none',
} as const satisfies Record<EffectToken, HighContrastDecoration>;

const toCssVariableName = (prefix: string, token: string) =>
  `--${prefix}-${token.replaceAll('.', '-')}`;

const resolveDecoration = (
  decoration: HighContrastDecoration,
  colorMode: ColorMode,
): string => (decoration === 'none' ? 'none' : highContrastPalette[colorMode][decoration]);

export const highContrastRoleVariable = {
  surface: 'var(--hc-surface)',
  content: 'var(--hc-content)',
  outline: 'var(--hc-outline)',
  'inverse-surface': 'var(--hc-inverse-surface)',
  'inverse-content': 'var(--hc-inverse-content)',
} as const satisfies Record<HighContrastRole, string>;

const createHighContrastCssVariables = (colorMode: ColorMode) =>
  [
    ...Object.entries(highContrastPalette[colorMode]).map(
      ([role, value]) => [`--hc-${role}`, value] as const,
    ),
    ...Object.entries(highContrastColorRoles).map(
      ([token, role]) =>
        [toCssVariableName('color', token), highContrastPalette[colorMode][role]] as const,
    ),
    ...Object.entries(highContrastGradientRoles).map(
      ([token, decoration]) =>
        [toCssVariableName('gradient', token), resolveDecoration(decoration, colorMode)] as const,
    ),
    ...Object.entries(highContrastEffectRoles).map(
      ([token, decoration]) =>
        [toCssVariableName('effect', token), resolveDecoration(decoration, colorMode)] as const,
    ),
  ]
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

export const highContrastCssVariables = {
  light: createHighContrastCssVariables('light'),
  dark: createHighContrastCssVariables('dark'),
} as const satisfies Record<ColorMode, string>;
