import type { HttpHandler } from 'msw';

import { applicationHandlers } from './handlers/applicationHandlers';
import { attendanceHandlers } from './handlers/attendanceHandlers';
import { authHandlers } from './handlers/authHandlers';
import { commentHandlers } from './handlers/commentHandlers';
import { eventHandlers } from './handlers/eventHandlers';
import { matchingHandlers } from './handlers/matchingHandlers';
import { userHandlers } from './handlers/userHandlers';

export const handlers: HttpHandler[] = [
  ...authHandlers,
  ...userHandlers,
  ...applicationHandlers,
  ...attendanceHandlers,
  ...matchingHandlers,
  ...commentHandlers,
  ...eventHandlers,
];
