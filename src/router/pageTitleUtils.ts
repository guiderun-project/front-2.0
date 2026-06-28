export const APP_TITLE = '가이드런프로젝트';

export type PageTitleText<TTitle extends string | undefined = undefined> =
  TTitle extends string ? `${TTitle} | ${typeof APP_TITLE}` : typeof APP_TITLE;

export const formatPageTitle = <
  TTitle extends string | undefined = undefined,
>(
  title?: TTitle,
): PageTitleText<TTitle> => {
  const pageTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE;

  return pageTitle as PageTitleText<TTitle>;
};
