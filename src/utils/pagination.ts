export const FIRST_UI_PAGE = 1;
export const FIRST_BACKEND_PAGE = 0;

export const toBackendPage = (uiPage: number): number =>
  Math.max(uiPage - FIRST_UI_PAGE, FIRST_BACKEND_PAGE);

export const toUiPage = (backendPage: number): number =>
  Math.max(backendPage + FIRST_UI_PAGE, FIRST_UI_PAGE);
