import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { AttendanceParticipant } from '@/api/types';

import type {
  AttendanceMessageState,
  AttendanceReadyState,
} from '../attendancePageState';
import { AttendanceSection } from './AttendanceSection';
import { PanelState } from './AttendanceStates';
import { CanceledParticipantCard } from './CanceledParticipantCard';
import { ParticipantActionCard } from './ParticipantActionCard';
import { ParticipantList } from './ParticipantList';

type AttendanceMessageContentProps = {
  pageState: AttendanceMessageState;
};

type AttendanceReadyContentProps = {
  pageState: AttendanceReadyState;
  updatingParticipantIds: ReadonlySet<string>;
  onAttend: (participant: AttendanceParticipant) => void;
  onCancelAttendance: (participant: AttendanceParticipant) => void;
};

type AttendancePageContentProps =
  | AttendanceMessageContentProps
  | AttendanceReadyContentProps;

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

const isReadyContentProps = (
  props: AttendancePageContentProps,
): props is AttendanceReadyContentProps => {
  return props.pageState.status === 'ready';
};

export const AttendancePageContent = (
  props: AttendancePageContentProps,
): ReactElement => {
  if (!isReadyContentProps(props)) {
    return (
      <Content>
        <PanelState role={props.pageState.role}>
          {props.pageState.message}
        </PanelState>
      </Content>
    );
  }

  const { attendance, canceledParticipants } = props.pageState;
  const {
    updatingParticipantIds,
    onAttend,
    onCancelAttendance,
  } = props;
  const waitingParticipants = sortViFirst(attendance.waiting);
  const attendedParticipants = sortViFirst(attendance.attended);
  const canceledParticipantItems = sortViFirst(canceledParticipants);

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
                disabled={updatingParticipantIds.has(participant.userId)}
                participant={participant}
                status="waiting"
                onAction={onAttend}
              />
            )}
          />
        </AttendanceSection>

        <AttendanceSection
          hasDivider={true}
          count={attendance.summary.attendedCount}
          title="출석 완료"
        >
          <ParticipantList
            emptyText={ATTENDANCE_EMPTY_TEXT.attended}
            participants={attendedParticipants}
            renderParticipant={(participant) => (
              <ParticipantActionCard
                disabled={updatingParticipantIds.has(participant.userId)}
                participant={participant}
                status="attended"
                onAction={onCancelAttendance}
              />
            )}
          />
        </AttendanceSection>

        <AttendanceSection
          hasDivider={true}
          count={canceledParticipantItems.length}
          title="취소한 참가자"
        >
          <ParticipantList
            emptyText={ATTENDANCE_EMPTY_TEXT.canceled}
            participants={canceledParticipantItems}
            renderParticipant={(participant) => (
              <CanceledParticipantCard participant={participant} />
            )}
          />
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
