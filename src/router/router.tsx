import { Navigate, createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import { BottomNavigationLayout } from '@/router/BottomNavigationLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { APP_PATH } from '@/router/path';
import { AuthPlaceholderPage } from '@/pages/AuthPlaceholderPage';
import { DesignPage } from '@/pages/DesignPage';
import { EventPage } from '@/pages/EventPage';
import { MyPage } from '@/pages/MyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';

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
            element: <Navigate replace to={APP_PATH.DESIGN} />,
          },
          {
            path: 'design',
            element: <DesignPage />,
          },
          {
            path: 'event',
            element: <EventPage />,
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
        path: 'auth/*',
        element: <AuthPlaceholderPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
