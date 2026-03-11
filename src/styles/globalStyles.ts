import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    font-family:
      "IBM Plex Sans KR",
      "Pretendard Variable",
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
