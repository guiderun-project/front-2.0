import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import { BottomNavigationLayout } from '@/router/BottomNavigationLayout';
import { AuthPlaceholderPage } from '@/pages/AuthPlaceholderPage';
import { EventPage } from '@/pages/EventPage';
import { HomePage } from '@/pages/HomePage';
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
            element: <HomePage />,
          },
          {
            path: 'event',
            element: <EventPage />,
          },
          {
            path: 'my',
            element: <MyPage />,
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
