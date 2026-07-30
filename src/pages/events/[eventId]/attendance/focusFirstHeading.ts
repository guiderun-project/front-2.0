export const focusFirstHeading = (root: HTMLElement | null): boolean => {
  const heading = root?.querySelector<HTMLElement>('h1');

  if (!heading) {
    return false;
  }

  heading.setAttribute('tabindex', '-1');
  heading.focus();

  return true;
};
