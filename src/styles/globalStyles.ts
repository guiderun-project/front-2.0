import { css } from '@emotion/react';

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

  :root {
    font-family:
      "Pretendard",
      "SF Pro Display",
      sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color: #152021;
    background:
      radial-gradient(circle at top left, rgba(227, 198, 143, 0.32), transparent 34%),
      radial-gradient(circle at top right, rgba(168, 196, 173, 0.28), transparent 28%),
      linear-gradient(180deg, #f5efe4 0%, #eef2eb 100%);
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
    background: rgba(21, 32, 33, 0.16);
  }
`;
