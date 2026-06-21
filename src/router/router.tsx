import type { ComponentType, ReactElement } from 'react';
import { lazy, Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import { BottomNavigationLayout } from '@/router/BottomNavigationLayout';
import { GuestOnlyRoute } from '@/router/GuestOnlyRoute';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';

type LazyRouteAccess = 'public' | 'guest-only' | 'authenticated' | 'approved';

const MainPage = lazy(() =>
  import('@/pages').then(({ MainPage }) => ({ default: MainPage })),
);
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
const EventsPage = lazy(() =>
  import('@/pages/events').then(({ EventsPage }) => ({ default: EventsPage })),
);
const EventSearchPage = lazy(() =>
  import('@/pages/events/search').then(({ EventSearchPage }) => ({
    default: EventSearchPage,
  })),
);
const EventNewPage = lazy(() =>
  import('@/pages/events/new').then(({ EventNewPage }) => ({
    default: EventNewPage,
  })),
);
const EventDetailRouteProvider = lazy(() =>
  import('@/pages/events/[eventId]/EventDetailRouteProvider').then(
    ({ EventDetailRouteProvider }) => ({
      default: EventDetailRouteProvider,
    }),
  ),
);
const EventDetailPage = lazy(() =>
  import('@/pages/events/[eventId]').then(({ EventDetailPage }) => ({
    default: EventDetailPage,
  })),
);
const EventApplyPage = lazy(() =>
  import('@/pages/events/[eventId]/apply').then(({ EventApplyPage }) => ({
    default: EventApplyPage,
  })),
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
const EventAttendancePage = lazy(() =>
  import('@/pages/events/[eventId]/attendance').then(
    ({ EventAttendancePage }) => ({
      default: EventAttendancePage,
    }),
  ),
);
const EventSupportPage = lazy(() =>
  import('@/pages/events/[eventId]/support').then(({ EventSupportPage }) => ({
    default: EventSupportPage,
  })),
);
const MyPage = lazy(() =>
  import('@/pages/my').then(({ MyPage }) => ({ default: MyPage })),
);
const MyEventsPage = lazy(() =>
  import('@/pages/my/events').then(({ MyEventsPage }) => ({
    default: MyEventsPage,
  })),
);
const MyEditPage = lazy(() =>
  import('@/pages/my/edit').then(({ MyEditPage }) => ({
    default: MyEditPage,
  })),
);
const AccountDeletePage = lazy(() =>
  import('@/pages/account-delete').then(({ AccountDeletePage }) => ({
    default: AccountDeletePage,
  })),
);

const createLazyRouteElement = (
  Page: ComponentType,
  access: LazyRouteAccess = 'public',
): ReactElement => {
  const pageElement = (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );

  if (access === 'guest-only') {
    return <GuestOnlyRoute>{pageElement}</GuestOnlyRoute>;
  }

  if (access === 'authenticated') {
    return <ProtectedRoute>{pageElement}</ProtectedRoute>;
  }

  if (access === 'approved') {
    return <ProtectedRoute access="approved">{pageElement}</ProtectedRoute>;
  }

  return pageElement;
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
            element: createLazyRouteElement(MainPage),
          },
          {
            path: 'events',
            element: createLazyRouteElement(EventsPage),
          },
          {
            path: 'design',
            element: createLazyRouteElement(DesignPage),
          },
          {
            path: 'my',
            element: createLazyRouteElement(MyPage, 'authenticated'),
          },
        ],
      },
      {
        path: 'events/search',
        element: createLazyRouteElement(EventSearchPage),
      },
      {
        path: 'design/form',
        element: createLazyRouteElement(FormDesignPage),
      },
      {
        path: 'intro',
        element: createLazyRouteElement(IntroPage),
      },
      {
        path: 'oauth',
        element: createLazyRouteElement(KakaoOAuthPage),
      },
      {
        path: 'login',
        element: createLazyRouteElement(LoginPage, 'guest-only'),
      },
      {
        path: 'signup',
        element: createLazyRouteElement(SignupPage, 'guest-only'),
      },
      {
        path: 'account-find',
        element: createLazyRouteElement(AccountFindPage, 'guest-only'),
      },
      {
        path: 'terms',
        element: createLazyRouteElement(TermsPage),
      },
      {
        path: 'events/new',
        element: createLazyRouteElement(EventNewPage, 'approved'),
      },
      {
        path: 'events/:eventId',
        element: createLazyRouteElement(EventDetailRouteProvider),
        children: [
          {
            index: true,
            element: createLazyRouteElement(EventDetailPage),
          },
          {
            path: 'apply',
            element: createLazyRouteElement(EventApplyPage, 'approved'),
          },
          {
            path: 'edit',
            element: createLazyRouteElement(EventEditPage, 'approved'),
          },
          {
            path: 'match',
            element: createLazyRouteElement(EventMatchPage, 'approved'),
          },
          {
            path: 'attendance',
            element: createLazyRouteElement(EventAttendancePage, 'approved'),
          },
        ],
      },
      {
        path: 'events/supports',
        element: createLazyRouteElement(EventSupportPage),
      },
      {
        path: 'my/events',
        element: createLazyRouteElement(MyEventsPage, 'authenticated'),
      },
      {
        path: 'my/edit',
        element: createLazyRouteElement(MyEditPage, 'authenticated'),
      },
      {
        path: 'account-delete',
        element: createLazyRouteElement(AccountDeletePage, 'authenticated'),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
