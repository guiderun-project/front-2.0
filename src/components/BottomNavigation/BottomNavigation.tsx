import type { ReactElement } from "react";

import styled from "@emotion/styled";
import { NavLink, useLocation } from "react-router-dom";

import { APP_PATH } from "@/router/path";

import { Icon } from "../Icon";
import {
  BOTTOM_NAVIGATION_ARIA_LABEL,
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_OFFSET_PX,
} from "./BottomNavigation.constants";

type BottomNavigationItem = (typeof BOTTOM_NAVIGATION_ITEMS)[number];

type BottomNavigationProps = {
  className?: string;
};

export const BottomNavigation = ({
  className,
}: BottomNavigationProps): ReactElement => {
  const { pathname } = useLocation();
  const activeIndex = BOTTOM_NAVIGATION_ITEMS.findIndex((item) =>
    isNavigationItemActive(pathname, item),
  );
  const hasActiveItem = activeIndex >= 0;

  return (
    <Navigation aria-label={BOTTOM_NAVIGATION_ARIA_LABEL} className={className}>
      <NavigationTrack $activeIndex={activeIndex}>
        <ActivePill $isVisible={hasActiveItem} aria-hidden="true" />
        {BOTTOM_NAVIGATION_ITEMS.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <NavigationLink end={item.end} key={item.to} to={item.to}>
              <Icon
                aria-hidden="true"
                color={isActive ? "icon.primary" : "icon.tertiary"}
                icon={isActive ? item.activeIcon : item.inactiveIcon}
                size={24}
              />
              <NavigationLabel $isActive={isActive}>
                {item.label}
              </NavigationLabel>
            </NavigationLink>
          );
        })}
      </NavigationTrack>
    </Navigation>
  );
};

const normalizePathname = (pathname: string) => {
  if (pathname === APP_PATH.HOME) {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
};

const isNavigationItemActive = (
  pathname: string,
  item: BottomNavigationItem,
) => {
  const normalizedPathname = normalizePathname(pathname);

  if (item.end) {
    return normalizedPathname === item.to;
  }

  return (
    normalizedPathname === item.to ||
    normalizedPathname.startsWith(`${item.to}/`)
  );
};

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.control};
  width: 100%;
  max-width: var(
    --app-mobile-viewport-width,
    ${({ theme }) => theme.pxToRem(430)}
  );
  min-height: calc(
    ${({ theme }) => theme.pxToRem(BOTTOM_NAVIGATION_OFFSET_PX)} +
      max(${({ theme }) => theme.spacing.md}, env(safe-area-inset-bottom))
  );
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: max(
    ${({ theme }) => theme.spacing.md},
    env(safe-area-inset-bottom)
  );
  border-top: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ theme }) => theme.color.bg.subtle};
  transform: translateX(-50%);
`;

const ActivePill = styled.span<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ theme }) => theme.spacing.xl};
  width: calc(
    (
        100% - (${({ theme }) => theme.spacing.xl} * 2) -
          (${({ theme }) => theme.spacing.sm} * 2)
      ) /
      3
  );
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.bg.elevated};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: none;
  transform: translateX(
    calc(
      var(--bottom-navigation-active-index) *
        (100% + ${({ theme }) => theme.spacing.sm})
    )
  );
  transition:
    opacity 160ms ease-out,
    transform 200ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const NavigationTrack = styled.div<{ $activeIndex: number }>`
  --bottom-navigation-active-index: ${({ $activeIndex }) => $activeIndex};

  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const NavigationLink = styled(NavLink)`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.control};
  display: flex;
  min-width: 0;
  min-height: ${({ theme }) => theme.pxToRem(56)};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.tertiary};
  -webkit-tap-highlight-color: transparent;
  transition:
    color 160ms ease-out,
    transform 160ms ease-out;

  svg {
    transition:
      color 160ms ease-out,
      transform 160ms ease-out;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    svg {
      transition: none;
    }
  }
`;

const NavigationLabel = styled.span<{ $isActive: boolean }>(
  ({ $isActive, theme }) => {
    const typography =
      theme.typography[$isActive ? "detail-s-sb" : "detail-s-r"];

    return {
      minWidth: 0,
      color: $isActive ? theme.color.text.primary : theme.color.text.tertiary,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      overflowWrap: "anywhere",
      textAlign: "center",
      transition: "color 160ms ease-out",

      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    };
  },
);
