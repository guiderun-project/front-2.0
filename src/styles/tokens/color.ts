type ColorValue = string;

export type ColorMode = 'light' | 'dark';

// Primitive color values can change when Figma tokens are updated. Prefer semantic color tokens in product components.
export const colorPrimitive = {
  neutral: {
    '0': '#FFFFFF',
    '50': '#F7F9FB',
    '100': '#EEF2F6',
    '200': '#E0E6EC',
    '300': '#C9D2DC',
    '400': '#AEBBC9',
    '500': '#7D8A9A',
    '600': '#5D6876',
    '700': '#454F5C',
    '800': '#2F3947',
    '850': '#202933',
    '875': '#1D242E',
    '900': '#151B23',
    '950': '#0E1319',
    '950-a54': 'rgba(18, 24, 32, 0.54)',
    '800-a10': 'rgba(51, 59, 70, 0.1)',
    '300-a24': 'rgba(201, 210, 220, 0.24)',
    '0-a8': 'rgba(255, 255, 255, 0.08)',
    '50-a32': 'rgba(247, 249, 251, 0.32)',
    '50-a80': 'rgba(247, 249, 251, 0.8)',
    '0-a16': 'rgba(255, 255, 255, 0.16)',
    '0-a32': 'rgba(255, 255, 255, 0.32)',
    '950-a42': 'rgba(18, 24, 32, 0.42)',
    '950-a18': 'rgba(18, 24, 32, 0.18)',
    '600-a14': 'rgba(93, 104, 118, 0.14)',
    '600-a22': 'rgba(93, 104, 118, 0.22)',
    '800-a80': 'rgba(47, 57, 71, 0.8)',
  },
  red: {
    '50': '#FEF3F2',
    '400': '#FF6B61',
    '500': '#F04438',
  },
  cyan: {
    '50': '#EBFDFF',
    '100': '#C5EEFA',
    '200': '#91DCF4',
    '300': '#5ECCF0',
    '400': '#2BAFE0',
    '500': '#009BDB',
    '600': '#0087C0',
    '700': '#026F99',
    '800': '#0C5B7D',
    '900': '#134263',
    '950': '#06314F',
    '500-a10': 'rgba(0, 155, 219, 0.1)',
    '400-a12': 'rgba(43, 175, 224, 0.12)',
    '500-a24': 'rgba(0, 155, 219, 0.24)',
    '400-a20': 'rgba(43, 175, 224, 0.2)',
  },
  accent: {
    red: {
      base: '#C9532E',
    },
    amber: {
      base: '#CE8E38',
    },
    green: {
      base: '#6C9D34',
      a14: 'rgba(24, 168, 30, 0.14)',
      strong: '#01830F',
      a22: 'rgba(24, 168, 30, 0.22)',
      soft: '#8AE694',
    },
    teal: {
      base: '#408797',
      a16: 'rgba(104, 209, 194, 0.16)',
    },
    blue: {
      base: '#3F6EBC',
      a14: 'rgba(0, 109, 255, 0.14)',
      strong: '#0054D6',
      a22: 'rgba(0, 109, 255, 0.22)',
      soft: '#8CC2FF',
    },
    rose: {
      base: '#CB4670',
    },
    violet: {
      base: '#5A5CD1',
      a22: 'rgba(124, 60, 255, 0.22)',
      strong: '#7627F5',
      soft: '#BC9CF5',
      a14: 'rgba(124, 60, 255, 0.14)',
    },
    orange: {
      a22: 'rgba(255, 106, 0, 0.22)',
      strong: '#C24100',
      a14: 'rgba(255, 106, 0, 0.14)',
      soft: '#FF9A41',
    },
  },
} as const;

export const primitiveColorTokenMap = {
  'primitive.neutral.0': '#FFFFFF',
  'primitive.neutral.50': '#F7F9FB',
  'primitive.neutral.100': '#EEF2F6',
  'primitive.neutral.200': '#E0E6EC',
  'primitive.neutral.300': '#C9D2DC',
  'primitive.neutral.400': '#AEBBC9',
  'primitive.neutral.500': '#7D8A9A',
  'primitive.neutral.600': '#5D6876',
  'primitive.neutral.700': '#454F5C',
  'primitive.neutral.800': '#2F3947',
  'primitive.neutral.850': '#202933',
  'primitive.neutral.875': '#1D242E',
  'primitive.neutral.900': '#151B23',
  'primitive.neutral.950': '#0E1319',
  'primitive.neutral.950-a54': 'rgba(18, 24, 32, 0.54)',
  'primitive.neutral.800-a10': 'rgba(51, 59, 70, 0.1)',
  'primitive.neutral.300-a24': 'rgba(201, 210, 220, 0.24)',
  'primitive.neutral.0-a8': 'rgba(255, 255, 255, 0.08)',
  'primitive.neutral.50-a32': 'rgba(247, 249, 251, 0.32)',
  'primitive.neutral.50-a80': 'rgba(247, 249, 251, 0.8)',
  'primitive.neutral.0-a16': 'rgba(255, 255, 255, 0.16)',
  'primitive.neutral.0-a32': 'rgba(255, 255, 255, 0.32)',
  'primitive.neutral.950-a42': 'rgba(18, 24, 32, 0.42)',
  'primitive.neutral.950-a18': 'rgba(18, 24, 32, 0.18)',
  'primitive.neutral.600-a14': 'rgba(93, 104, 118, 0.14)',
  'primitive.neutral.600-a22': 'rgba(93, 104, 118, 0.22)',
  'primitive.neutral.800-a80': 'rgba(47, 57, 71, 0.8)',
  'primitive.red.50': '#FEF3F2',
  'primitive.red.400': '#FF6B61',
  'primitive.red.500': '#F04438',
  'primitive.cyan.50': '#EBFDFF',
  'primitive.cyan.100': '#C5EEFA',
  'primitive.cyan.200': '#91DCF4',
  'primitive.cyan.300': '#5ECCF0',
  'primitive.cyan.400': '#2BAFE0',
  'primitive.cyan.500': '#009BDB',
  'primitive.cyan.600': '#0087C0',
  'primitive.cyan.700': '#026F99',
  'primitive.cyan.800': '#0C5B7D',
  'primitive.cyan.900': '#134263',
  'primitive.cyan.950': '#06314F',
  'primitive.cyan.500-a10': 'rgba(0, 155, 219, 0.1)',
  'primitive.cyan.400-a12': 'rgba(43, 175, 224, 0.12)',
  'primitive.cyan.500-a24': 'rgba(0, 155, 219, 0.24)',
  'primitive.cyan.400-a20': 'rgba(43, 175, 224, 0.2)',
  'primitive.accent.red.base': '#C9532E',
  'primitive.accent.amber.base': '#CE8E38',
  'primitive.accent.green.base': '#6C9D34',
  'primitive.accent.green.a14': 'rgba(24, 168, 30, 0.14)',
  'primitive.accent.green.strong': '#01830F',
  'primitive.accent.green.a22': 'rgba(24, 168, 30, 0.22)',
  'primitive.accent.green.soft': '#8AE694',
  'primitive.accent.teal.base': '#408797',
  'primitive.accent.teal.a16': 'rgba(104, 209, 194, 0.16)',
  'primitive.accent.blue.base': '#3F6EBC',
  'primitive.accent.blue.a14': 'rgba(0, 109, 255, 0.14)',
  'primitive.accent.blue.strong': '#0054D6',
  'primitive.accent.blue.a22': 'rgba(0, 109, 255, 0.22)',
  'primitive.accent.blue.soft': '#8CC2FF',
  'primitive.accent.rose.base': '#CB4670',
  'primitive.accent.violet.base': '#5A5CD1',
  'primitive.accent.violet.a22': 'rgba(124, 60, 255, 0.22)',
  'primitive.accent.violet.strong': '#7627F5',
  'primitive.accent.violet.soft': '#BC9CF5',
  'primitive.accent.violet.a14': 'rgba(124, 60, 255, 0.14)',
  'primitive.accent.orange.a22': 'rgba(255, 106, 0, 0.22)',
  'primitive.accent.orange.strong': '#C24100',
  'primitive.accent.orange.a14': 'rgba(255, 106, 0, 0.14)',
  'primitive.accent.orange.soft': '#FF9A41',
} as const;

export type PrimitiveColorToken = keyof typeof primitiveColorTokenMap;

type SemanticColorAliasGroup = {
  readonly [key: string]: PrimitiveColorToken | SemanticColorAliasGroup;
};

export const semanticColorAliases = {
  light: {
    bg: {
      default: 'primitive.neutral.0',
      subtle: 'primitive.neutral.100',
      surface: 'primitive.neutral.200',
      elevated: 'primitive.neutral.0',
      'brand-primary': 'primitive.cyan.500',
      'brand-soft': 'primitive.cyan.500-a10',
      'dim-strong': 'primitive.neutral.950-a54',
      'light-strong': 'primitive.neutral.0-a32',
      'brand-subtle': 'primitive.cyan.600',
      'brand-soft2': 'primitive.cyan.400-a20',
      'brand-surface': 'primitive.cyan.700',
      'brand-event': 'primitive.neutral.100',
      'light-soft': 'primitive.neutral.0-a16',
      'dim-soft': 'primitive.neutral.800-a10',
      overlay: 'primitive.neutral.800-a10',
      glass: 'primitive.neutral.50-a80',
    },
    text: {
      primary: 'primitive.neutral.950',
      secondary: 'primitive.neutral.600',
      tertiary: 'primitive.neutral.500',
      quaternary: 'primitive.neutral.400',
      inverse: 'primitive.neutral.0',
      brand: 'primitive.cyan.500',
      disabled: 'primitive.neutral.950-a42',
      danger: 'primitive.red.500',
      'brand-subtle': 'primitive.cyan.700',
    },
    border: {
      default: 'primitive.neutral.950-a18',
      subtle: 'primitive.neutral.800-a10',
      danger: 'primitive.red.500',
      focused: 'primitive.cyan.500-a24',
      strong: 'primitive.neutral.950-a42',
      brand: 'primitive.cyan.500',
      primary: 'primitive.neutral.900',
    },
    profile: {
      'team-a': 'primitive.accent.red.base',
      'team-b': 'primitive.accent.amber.base',
      'team-c': 'primitive.accent.green.base',
      'team-d': 'primitive.accent.teal.base',
      'team-e': 'primitive.accent.blue.base',
      vi: 'primitive.accent.rose.base',
      guide: 'primitive.accent.violet.base',
    },
    icon: {
      primary: 'primitive.neutral.900',
      secondary: 'primitive.neutral.500',
      tertiary: 'primitive.neutral.400',
      inverse: 'primitive.neutral.50',
      brand: 'primitive.cyan.500',
      disabled: 'primitive.neutral.300',
      'brand-secondary': 'primitive.cyan.700',
    },
    badge: {
      bg: {
        gray: 'primitive.neutral.800-a10',
        blue: 'primitive.accent.blue.a14',
        orange: 'primitive.accent.orange.a14',
        violet: 'primitive.accent.violet.a14',
        cyan: 'primitive.cyan.500-a10',
        green: 'primitive.accent.green.a14',
        'solid-gray': 'primitive.neutral.500',
        'solid-cyan': 'primitive.cyan.500',
      },
      text: {
        gray: 'primitive.neutral.600',
        blue: 'primitive.accent.blue.strong',
        orange: 'primitive.accent.orange.strong',
        violet: 'primitive.accent.violet.strong',
        cyan: 'primitive.cyan.500',
        green: 'primitive.accent.green.strong',
        primitive: 'primitive.neutral.0',
        cyan_2: 'primitive.cyan.700',
      },
    },
  },
  dark: {
    bg: {
      default: 'primitive.neutral.950',
      subtle: 'primitive.neutral.900',
      surface: 'primitive.neutral.850',
      elevated: 'primitive.neutral.950',
      'brand-primary': 'primitive.cyan.400',
      'brand-soft': 'primitive.cyan.400-a12',
      'dim-strong': 'primitive.neutral.950-a54',
      'light-strong': 'primitive.neutral.50-a32',
      'brand-subtle': 'primitive.cyan.600',
      'brand-soft2': 'primitive.cyan.400-a20',
      'brand-surface': 'primitive.cyan.800',
      'brand-event': 'primitive.neutral.900',
      'light-soft': 'primitive.neutral.0-a8',
      'dim-soft': 'primitive.neutral.950-a42',
      overlay: 'primitive.neutral.0-a8',
      glass: 'primitive.neutral.800-a80',
    },
    text: {
      primary: 'primitive.neutral.50',
      secondary: 'primitive.neutral.400',
      tertiary: 'primitive.neutral.500',
      quaternary: 'primitive.neutral.600',
      inverse: 'primitive.neutral.950',
      brand: 'primitive.cyan.400',
      disabled: 'primitive.neutral.950-a54',
      danger: 'primitive.red.400',
      'brand-subtle': 'primitive.cyan.800',
    },
    border: {
      default: 'primitive.neutral.0-a16',
      subtle: 'primitive.neutral.0-a8',
      danger: 'primitive.red.400',
      focused: 'primitive.cyan.400-a20',
      strong: 'primitive.neutral.0-a32',
      brand: 'primitive.cyan.400',
      primary: 'primitive.neutral.50',
    },
    profile: {
      'team-a': 'primitive.accent.red.base',
      'team-b': 'primitive.accent.amber.base',
      'team-c': 'primitive.accent.green.base',
      'team-d': 'primitive.accent.teal.base',
      'team-e': 'primitive.accent.blue.base',
      vi: 'primitive.accent.rose.base',
      guide: 'primitive.accent.violet.base',
    },
    icon: {
      primary: 'primitive.neutral.100',
      secondary: 'primitive.neutral.500',
      tertiary: 'primitive.neutral.600',
      inverse: 'primitive.neutral.850',
      brand: 'primitive.cyan.400',
      disabled: 'primitive.neutral.700',
      'brand-secondary': 'primitive.cyan.800',
    },
    badge: {
      bg: {
        gray: 'primitive.neutral.0-a8',
        blue: 'primitive.accent.blue.a22',
        orange: 'primitive.accent.orange.a22',
        violet: 'primitive.accent.violet.a22',
        cyan: 'primitive.cyan.400-a20',
        green: 'primitive.accent.green.a22',
        'solid-gray': 'primitive.neutral.600',
        'solid-cyan': 'primitive.cyan.500',
      },
      text: {
        gray: 'primitive.neutral.400',
        blue: 'primitive.accent.blue.soft',
        orange: 'primitive.accent.orange.soft',
        violet: 'primitive.accent.violet.soft',
        cyan: 'primitive.cyan.300',
        green: 'primitive.accent.green.soft',
        primitive: 'primitive.neutral.100',
        cyan_2: 'primitive.cyan.400',
      },
    },
  },
} as const satisfies Record<ColorMode, SemanticColorAliasGroup>;

type ResolvedSemanticColorAliases<T extends SemanticColorAliasGroup> = {
  readonly [K in keyof T]: T[K] extends PrimitiveColorToken
    ? (typeof primitiveColorTokenMap)[T[K]]
    : T[K] extends SemanticColorAliasGroup
      ? ResolvedSemanticColorAliases<T[K]>
      : never;
};

const resolveSemanticColorAliases = <T extends SemanticColorAliasGroup>(
  aliases: T,
): ResolvedSemanticColorAliases<T> => {
  const resolvedEntries = Object.entries(aliases).map(([key, value]) => [
    key,
    typeof value === 'string'
      ? primitiveColorTokenMap[value]
      : resolveSemanticColorAliases(value),
  ]);

  return Object.fromEntries(resolvedEntries) as ResolvedSemanticColorAliases<T>;
};

export const semanticColorModes = resolveSemanticColorAliases(semanticColorAliases);

export const color = {
  bg: {
    default: 'var(--color-bg-default)',
    subtle: 'var(--color-bg-subtle)',
    surface: 'var(--color-bg-surface)',
    elevated: 'var(--color-bg-elevated)',
    'brand-primary': 'var(--color-bg-brand-primary)',
    'brand-soft': 'var(--color-bg-brand-soft)',
    'dim-strong': 'var(--color-bg-dim-strong)',
    'light-strong': 'var(--color-bg-light-strong)',
    'brand-subtle': 'var(--color-bg-brand-subtle)',
    'brand-soft2': 'var(--color-bg-brand-soft2)',
    'brand-surface': 'var(--color-bg-brand-surface)',
    'brand-event': 'var(--color-bg-brand-event)',
    'light-soft': 'var(--color-bg-light-soft)',
    'dim-soft': 'var(--color-bg-dim-soft)',
    overlay: 'var(--color-bg-overlay)',
    glass: 'var(--color-bg-glass)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    quaternary: 'var(--color-text-quaternary)',
    inverse: 'var(--color-text-inverse)',
    brand: 'var(--color-text-brand)',
    disabled: 'var(--color-text-disabled)',
    danger: 'var(--color-text-danger)',
    'brand-subtle': 'var(--color-text-brand-subtle)',
  },
  border: {
    default: 'var(--color-border-default)',
    subtle: 'var(--color-border-subtle)',
    danger: 'var(--color-border-danger)',
    focused: 'var(--color-border-focused)',
    strong: 'var(--color-border-strong)',
    brand: 'var(--color-border-brand)',
    primary: 'var(--color-border-primary)',
  },
  profile: {
    'team-a': 'var(--color-profile-team-a)',
    'team-b': 'var(--color-profile-team-b)',
    'team-c': 'var(--color-profile-team-c)',
    'team-d': 'var(--color-profile-team-d)',
    'team-e': 'var(--color-profile-team-e)',
    vi: 'var(--color-profile-vi)',
    guide: 'var(--color-profile-guide)',
  },
  icon: {
    primary: 'var(--color-icon-primary)',
    secondary: 'var(--color-icon-secondary)',
    tertiary: 'var(--color-icon-tertiary)',
    inverse: 'var(--color-icon-inverse)',
    brand: 'var(--color-icon-brand)',
    disabled: 'var(--color-icon-disabled)',
    'brand-secondary': 'var(--color-icon-brand-secondary)',
  },
  badge: {
    bg: {
      gray: 'var(--color-badge-bg-gray)',
      blue: 'var(--color-badge-bg-blue)',
      orange: 'var(--color-badge-bg-orange)',
      violet: 'var(--color-badge-bg-violet)',
      cyan: 'var(--color-badge-bg-cyan)',
      green: 'var(--color-badge-bg-green)',
      'solid-gray': 'var(--color-badge-bg-solid-gray)',
      'solid-cyan': 'var(--color-badge-bg-solid-cyan)',
    },
    text: {
      gray: 'var(--color-badge-text-gray)',
      blue: 'var(--color-badge-text-blue)',
      orange: 'var(--color-badge-text-orange)',
      violet: 'var(--color-badge-text-violet)',
      cyan: 'var(--color-badge-text-cyan)',
      green: 'var(--color-badge-text-green)',
      primitive: 'var(--color-badge-text-primitive)',
      cyan_2: 'var(--color-badge-text-cyan_2)',
    },
  },
} as const;

export const colorTokenMap = {
  'bg.default': 'var(--color-bg-default)',
  'bg.subtle': 'var(--color-bg-subtle)',
  'bg.surface': 'var(--color-bg-surface)',
  'bg.elevated': 'var(--color-bg-elevated)',
  'bg.brand-primary': 'var(--color-bg-brand-primary)',
  'bg.brand-soft': 'var(--color-bg-brand-soft)',
  'bg.dim-strong': 'var(--color-bg-dim-strong)',
  'bg.light-strong': 'var(--color-bg-light-strong)',
  'bg.brand-subtle': 'var(--color-bg-brand-subtle)',
  'bg.brand-soft2': 'var(--color-bg-brand-soft2)',
  'bg.brand-surface': 'var(--color-bg-brand-surface)',
  'bg.brand-event': 'var(--color-bg-brand-event)',
  'bg.light-soft': 'var(--color-bg-light-soft)',
  'bg.dim-soft': 'var(--color-bg-dim-soft)',
  'bg.overlay': 'var(--color-bg-overlay)',
  'bg.glass': 'var(--color-bg-glass)',
  'text.primary': 'var(--color-text-primary)',
  'text.secondary': 'var(--color-text-secondary)',
  'text.tertiary': 'var(--color-text-tertiary)',
  'text.quaternary': 'var(--color-text-quaternary)',
  'text.inverse': 'var(--color-text-inverse)',
  'text.brand': 'var(--color-text-brand)',
  'text.disabled': 'var(--color-text-disabled)',
  'text.danger': 'var(--color-text-danger)',
  'text.brand-subtle': 'var(--color-text-brand-subtle)',
  'border.default': 'var(--color-border-default)',
  'border.subtle': 'var(--color-border-subtle)',
  'border.danger': 'var(--color-border-danger)',
  'border.focused': 'var(--color-border-focused)',
  'border.strong': 'var(--color-border-strong)',
  'border.brand': 'var(--color-border-brand)',
  'border.primary': 'var(--color-border-primary)',
  'profile.team-a': 'var(--color-profile-team-a)',
  'profile.team-b': 'var(--color-profile-team-b)',
  'profile.team-c': 'var(--color-profile-team-c)',
  'profile.team-d': 'var(--color-profile-team-d)',
  'profile.team-e': 'var(--color-profile-team-e)',
  'profile.vi': 'var(--color-profile-vi)',
  'profile.guide': 'var(--color-profile-guide)',
  'icon.primary': 'var(--color-icon-primary)',
  'icon.secondary': 'var(--color-icon-secondary)',
  'icon.tertiary': 'var(--color-icon-tertiary)',
  'icon.inverse': 'var(--color-icon-inverse)',
  'icon.brand': 'var(--color-icon-brand)',
  'icon.disabled': 'var(--color-icon-disabled)',
  'icon.brand-secondary': 'var(--color-icon-brand-secondary)',
  'badge.bg.gray': 'var(--color-badge-bg-gray)',
  'badge.bg.blue': 'var(--color-badge-bg-blue)',
  'badge.bg.orange': 'var(--color-badge-bg-orange)',
  'badge.bg.violet': 'var(--color-badge-bg-violet)',
  'badge.bg.cyan': 'var(--color-badge-bg-cyan)',
  'badge.bg.green': 'var(--color-badge-bg-green)',
  'badge.bg.solid-gray': 'var(--color-badge-bg-solid-gray)',
  'badge.bg.solid-cyan': 'var(--color-badge-bg-solid-cyan)',
  'badge.text.gray': 'var(--color-badge-text-gray)',
  'badge.text.blue': 'var(--color-badge-text-blue)',
  'badge.text.orange': 'var(--color-badge-text-orange)',
  'badge.text.violet': 'var(--color-badge-text-violet)',
  'badge.text.cyan': 'var(--color-badge-text-cyan)',
  'badge.text.green': 'var(--color-badge-text-green)',
  'badge.text.primitive': 'var(--color-badge-text-primitive)',
  'badge.text.cyan_2': 'var(--color-badge-text-cyan_2)',
} as const;

export type ColorToken = keyof typeof colorTokenMap;

export const resolveColorToken = (token: ColorToken): ColorValue => colorTokenMap[token];

const flattenSemanticColors = (
  value: Record<string, unknown>,
  path: string[] = [],
): Array<[name: string, color: string]> => {
  return Object.entries(value).flatMap(([key, childValue]) => {
    const nextPath = [...path, key];

    if (typeof childValue === 'string') {
      return [[nextPath.join('-'), childValue] as [string, string]];
    }

    return flattenSemanticColors(childValue as Record<string, unknown>, nextPath);
  });
};

const createColorModeCssVariables = (modeColors: Record<string, unknown>) => {
  return flattenSemanticColors(modeColors)
    .map(([name, value]) => `  --color-${name}: ${value};`)
    .join('\n');
};

export const colorModeCssVariables = {
  light: createColorModeCssVariables(semanticColorModes.light),
  dark: createColorModeCssVariables(semanticColorModes.dark),
} as const satisfies Record<ColorMode, string>;
