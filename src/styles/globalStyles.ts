import { css } from '@emotion/react';

import {
  color,
  colorModeCssVariables,
  effectCssVariables,
  gradientModeCssVariables,
  highContrastCssVariables,
  highContrastRoleVariable,
} from './tokens';

export const globalStyles = css`
  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/pretendard/PretendardVariable.woff2") format("woff2");
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "April16th";
    src: url("/fonts/april16th/April16th-Promise.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @layer theme.base, theme.contrast;

  @layer theme.base {
    :root,
    :root[data-color-mode='light'] {
      ${colorModeCssVariables.light}
      ${gradientModeCssVariables.light}
      ${effectCssVariables}
      color-scheme: light;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-color-mode='light']) {
        ${colorModeCssVariables.dark}
        ${gradientModeCssVariables.dark}
        color-scheme: dark;
      }
    }

    :root[data-color-mode='dark'] {
      ${colorModeCssVariables.dark}
      ${gradientModeCssVariables.dark}
      color-scheme: dark;
    }
  }

  @layer theme.contrast {
    :root[data-contrast='high'],
    :root[data-color-mode='light'][data-contrast='high'] {
      ${highContrastCssVariables.light}
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-color-mode='light'])[data-contrast='high'] {
        ${highContrastCssVariables.dark}
      }
    }

    :root[data-color-mode='dark'][data-contrast='high'] {
      ${highContrastCssVariables.dark}
    }
  }

  :root {
    font-family:
      "Pretendard",
      "SF Pro Display",
      sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color: ${color.text.primary};
    background: ${color.bg.default};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    min-width: 320px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  ::selection {
    background: ${color.bg.overlay};
  }

  :root[data-contrast='high'] ::selection {
    color: ${highContrastRoleVariable['inverse-content']};
    background: ${highContrastRoleVariable['inverse-surface']};
  }
`;
