import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';

import type { AttendancePageState } from '../attendancePageState';
import { AttendanceSection } from './AttendanceSection';
import { PanelState, SectionState } from './AttendanceStates';
import { CanceledParticipantCard } from './CanceledParticipantCard';
import { ParticipantActionCard } from './ParticipantActionCard';
import { ParticipantList } from './ParticipantList';

type AttendancePageContentProps = {
  isUpdatingAttendance: boolean;
  onAttend: (participant: AttendanceParticipant) => void;
  onCancelAttendance: (participant: AttendanceParticipant) => void;
  pageState: AttendancePageState;
};

const ATTENDANCE_EMPTY_TEXT = {
  attended: '출석 완료된 참가자가 없어요',
  canceled: '취소한 참가자가 없어요',
  waiting: '출석 대기 중인 참가자가 없어요',
} as const;

const sortViFirst = <TParticipant extends { type: AttendanceParticipant['type'] }>(
  participants: TParticipant[],
): TParticipant[] => {
  return [...participants].sort(
    (firstParticipant, secondParticipant) =>
      Number(secondParticipant.type === 'VI') -
      Number(firstParticipant.type === 'VI'),
  );
};

export const AttendancePageContent = ({
  isUpdatingAttendance,
  onAttend,
  onCancelAttendance,
  pageState,
}: AttendancePageContentProps): ReactElement => {
  switch (pageState.status) {
    case 'invalid-event':
      return (
        <Content>
          <PanelState role="alert">잘못된 이벤트 주소예요.</PanelState>
        </Content>
      );
    case 'permission-pending':
      return (
        <Content>
          <PanelState role="status">이벤트 정보를 확인하고 있어요.</PanelState>
        </Content>
      );
    case 'permission-error':
      return (
        <Content>
          <PanelState role="alert">
            이벤트 정보를 불러오지 못했어요.
          </PanelState>
        </Content>
      );
    case 'forbidden':
      return (
        <Content>
          <PanelState role="alert">
            출석 관리는 이벤트 주최자 또는 관리자만 접근할 수 있어요.
          </PanelState>
        </Content>
      );
    case 'attendance-pending':
      return (
        <Content>
          <PanelState role="status">출석 정보를 불러오고 있어요.</PanelState>
        </Content>
      );
    case 'attendance-error':
      return (
        <Content>
          <PanelState role="alert">
            출석 정보를 불러오지 못했어요.
          </PanelState>
        </Content>
      );
    case 'ready':
      break;
  }

  const { attendance, canceledParticipants } = pageState;
  const waitingParticipants = sortViFirst(attendance.waiting);
  const attendedParticipants = sortViFirst(attendance.attended);
  const canceledParticipantItems =
    canceledParticipants.status === 'ready'
      ? sortViFirst(canceledParticipants.participants)
      : [];

  return (
    <Content>
      <SectionStack>
        <AttendanceSection
          count={attendance.summary.waitingCount}
          title="출석 대기"
        >
          <ParticipantList
            emptyText={ATTENDANCE_EMPTY_TEXT.waiting}
            participants={waitingParticipants}
            renderParticipant={(participant) => (
              <ParticipantActionCard
                disabled={isUpdatingAttendance}
                onAction={onAttend}
                participant={participant}
                status="waiting"
              />
            )}
          />
        </AttendanceSection>

        <AttendanceSection
          count={attendance.summary.attendedCount}
          hasDivider={true}
          title="출석 완료"
        >
          <ParticipantList
            emptyText={ATTENDANCE_EMPTY_TEXT.attended}
            participants={attendedParticipants}
            renderParticipant={(participant) => (
              <ParticipantActionCard
                disabled={isUpdatingAttendance}
                onAction={onCancelAttendance}
                participant={participant}
                status="attended"
              />
            )}
          />
        </AttendanceSection>

        <AttendanceSection
          count={canceledParticipantItems.length}
          hasDivider={true}
          title="취소한 참가자"
        >
          {canceledParticipants.status === 'pending' ? (
            <SectionState role="status">
              취소한 참가자를 불러오고 있어요.
            </SectionState>
          ) : null}
          {canceledParticipants.status === 'error' ? (
            <SectionState role="alert">
              취소한 참가자 명단을 불러오지 못했어요.
            </SectionState>
          ) : null}
          {canceledParticipants.status === 'ready' ? (
            <ParticipantList
              emptyText={ATTENDANCE_EMPTY_TEXT.canceled}
              participants={canceledParticipantItems}
              renderParticipant={(participant) => (
                <CanceledParticipantCard participant={participant} />
              )}
            />
          ) : null}
        </AttendanceSection>
      </SectionStack>
    </Content>
  );
};

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const SectionStack = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
}));
