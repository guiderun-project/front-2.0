import type { EventAttendanceResponse } from '@/api/types';
import type { EventCanceledApplicantListResponse } from '@/api/types/application';

export type CanceledAttendanceParticipants =
  EventCanceledApplicantListResponse['canceledApplicants'];

export type AttendanceMessageState = {
  message: string;
  role: 'alert' | 'status';
  status: 'message';
};

export type AttendanceReadyState = {
  attendance: EventAttendanceResponse;
  canceledParticipants: CanceledAttendanceParticipants;
  status: 'ready';
};

export type AttendancePageState = AttendanceMessageState | AttendanceReadyState;
