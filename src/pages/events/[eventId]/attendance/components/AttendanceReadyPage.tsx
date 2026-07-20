import { useEffect, type ReactElement } from 'react';

import { HiddenText } from '@/components';

import { focusFirstHeading } from '../focusFirstHeading';
import { useAnnouncedMessage } from '../useAnnouncedMessage';
import { useEventAttendancePage } from '../useEventAttendancePage';
import { AttendanceLeadDescription } from './AttendanceLeadDescription';
import { AttendancePageContent } from './AttendancePageContent';
import { AttendancePageShell } from './AttendancePageShell';

type AttendanceReadyPageProps = {
  eventId: number;
};

export const AttendanceReadyPage = ({
  eventId,
}: AttendanceReadyPageProps): ReactElement => {
  const {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    updatingParticipantIds,
  } = useEventAttendancePage(eventId);
  const waitingCount = attendancePageState.attendance.summary.waitingCount;
  const politeAnnouncement = useAnnouncedMessage(
    announcement.politeness === 'polite' ? announcement.message : '',
    announcement.id,
  );
  const assertiveAnnouncement = useAnnouncedMessage(
    announcement.politeness === 'assertive' ? announcement.message : '',
    announcement.id,
  );

  useEffect(() => {
    // 출석 데이터가 준비되어 콘텐츠가 마운트되면 페이지 제목(h1)으로 포커스를
    // 옮겨 라우트 전환과 로딩 완료를 스크린리더에 함께 전달한다.
    focusFirstHeading(document.querySelector('main'));
  }, []);

  return (
    <AttendancePageShell
      description={<AttendanceLeadDescription waitingCount={waitingCount} />}
    >
      <HiddenText role="status">{politeAnnouncement}</HiddenText>
      <HiddenText role="alert">{assertiveAnnouncement}</HiddenText>
      <AttendancePageContent
        pageState={attendancePageState}
        updatingParticipantIds={updatingParticipantIds}
        onAttend={attendParticipant}
        onCancelAttendance={cancelAttendance}
      />
    </AttendancePageShell>
  );
};
