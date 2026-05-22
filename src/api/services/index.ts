import applicationApi from './application';
import attendanceApi from './attendance';
import authApi from './auth';
import commentApi from './comment';
import eventApi from './event';
import matchingApi from './matching';
import userApi from './user';

export const api = {
  application: applicationApi,
  attendance: attendanceApi,
  auth: authApi,
  comment: commentApi,
  event: eventApi,
  matching: matchingApi,
  user: userApi,
} as const;
