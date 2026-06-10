import type { AttendanceParticipant } from '@/api/types';

type AttendanceActionStatus = 'waiting' | 'attended';

type ParticipantSummaryData = Pick<AttendanceParticipant, 'name' | 'type'> & {
  isFirstParticipation?: boolean;
};

const RUNNER_TYPE_LABEL = {
  VI: '시각장애러너',
  GUIDE: '가이드러너',
} as const satisfies Record<AttendanceParticipant['type'], string>;

export const ATTENDANCE_ACTION_LABEL = {
  waiting: '출석하기',
  attended: '출석취소',
} as const satisfies Record<AttendanceActionStatus, string>;

export const PARTICIPANT_STATUS_LABEL = {
  waiting: '출석 대기 상태',
  attended: '출석 완료 상태',
} as const satisfies Record<keyof typeof ATTENDANCE_ACTION_LABEL, string>;

export const PARTICIPANT_ACTION_LABEL = {
  waiting: '출석하기',
  attended: '출석 취소',
} as const satisfies Record<keyof typeof ATTENDANCE_ACTION_LABEL, string>;

export const getAttendanceParticipantSummaryLabel = (
  participant: ParticipantSummaryData,
): string => {
  const labels = [participant.name, RUNNER_TYPE_LABEL[participant.type]];

  if (participant.isFirstParticipation) {
    labels.push('첫 참여 참가자');
  }

  return labels.join(', ');
};

export const getAttendanceEmptyText = (
  status: keyof typeof ATTENDANCE_ACTION_LABEL | 'canceled',
): string => {
  if (status === 'waiting') {
    return '출석 대기 중인 참가자가 없어요';
  }

  if (status === 'attended') {
    return '출석 완료된 참가자가 없어요';
  }

  return '취소한 참가자가 없어요';
};
