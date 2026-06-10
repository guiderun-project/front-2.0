import type { EventAttendanceResponse } from '@/api/types';
import type { EventCanceledApplicantListResponse } from '@/api/types/application';

type CanceledAttendanceParticipants =
  EventCanceledApplicantListResponse['canceledApplicants'];

export type CanceledAttendanceParticipantsState =
  | { status: 'pending' }
  | { status: 'error' }
  | { status: 'ready'; participants: CanceledAttendanceParticipants };

export type AttendancePageState =
  | { status: 'invalid-event' }
  | { status: 'permission-pending' }
  | { status: 'permission-error' }
  | { status: 'forbidden' }
  | { status: 'attendance-pending' }
  | { status: 'attendance-error' }
  | {
      attendance: EventAttendanceResponse;
      canceledParticipants: CanceledAttendanceParticipantsState;
      status: 'ready';
    };
