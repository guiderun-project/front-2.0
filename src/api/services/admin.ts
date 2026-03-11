import { isAxiosError } from 'axios';

import { axiosInstanceWithToken } from '../core/client';
import {
  AdminApplyListCountGetRequest,
  AdminApplyListCountGetResponse,
  AdminApplyListGetRequest,
  AdminApplyListGetResponse,
  AdminApprovalEventPostRequest,
  AdminApproveUserPostRequest,
  AdminApproveUserPostResponse,
  AdminCurrentEventGetRequest,
  AdminCurrentEventGetResponse,
  AdminEventGuide1365IdGetRequest,
  AdminEventGuide1365IdGetResponse,
  AdminEventHistoryCountGetRequest,
  AdminEventHistoryCountGetResponse,
  AdminEventHistoryGetRequest,
  AdminEventHistoryGetResponse,
  AdminEventListCountGetResponse,
  AdminEventListGetRequest,
  AdminEventListGetResponse,
  AdminEventResultGetRequest,
  AdminEventResultGetResponse,
  AdminEventTotalCountGetRequest,
  AdminEventTotalCountGetResponse,
  AdminEventTypeCountGetRequest,
  AdminEventTypeCountGetResponse,
  AdminGuideApplyGetRequest,
  AdminGuideApplyGetResponse,
  AdminNewUserGetRequest,
  AdminNewUserGetResponse,
  AdminPartnerHistoryCountGetRequest,
  AdminPartnerHistoryCountGetResponse,
  AdminPartnerHistoryGetRequest,
  AdminPartnerHistoryGetResponse,
  AdminPartnerTypeCountGetRequest,
  AdminPartnerTypeCountGetResponse,
  AdminSearchEventCountGetRequest,
  AdminSearchEventCountGetResponse,
  AdminSearchEventGetRequest,
  AdminSearchEventGetResponse,
  AdminSearchEventHistoryCountGetRequest,
  AdminSearchEventHistoryCountGetResponse,
  AdminSearchEventHistoryGetRequest,
  AdminSearchEventHistoryGetResponse,
  AdminSearchPartnerHistoryCountGetRequest,
  AdminSearchPartnerHistoryCountGetResponse,
  AdminSearchPartnerHistoryGetRequest,
  AdminSearchPartnerHistoryGetResponse,
  AdminSearchWithdrawalListCountGetRequest,
  AdminSearchWithdrawalListCountGetResponse,
  AdminSearchWithdrawalListGetRequest,
  AdminSearchWithdrawalListGetResponse,
  AdminUserListCountGetResponse,
  AdminUserListGetRequest,
  AdminUserListGetResponse,
  AdminUserSearchCountGetRequest,
  AdminUserSearchCountGetResponse,
  AdminUserSearchGetRequest,
  AdminUserSearchGetResponse,
  AdminViApplyGetRequest,
  AdminViApplyGetResponse,
  AdminWithdrawalListCountGetResponse,
  AdminWithdrawalListGetRequest,
  AdminWithdrawalListGetResponse,
} from '../contracts/admin';
import { ErrorType } from '../contracts/error';

import { EventType } from '@/api/contracts/common/group';

class AdminApi {
  private async handleRequest<T>(request: () => Promise<T>) {
    try {
      return await request();
    } catch (error) {
      if (isAxiosError<ErrorType>(error)) {
        throw error;
      }
      throw new Error('예상치 못한 에러 발생');
    }
  }
  adminUserListGet = async ({
    limit,
    start,
    approval,
    gender,
    team,
    time,
    type,
  }: AdminUserListGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminUserListGetResponse>(
        `/admin/user-list`,
        {
          params: {
            limit,
            start,
            approval,
            gender,
            time,
            type,
            name_team: team,
          },
        },
      );
      return res.data.items;
    });
  };

  adminUserListCountGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminUserListCountGetResponse>(
          `/admin/user-list/count`,
        );
      return res.data.count;
    });
  };

  adminWithdrawalListCountGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminWithdrawalListCountGetResponse>(
          '/admin/withdrawal-list/count',
        );
      return res.data.count;
    });
  };

  adminWithdrawlListGet = async ({
    limit = 10,
    start = 0,
    approval,
    gender,
    team,
    time,
    type,
  }: AdminWithdrawalListGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminWithdrawalListGetResponse>(
          `/admin/withdrawal-list`,
          {
            params: {
              limit,
              start,
              approval,
              gender,
              time,
              type,
              name_team: team,
            },
          },
        );
      return res.data.items;
    });
  };

  adminSearchWithdrawalListCountGet = async ({
    text,
  }: AdminSearchWithdrawalListCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchWithdrawalListCountGetResponse>(
          `/admin/search/withdrawal-list/count`,
          { params: { text } },
        );
      return res.data.count;
    });
  };

  adminSearchWithdrawalListGet = async ({
    limit,
    start,
    text,
    approval,
    gender,
    team,
    time,
    type,
  }: AdminSearchWithdrawalListGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchWithdrawalListGetResponse>(
          `/admin/search/withdrawal-list`,
          {
            params: {
              text,
              approval,
              limit,
              start,
              gender,
              time,
              type,
              name_team: team,
            },
          },
        );
      return res.data.items;
    });
  };

  adminUserSearchGet = async ({
    limit,
    start,
    text,
    approval,
    gender,
    team,
    time,
    type,
  }: AdminUserSearchGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminUserSearchGetResponse>(
        `/admin/search/user`,
        {
          params: {
            limit,
            start,
            text,
            approval,
            gender,
            time,
            type,
            name_team: team,
          },
        },
      );
      return res.data.items;
    });
  };

  adminUserSearchCountGet = async ({
    text,
  }: AdminUserSearchCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminUserSearchCountGetResponse>(
          `/admin/search/user/count`,
          { params: { text } },
        );
      return res.data.count;
    });
  };

  adminViApplyGet = async ({ userId }: AdminViApplyGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminViApplyGetResponse>(
        `/admin/apply/vi/${userId}`,
      );
      return res.data;
    });
  };

  adminGuideApplyGet = async ({ userId }: AdminGuideApplyGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminGuideApplyGetResponse>(
        `/admin/apply/guide/${userId}`,
      );
      return res.data;
    });
  };

  adminApproveUserPost = async ({
    isApprove,
    userId,
    recordDegree,
  }: AdminApproveUserPostRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.post<AdminApproveUserPostResponse>(
          `/admin/approval-user/${userId}`,
          {
            isApprove,
            recordDegree,
          },
        );
      return res.data;
    });
  };

  adminEventListGet = async ({
    limit,
    start,
    approval,
    name,
    organizer,
    time,
  }: AdminEventListGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminEventListGetResponse>(
        `/admin/event-list`,
        {
          params: { limit, start, approval, name, organizer, time },
        },
      );
      return res.data.items;
    });
  };

  adminEventListCountGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventListCountGetResponse>(
          `/admin/event-list/count`,
        );
      return res.data.count;
    });
  };

  adminSearchEventGet = async ({
    search,
    approval,
    name,
    organizer,
    time,
    limit,
    start,
  }: AdminSearchEventGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminSearchEventGetResponse>(
        `/admin/search/event`,
        {
          params: {
            text: search,
            limit,
            start,
            approval,
            name,
            organizer,
            time,
          },
        },
      );
      return res.data.items;
    });
  };

  adminSearchEventCountGet = async ({
    search,
  }: AdminSearchEventCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchEventCountGetResponse>(
          `/admin/search/event/count`,
          { params: { text: search } },
        );
      return res.data.count;
    });
  };

  adminEventHistoryGet = async ({
    limit,
    start,
    userId,
  }: AdminEventHistoryGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventHistoryGetResponse>(
          `/admin/event-list/${userId}`,
          { params: { start, limit } },
        );
      return res.data.items;
    });
  };

  adminEventHistoryCountGet = async ({
    userId,
  }: AdminEventHistoryCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventHistoryCountGetResponse>(
          `/admin/event-list/count/${userId}`,
        );
      return res.data.count;
    });
  };

  adminEventTotalCountGet = async ({
    userId,
  }: AdminEventTotalCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventTotalCountGetResponse>(
          `/admin/${userId}/event-type/count`,
        );
      return res.data;
    });
  };

  adminNewUserGet = async ({
    limit = 6,
    start = 0,
  }: AdminNewUserGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminNewUserGetResponse>(
        `/admin/new-user`,
        { params: { limit, start } },
      );
      return res.data.items;
    });
  };

  adminCurrentEventGet = async ({
    limit = 4,
    start = 0,
  }: AdminCurrentEventGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminCurrentEventGetResponse>(
          `/admin/current-event`,
          { params: { limit, start } },
        );
      return res.data.items;
    });
  };

  adminEventTypeCountGet = async ({
    userId,
  }: AdminEventTypeCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventTypeCountGetResponse>(
          `/admin/event-type/count/${userId}`,
        );
      return res.data;
    });
  };

  adminSearchEventHistoryCountGet = async ({
    text,
    userId,
  }: AdminSearchEventHistoryCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchEventHistoryCountGetResponse>(
          `/admin/search/event-list/count/${userId}`,
          { params: { text } },
        );
      return res.data.count;
    });
  };

  adminSearchEventHistoryGet = async ({
    text,
    userId,
    limit = 5,
    start = 0,
  }: AdminSearchEventHistoryGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchEventHistoryGetResponse>(
          `/admin/search/event-list/${userId}`,
          { params: { text, limit, start } },
        );
      return res.data.items;
    });
  };

  adminPartnerTypeCountGet = async ({
    userId,
  }: AdminPartnerTypeCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminPartnerTypeCountGetResponse>(
          `/admin/partner-type/count/${userId}`,
        );
      return res.data;
    });
  };

  adminPartnerHistoryCountGet = async ({
    userId,
    kind = EventType.TOTAL,
  }: AdminPartnerHistoryCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminPartnerHistoryCountGetResponse>(
          `/admin/partner-list/count/${userId}`,
          { params: { kind } },
        );
      return res.data.count;
    });
  };

  adminPartnerHistoryGet = async ({
    userId,
    kind = EventType.TOTAL,
    limit = 6,
    start = 0,
  }: AdminPartnerHistoryGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminPartnerHistoryGetResponse>(
          `/admin/partner-list/${userId}`,
          { params: { kind, limit, start } },
        );
      return res.data.items;
    });
  };

  adminSearchPartnerHistoryCountGet = async ({
    userId,
    text,
  }: AdminSearchPartnerHistoryCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchPartnerHistoryCountGetResponse>(
          `/admin/search/partner-list/count/${userId}`,
          { params: { text } },
        );
      return res.data.count;
    });
  };

  adminSearchPartnerHistoryGet = async ({
    text,
    userId,
    limit = 6,
    start = 0,
  }: AdminSearchPartnerHistoryGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminSearchPartnerHistoryGetResponse>(
          `admin/search/partner-list/${userId}`,
          { params: { text, limit, start } },
        );
      return res.data.items;
    });
  };

  adminApprovalEventPostRequest = async ({
    approval,
    eventId,
  }: AdminApprovalEventPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(
        `/admin/approval-event/${eventId}`,
        { approval },
      );
      return res.data;
    });
  };

  adminEventResultGet = async ({ eventId }: AdminEventResultGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminEventResultGetResponse>(
        `/admin/event-result/${eventId}`,
      );
      return res.data;
    });
  };

  adminApplyListGet = async ({
    eventId,
    limit,
    start,
    team,
    time,
    typeName,
  }: AdminApplyListGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AdminApplyListGetResponse>(
        `/admin/apply-list/${eventId}`,
        { params: { limit, start, team, time, type_name: typeName } },
      );
      return res.data.items;
    });
  };

  adminApplyListCountGet = async ({
    eventId,
  }: AdminApplyListCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminApplyListCountGetResponse>(
          `/admin/apply-list/count/${eventId}`,
        );
      return res.data.count;
    });
  };

  adminEventGuide1365IdGet = async ({
    eventId,
  }: AdminEventGuide1365IdGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<AdminEventGuide1365IdGetResponse>(
          `/admin/event/${eventId}/guide/1365id`,
        );
      return res.data;
    });
  };
}

const adminApi = new AdminApi();

export default adminApi;
