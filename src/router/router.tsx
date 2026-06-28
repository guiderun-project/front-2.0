import type { ComponentType, ReactElement } from 'react';
import { lazy, Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import {
  LoaderScreen,
  PageLayout,
  type PageLayoutBackground,
  type PageLayoutGradientBackground,
} from '@/components';
import { BottomNavigationLayout } from '@/router/BottomNavigationLayout';
import { PageTitle } from '@/router/PageTitle';
import { ROUTE_PAGE_TITLES } from '@/router/title';
import { GuestOnlyRoute } from '@/router/GuestOnlyRoute';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { MainPage } from '@/pages';
import { EventsPage } from '@/pages/events';
import { EventDetailRouteProvider } from '@/pages/events/[eventId]/EventDetailRouteProvider';
import { EventDetailPage } from '@/pages/events/[eventId]';
import { EventSearchPage } from '@/pages/events/search';
import { MyPage } from '@/pages/my';
import { MyEditPage } from '@/pages/my/edit';
import { MyEventsPage } from '@/pages/my/events';

type LazyRouteAccess = 'public' | 'guest-only' | 'authenticated' | 'approved';

const DesignPage = lazy(() =>
  import('@/pages/design').then(({ DesignPage }) => ({ default: DesignPage })),
);
const FormDesignPage = lazy(() =>
  import('@/pages/design/form').then(({ FormDesignPage }) => ({
    default: FormDesignPage,
  })),
);
const IntroPage = lazy(() =>
  import('@/pages/intro').then(({ IntroPage }) => ({ default: IntroPage })),
);
const KakaoOAuthPage = lazy(() =>
  import('@/pages/oauth').then(({ KakaoOAuthPage }) => ({
    default: KakaoOAuthPage,
  })),
);
const LoginPage = lazy(() =>
  import('@/pages/login').then(({ LoginPage }) => ({ default: LoginPage })),
);
const SignupPage = lazy(() =>
  import('@/pages/signup').then(({ SignupPage }) => ({ default: SignupPage })),
);
const AccountFindPage = lazy(() =>
  import('@/pages/account-find').then(({ AccountFindPage }) => ({
    default: AccountFindPage,
  })),
);
const TermsPage = lazy(() =>
  import('@/pages/terms').then(({ TermsPage }) => ({ default: TermsPage })),
);
const EventNewPage = lazy(() =>
  import('@/pages/events/new').then(({ EventNewPage }) => ({
    default: EventNewPage,
  })),
);
const EventApplyPage = lazy(() =>
  import('@/pages/events/[eventId]/apply').then(({ EventApplyPage }) => ({
    default: EventApplyPage,
  })),
);
const EventAttendancePage = lazy(() =>
  import('@/pages/events/[eventId]/attendance').then(
    ({ EventAttendancePage }) => ({
      default: EventAttendancePage,
    }),
  ),
);
const EventEditPage = lazy(() =>
  import('@/pages/events/[eventId]/edit').then(({ EventEditPage }) => ({
    default: EventEditPage,
  })),
);
const EventMatchPage = lazy(() =>
  import('@/pages/events/[eventId]/match').then(({ EventMatchPage }) => ({
    default: EventMatchPage,
  })),
);
const EventSupportPage = lazy(() =>
  import('@/pages/events/[eventId]/support').then(({ EventSupportPage }) => ({
    default: EventSupportPage,
  })),
);
const AccountDeletePage = lazy(() =>
  import('@/pages/account-delete').then(({ AccountDeletePage }) => ({
    default: AccountDeletePage,
  })),
);

const createRouteFallback = (
  background: PageLayoutBackground = 'bg.default',
  gradient?: PageLayoutGradientBackground,
): ReactElement => (
  <PageLayout background={background} gradient={gradient}>
    <LoaderScreen />
  </PageLayout>
);
// TODO: 스켈레톤 정책이 정해지면 route fallback에서 PageLayout 안에 페이지별 skeleton을 렌더링하도록 확장한다.

const withRouteAccess = (
  pageElement: ReactElement,
  access: LazyRouteAccess = 'public',
  fallback: ReactElement | null = null,
): ReactElement => {
  if (access === 'guest-only') {
    return <GuestOnlyRoute fallback={fallback ?? undefined}>{pageElement}</GuestOnlyRoute>;
  }

  if (access === 'authenticated') {
    return <ProtectedRoute fallback={fallback ?? undefined}>{pageElement}</ProtectedRoute>;
  }

  if (access === 'approved') {
    return (
      <ProtectedRoute access="approved" fallback={fallback ?? undefined}>
        {pageElement}
      </ProtectedRoute>
    );
  }

  return pageElement;
};

const withPageTitle = (
  pageElement: ReactElement,
  title?: string,
): ReactElement => {
  if (!title) {
    return pageElement;
  }

  return (
    <>
      <PageTitle title={title} />
      {pageElement}
    </>
  );
};

const createRouteElement = (
  Page: ComponentType,
  access: LazyRouteAccess = 'public',
  fallback: ReactElement | null = null,
  title?: string,
): ReactElement => {
  return withRouteAccess(withPageTitle(<Page />, title), access, fallback);
};

const createLazyRouteElement = (
  Page: ComponentType,
  access: LazyRouteAccess = 'public',
  fallback: ReactElement | null = null,
  title?: string,
): ReactElement => {
  const pageElement = (
    <Suspense fallback={fallback}>
      <Page />
    </Suspense>
  );

  return withRouteAccess(withPageTitle(pageElement, title), access, fallback);
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <BottomNavigationLayout />,
        children: [
          {
            index: true,
            element: createRouteElement(
              MainPage,
              'public',
              createRouteFallback('bg.subtle', 'gradient.bg.brand-main'),
              ROUTE_PAGE_TITLES.MAIN,
            ),
          },
          {
            path: 'events',
            element: createRouteElement(
              EventsPage,
              'public',
              createRouteFallback('bg.default'),
              '전체 모임',
            ),
          },
          {
            path: 'design',
            element: createLazyRouteElement(
              DesignPage,
              'public',
              createRouteFallback('bg.subtle'),
              '디자인 시스템',
            ),
          },
          {
            path: 'my',
            element: createRouteElement(
              MyPage,
              'authenticated',
              createRouteFallback('bg.subtle'),
              '마이페이지',
            ),
          },
        ],
      },
      {
        path: 'events/search',
        element: createRouteElement(
          EventSearchPage,
          'public',
          createRouteFallback('bg.default'),
          '모임 검색',
        ),
      },
      {
        path: 'design/form',
        element: createLazyRouteElement(
          FormDesignPage,
          'public',
          createRouteFallback('bg.subtle'),
          '폼 디자인',
        ),
      },
      {
        path: 'intro',
        element: createLazyRouteElement(
          IntroPage,
          'public',
          createRouteFallback('bg.subtle', 'gradient.bg.brand-main'),
          '시작하기',
        ),
      },
      {
        path: 'oauth',
        element: createLazyRouteElement(
          KakaoOAuthPage,
          'public',
          createRouteFallback('bg.subtle'),
          '로그인 처리',
        ),
      },
      {
        path: 'login',
        element: createLazyRouteElement(
          LoginPage,
          'guest-only',
          createRouteFallback('bg.default'),
          '로그인',
        ),
      },
      {
        path: 'signup',
        element: createLazyRouteElement(
          SignupPage,
          'guest-only',
          createRouteFallback('bg.subtle'),
          '회원가입',
        ),
      },
      {
        path: 'account-find',
        element: createLazyRouteElement(
          AccountFindPage,
          'guest-only',
          createRouteFallback('bg.default'),
        ),
      },
      {
        path: 'terms',
        element: createLazyRouteElement(
          TermsPage,
          'public',
          createRouteFallback('bg.subtle'),
          '약관',
        ),
      },
      {
        path: 'events/new',
        element: createLazyRouteElement(
          EventNewPage,
          'approved',
          createRouteFallback('bg.subtle'),
          '모임 만들기',
        ),
      },
      {
        path: 'events/:eventId',
        element: createRouteElement(
          EventDetailRouteProvider,
          'public',
          createRouteFallback('bg.brand-event', 'gradient.bg.brand-event'),
        ),
        children: [
          {
            index: true,
            element: createRouteElement(
              EventDetailPage,
              'public',
              createRouteFallback('bg.brand-event', 'gradient.bg.brand-event'),
            ),
          },
          {
            path: 'apply',
            element: createLazyRouteElement(
              EventApplyPage,
              'approved',
              createRouteFallback('bg.subtle'),
            ),
          },
          {
            path: 'edit',
            element: createLazyRouteElement(
              EventEditPage,
              'approved',
              createRouteFallback('bg.subtle'),
            ),
          },
          {
            path: 'match',
            element: createLazyRouteElement(
              EventMatchPage,
              'approved',
              createRouteFallback('bg.subtle'),
            ),
          },
          {
            path: 'attendance',
            element: createLazyRouteElement(
              EventAttendancePage,
              'approved',
              createRouteFallback('bg.subtle'),
            ),
          },
        ],
      },
      {
        path: 'events/supports',
        element: createLazyRouteElement(
          EventSupportPage,
          'public',
          createRouteFallback('bg.subtle'),
          '이동지원 연락처',
        ),
      },
      {
        path: 'my/events',
        element: createRouteElement(
          MyEventsPage,
          'authenticated',
          createRouteFallback('bg.subtle'),
          '나의 활동',
        ),
      },
      {
        path: 'my/edit',
        element: createRouteElement(
          MyEditPage,
          'authenticated',
          createRouteFallback('bg.surface'),
        ),
      },
      {
        path: 'account-delete',
        element: createLazyRouteElement(
          AccountDeletePage,
          'authenticated',
          createRouteFallback('bg.subtle'),
          '회원 탈퇴',
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
