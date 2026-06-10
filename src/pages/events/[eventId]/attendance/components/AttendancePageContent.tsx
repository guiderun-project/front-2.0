import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant, EventAttendanceResponse } from '@/api/types';
import type { EventCanceledApplicantListResponse } from '@/api/types/application';

import { AttendanceSection } from './AttendanceSection';
import { PanelState, SectionState } from './AttendanceStates';
import { getAttendanceEmptyText } from './attendanceLabels';
import { CanceledParticipantCard } from './CanceledParticipantCard';
import { ParticipantActionCard } from './ParticipantActionCard';
import { ParticipantList } from './ParticipantList';

type AttendancePageContentProps = {
  attendanceData?: EventAttendanceResponse;
  canFetchEventAttendance: boolean;
  canManageAttendance: boolean;
  canceledApplicantsData?: EventCanceledApplicantListResponse;
  isAttendanceError: boolean;
  isAttendancePending: boolean;
  isPermissionError: boolean;
  isPermissionPending: boolean;
  isCanceledApplicantsError: boolean;
  isCanceledApplicantsPending: boolean;
  isUpdatingAttendance: boolean;
  onAttend: (participant: AttendanceParticipant) => void;
  onCancelAttendance: (participant: AttendanceParticipant) => void;
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
  attendanceData,
  canFetchEventAttendance,
  canManageAttendance,
  canceledApplicantsData,
  isAttendanceError,
  isAttendancePending,
  isPermissionError,
  isPermissionPending,
  isCanceledApplicantsError,
  isCanceledApplicantsPending,
  isUpdatingAttendance,
  onAttend,
  onCancelAttendance,
}: AttendancePageContentProps): ReactElement => {
  const waitingParticipants = sortParticipantsByRunnerType(
    attendanceData?.waiting ?? [],
  );
  const attendedParticipants = sortParticipantsByRunnerType(
    attendanceData?.attended ?? [],
  );
  const canceledParticipants = sortParticipantsByRunnerType(
    canceledApplicantsData?.canceledApplicants ?? [],
  );

  if (!canFetchEventAttendance) {
    return (
      <Content>
        <PanelState role="alert">잘못된 이벤트 주소입니다.</PanelState>
      </Content>
    );
  }

  if (isPermissionPending) {
    return (
      <Content>
        <PanelState role="status">이벤트 정보를 확인하는 중입니다.</PanelState>
      </Content>
    );
  }

  if (isPermissionError) {
    return (
      <Content>
        <PanelState role="alert">
          이벤트 정보를 불러오지 못했습니다.
        </PanelState>
      </Content>
    );
  }

  if (!canManageAttendance) {
    return (
      <Content>
        <PanelState role="alert">
          출석 관리는 이벤트 주최자 또는 관리자만 접근할 수 있어요.
        </PanelState>
      </Content>
    );
  }

  if (isAttendancePending) {
    return (
      <Content>
        <PanelState role="status">출석 정보를 불러오는 중입니다.</PanelState>
      </Content>
    );
  }

  if (isAttendanceError || !attendanceData) {
    return (
      <Content>
        <PanelState role="alert">출석 정보를 불러오지 못했습니다.</PanelState>
      </Content>
    );
  }

  return (
    <Content>
      <SectionStack>
        <AttendanceSection
          count={attendanceData.summary.waitingCount}
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
          count={attendanceData.summary.attendedCount}
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
          count={canceledParticipants.length}
          hasDivider={true}
          title="취소한 참가자"
        >
          {isCanceledApplicantsPending ? (
            <SectionState role="status">
              취소한 참가자를 불러오는 중입니다.
            </SectionState>
          ) : null}
          {isCanceledApplicantsError ? (
            <SectionState role="alert">
              취소한 참가자 명단을 불러오지 못했습니다.
            </SectionState>
          ) : null}
          {!isCanceledApplicantsPending && !isCanceledApplicantsError ? (
            <ParticipantList
              emptyText={getAttendanceEmptyText('canceled')}
              participants={canceledParticipants}
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
