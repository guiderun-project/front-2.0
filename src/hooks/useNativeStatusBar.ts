import { useEffect } from 'react';

import {
  resolveGradientTopColor,
  resolveHighContrastColor,
  resolveHighContrastGradientColor,
  semanticColorModes,
  type BackgroundGradientToken,
  type ColorMode,
  type ColorToken,
  type ContrastMode,
} from '@/styles/tokens';
import { useColorMode } from '@/styles/useColorMode';
import { useContrastMode } from '@/styles/useContrastMode';

export type StatusBarBackgroundToken = Extract<ColorToken, `bg.${string}`>;

type StatusBarStyle = 'dark' | 'light';

type StatusBarPayload = {
  backgroundColor: string;
  style: StatusBarStyle;
};

type RgbChannels = [red: number, green: number, blue: number];

const STATUS_BAR_MESSAGE_TYPE = 'SET_STATUS_BAR';
const BACKGROUND_TOKEN_PREFIX = 'bg.';
const HEX_COLOR_PATTERN = /^#[0-9a-f]+$/i;
const RGB_COLOR_PATTERN = /^rgba?\(([^)]+)\)$/i;
const CHANNEL_SEPARATOR_PATTERN = /[\s,/]+/;
const SRGB_LINEAR_CUTOFF = 0.03928;
const DARK_ICON_LUMINANCE_THRESHOLD = 0.179;

let lastSentPayload: StatusBarPayload | null = null;

export const useNativeStatusBar = (
  background: StatusBarBackgroundToken,
  gradient?: BackgroundGradientToken,
): void => {
  const { colorMode } = useColorMode();
  const { contrastMode } = useContrastMode();

  useEffect(() => {
    const payload = resolveStatusBarPayload({
      background,
      colorMode,
      contrastMode,
      gradient,
    });

    if (payload === null) {
      return;
    }

    lastSentPayload = payload;
    postStatusBarMessage(payload);
  }, [background, colorMode, contrastMode, gradient]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || lastSentPayload === null) {
        return;
      }

      postStatusBarMessage(lastSentPayload);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

const postStatusBarMessage = (payload: StatusBarPayload): void => {
  const bridge = window.ReactNativeWebView;

  if (!bridge) {
    return;
  }

  bridge.postMessage(
    JSON.stringify({
      type: STATUS_BAR_MESSAGE_TYPE,
      payload,
    }),
  );
};

type StatusBarPayloadInput = {
  background: StatusBarBackgroundToken;
  colorMode: ColorMode;
  contrastMode: ContrastMode;
  gradient?: BackgroundGradientToken;
};

const resolveStatusBarPayload = ({
  background,
  colorMode,
  contrastMode,
  gradient,
}: StatusBarPayloadInput): StatusBarPayload | null => {
  const topColor = resolveTopEdgeColor({
    background,
    colorMode,
    contrastMode,
    gradient,
  });
  const channels = parseRgbChannels(topColor);

  if (channels === null) {
    return null;
  }

  return {
    backgroundColor: toHexColor(channels),
    style:
      relativeLuminance(channels) > DARK_ICON_LUMINANCE_THRESHOLD
        ? 'dark'
        : 'light',
  };
};

const resolveTopEdgeColor = ({
  background,
  colorMode,
  contrastMode,
  gradient,
}: StatusBarPayloadInput): string => {
  const backgroundColor =
    contrastMode === 'high'
      ? resolveHighContrastColor(background, colorMode)
      : resolveSemanticBackgroundColor(background, colorMode);

  if (gradient === undefined) {
    return backgroundColor;
  }

  const gradientTopColor =
    contrastMode === 'high'
      ? resolveHighContrastGradientColor(gradient, colorMode)
      : resolveGradientTopColor(gradient, colorMode);

  return gradientTopColor ?? backgroundColor;
};

const resolveSemanticBackgroundColor = (
  token: StatusBarBackgroundToken,
  colorMode: ColorMode,
): string => {
  const backgroundColors: Record<string, string> =
    semanticColorModes[colorMode].bg;

  return backgroundColors[token.slice(BACKGROUND_TOKEN_PREFIX.length)];
};

const parseRgbChannels = (value: string): RgbChannels | null => {
  const normalized = value.trim();

  return HEX_COLOR_PATTERN.test(normalized)
    ? parseHexChannels(normalized)
    : parseFunctionalChannels(normalized);
};

const parseHexChannels = (value: string): RgbChannels | null => {
  const digits = value.slice(1);
  const isShorthand = digits.length === 3 || digits.length === 4;
  const isFullLength = digits.length === 6 || digits.length === 8;

  if (!isShorthand && !isFullLength) {
    return null;
  }

  const pairs = isShorthand
    ? Array.from(digits.slice(0, 3), (digit) => `${digit}${digit}`)
    : [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)];

  return [
    Number.parseInt(pairs[0], 16),
    Number.parseInt(pairs[1], 16),
    Number.parseInt(pairs[2], 16),
  ];
};

const parseFunctionalChannels = (value: string): RgbChannels | null => {
  const match = RGB_COLOR_PATTERN.exec(value);

  if (match === null) {
    return null;
  }

  const channels = match[1]
    .split(CHANNEL_SEPARATOR_PATTERN)
    .filter((part) => part !== '')
    .slice(0, 3)
    .map((part) => Number.parseFloat(part));

  if (
    channels.length !== 3 ||
    channels.some((channel) => Number.isNaN(channel))
  ) {
    return null;
  }

  return [channels[0], channels[1], channels[2]];
};

const toHexColor = (channels: RgbChannels): string =>
  `#${channels
    .map((channel) =>
      Math.round(Math.min(Math.max(channel, 0), 255))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase()}`;

const relativeLuminance = ([red, green, blue]: RgbChannels): number =>
  0.2126 * channelLuminance(red) +
  0.7152 * channelLuminance(green) +
  0.0722 * channelLuminance(blue);

const channelLuminance = (channel: number): number => {
  const normalized = channel / 255;

  return normalized <= SRGB_LINEAR_CUTOFF
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};
