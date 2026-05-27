import type { UserType } from './common';

export type EventAttendancePath = {
  eventId: number;
};

export type EventAttendanceResponse = {
  summary: {
    waitingCount: number;
    attendedCount: number;
  };
  waiting: AttendanceParticipant[];
  attended: AttendanceParticipant[];
};

export type AttendanceParticipant = {
  userId: string;
  name: string;
  type: UserType;
};

export type AttendanceUpdatePath = {
  eventId: number;
  userId: string;
};

export type AttendanceUpdateResponse = {
  userId: string;
  isAttended: true;
  summary: EventAttendanceResponse['summary'];
};

export type AttendanceCancelResponse = {
  userId: string;
  isAttended: false;
  summary: EventAttendanceResponse['summary'];
};

export type AttendedGuideRunnerListPath = EventAttendancePath;

export type AttendedGuideRunnerListResponse = {
  items: AttendedGuideRunner[];
};

export type AttendedGuideRunner = {
  name: string;
  birthDate: string | null;
  id1365: string | null;
};
