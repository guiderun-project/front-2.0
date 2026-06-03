import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import { BottomNavigationLayout } from '@/router/BottomNavigationLayout';
import { GuestOnlyRoute } from '@/router/GuestOnlyRoute';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { AccountDeletePage } from '@/pages/account-delete';
import { AccountFindPage } from '@/pages/account-find';
import { DesignPage } from '@/pages/design';
import { EventApplyPage } from '@/pages/events/[eventId]/apply';
import { EventAttendancePage } from '@/pages/events/[eventId]/attendance';
import { EventEditPage } from '@/pages/events/[eventId]/edit';
import { EventDetailPage } from '@/pages/events/[eventId]';
import { EventMatchPage } from '@/pages/events/[eventId]/match';
import { EventSupportPage } from '@/pages/events/[eventId]/support';
import { EventNewPage } from '@/pages/events/new';
import { EventSearchPage } from '@/pages/events/search';
import { EventsPage } from '@/pages/events';
import { IntroPage } from '@/pages/intro';
import { LoginPage } from '@/pages/login';
import { MainPage } from '@/pages';
import { MyEditPage } from '@/pages/my/edit';
import { MyEventsPage } from '@/pages/my/events';
import { MyPage } from '@/pages/my';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { KakaoOAuthPage } from '@/pages/oauth/kakao';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { SignupPage } from '@/pages/signup';
import { TermsPage } from '@/pages/terms';

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
            element: <MainPage />,
          },
          {
            path: 'events',
            element: <EventsPage />,
          },
          {
            path: 'events/search',
            element: <EventSearchPage />,
          },
          {
            path: 'my',
            element: (
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'design',
        element: <DesignPage />,
      },
      {
        path: 'intro',
        element: <IntroPage />,
      },
      {
        path: 'oauth/kakao',
        element: <KakaoOAuthPage />,
      },
      {
        path: 'login',
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <GuestOnlyRoute>
            <SignupPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: 'account-find',
        element: (
          <GuestOnlyRoute>
            <AccountFindPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'events/new',
        element: (
          <ProtectedRoute access="approved">
            <EventNewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:eventId',
        element: <EventDetailPage />,
      },
      {
        path: 'events/:eventId/apply',
        element: (
          <ProtectedRoute access="approved">
            <EventApplyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:eventId/edit',
        element: (
          <ProtectedRoute access="approved">
            <EventEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:eventId/match',
        element: (
          <ProtectedRoute access="approved">
            <EventMatchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:eventId/attendance',
        element: (
          <ProtectedRoute access="approved">
            <EventAttendancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:eventId/support',
        element: <EventSupportPage />,
      },
      {
        path: 'my/events',
        element: (
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my/edit',
        element: (
          <ProtectedRoute>
            <MyEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account-delete',
        element: (
          <ProtectedRoute>
            <AccountDeletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
