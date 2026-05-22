import { privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  AttendanceCancelResponse,
  AttendanceUpdatePath,
  AttendanceUpdateResponse,
  AttendedGuideRunnerListPath,
  AttendedGuideRunnerListResponse,
  EventAttendancePath,
  EventAttendanceResponse,
} from '@/api/types/attendance';

class AttendanceApi {
  /**
   * 이벤트 신청자의 출석 현황과 출석 요약을 조회한다.
   *
   * @see https://www.notion.so/3639802df4968132be7ff64a5b1639f7?pvs=1
   */
  statusGet = async ({ eventId }: EventAttendancePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventAttendanceResponse>(
        `/event/${eventId}/attendance`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트 신청자를 출석 처리한다.
   *
   * @see https://www.notion.so/3639802df49681b98d6ef656883d522b?pvs=1
   */
  attendPost = async ({ eventId, userId }: AttendanceUpdatePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<AttendanceUpdateResponse>(
        `/event/${eventId}/attendance/${userId}`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트 신청자의 출석 처리를 취소한다.
   *
   * @see https://www.notion.so/3639802df49681c58d3ad1ce370ed54d?pvs=1
   */
  attendDelete = async ({ eventId, userId }: AttendanceUpdatePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<AttendanceCancelResponse>(
        `/event/${eventId}/attendance/${userId}`,
      );

      return response.data;
    });
  };

  /**
   * 1365 제출용 출석 가이드러너 명단을 조회한다.
   *
   * @see https://www.notion.so/3639802df49681c89fbcd3d85efb2d88?pvs=1
   */
  attendedGuidesGet = async ({ eventId }: AttendedGuideRunnerListPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<AttendedGuideRunnerListResponse>(
        `/event/${eventId}/attendance/guides`,
      );

      return response.data;
    });
  };
}

const attendanceApi = new AttendanceApi();

export default attendanceApi;
