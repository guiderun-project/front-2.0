import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';

import type { AttendancePageState } from '../attendancePageState';
import { AttendanceSection } from './AttendanceSection';
import { PanelState, SectionState } from './AttendanceStates';
import { getAttendanceEmptyText } from './attendanceLabels';
import { CanceledParticipantCard } from './CanceledParticipantCard';
import { ParticipantActionCard } from './ParticipantActionCard';
import { ParticipantList } from './ParticipantList';

type AttendancePageContentProps = {
  isUpdatingAttendance: boolean;
  onAttend: (participant: AttendanceParticipant) => void;
  onCancelAttendance: (participant: AttendanceParticipant) => void;
  pageState: AttendancePageState;
};

type ParticipantWithRunnerType = {
  type: AttendanceParticipant['type'];
};

const PARTICIPANT_TYPE_ORDER: Record<AttendanceParticipant['type'], number> = {
  VI: 0,
  GUIDE: 1,
};

const sortParticipantsByRunnerType = <TParticipant extends ParticipantWithRunnerType>(
  participants: TParticipant[],
): TParticipant[] => {
  return [...participants].sort(
    (firstParticipant, secondParticipant) =>
      PARTICIPANT_TYPE_ORDER[firstParticipant.type] -
      PARTICIPANT_TYPE_ORDER[secondParticipant.type],
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
          <PanelState role="alert">잘못된 이벤트 주소입니다.</PanelState>
        </Content>
      );
    case 'permission-pending':
      return (
        <Content>
          <PanelState role="status">이벤트 정보를 확인하는 중입니다.</PanelState>
        </Content>
      );
    case 'permission-error':
      return (
        <Content>
          <PanelState role="alert">
            이벤트 정보를 불러오지 못했습니다.
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
          <PanelState role="status">출석 정보를 불러오는 중입니다.</PanelState>
        </Content>
      );
    case 'attendance-error':
      return (
        <Content>
          <PanelState role="alert">
            출석 정보를 불러오지 못했습니다.
          </PanelState>
        </Content>
      );
    case 'ready':
      break;
  }

  const { attendance, canceledParticipants } = pageState;
  const waitingParticipants = sortParticipantsByRunnerType(attendance.waiting);
  const attendedParticipants = sortParticipantsByRunnerType(attendance.attended);
  const canceledParticipantItems =
    canceledParticipants.status === 'ready'
      ? sortParticipantsByRunnerType(canceledParticipants.participants)
      : [];

  return (
    <Content>
      <SectionStack>
        <AttendanceSection
          count={attendance.summary.waitingCount}
          title="출석 대기"
        >
          <ParticipantList
            emptyText={getAttendanceEmptyText('waiting')}
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
            emptyText={getAttendanceEmptyText('attended')}
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
              취소한 참가자를 불러오는 중입니다.
            </SectionState>
          ) : null}
          {canceledParticipants.status === 'error' ? (
            <SectionState role="alert">
              취소한 참가자 명단을 불러오지 못했습니다.
            </SectionState>
          ) : null}
          {canceledParticipants.status === 'ready' ? (
            <ParticipantList
              emptyText={getAttendanceEmptyText('canceled')}
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
