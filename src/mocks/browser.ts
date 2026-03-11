import { setupWorker } from 'msw/browser';

import { adminHandlers } from './handlers/adminHandlers';
import { authHandlers } from './handlers/authHandlers';
import { eventHandlers } from './handlers/eventHandlers';
import { infoHandlers } from './handlers/infoHandlers';

export const worker = setupWorker(
  ...adminHandlers,
  ...authHandlers,
  ...eventHandlers,
  ...infoHandlers,
);
