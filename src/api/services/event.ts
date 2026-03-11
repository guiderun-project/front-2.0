import { isAxiosError } from 'axios';

import { axiosInstanceWithToken } from '../core/client';
import { ErrorType } from '../contracts/error';
import {
  EventCalendarDetailGetRequest,
  EventCalendarDetailGetResponse,
  EventCalendarGetResponse,
  EventCalendarGetRequest,
  EventPopupGetRequest,
  EventPopupGetResponse,
  MyEventGetRequest,
  MyEventGetResponse,
  SearchEventCountGetRequest,
  SearchEventCountGetResponse,
  SearchEventGetRequest,
  SearchEventGetResponse,
  UpcomingEventDdayGetResponse,
  AllEventCountGetRequest,
  AllEventCountGetResponse,
  AllEventGetRequest,
  AllEventGetResponse,
  EventTypeCountGetResponse,
  NewEventPostRequest,
  NewEventPostResponse,
  EventTypeCountGetRequest,
  EventGetRequest,
  EventGetResponse,
  EditEventPatchResponse,
  EditEventPatchRequest,
  CloseEventPatchRequest,
  EventLikeCountGetRequest,
  EventLikeCountGetResponse,
  EventLikePostResponse,
  EventLikePoseRequest,
  EventCommentCountGetRequest,
  EventCommentCountGetResponse,
  EventCommentGetRequest,
  EventCommentGetResponse,
  EventCommentLikeCountGetRequest,
  EventCommentLikeCountGetResponse,
  EventCommentLikePostRequest,
  EventCommentLikePostResponse,
  EventCommentPostRequest,
  EventCommentPostResponse,
  EventCommentPatchRequest,
  EventCommentPatchResponse,
  EventCommentDeleteRequest,
  EventCommentDeleteResponse,
  EventApplyGetRequest,
  EventApplyGetResponse,
  EventApplyPatchRequest,
  EventApplyPatchResponse,
  EventApplyPostRequest,
  EventApplyPostResponse,
  EventApplyCountGetRequest,
  EventApplyCountGetResponse,
  EventApplyStatusGetRequest,
  EventApplyStatusGetResponse,
  EventAttendPostRequest,
  EventAttendStatusCountGetRequest,
  EventAttendStatusCountGetResponse,
  EventMatchingPostRequest,
  EventMatchingDeleteRequest,
  EventNotMatchingCountGetRequest,
  EventNotMatchingCountGetResponse,
  EventNotMatchingGetRequest,
  EventNotMatchingGetResponse,
  EventMatchedViCountGetRequest,
  EventMatchedViCountGetResponse,
  EventMatchedViGetRequest,
  EventMatchedViGetResponse,
  EventMatchedGuideCountGetRequest,
  EventMatchedGuideCountGetResponse,
  EventMatchedGuideGetRequest,
  EventMatchedGuideGetResponse,
  EventApplyAllGetRequest,
  EventApplyAllGetResponse,
  EventApplyDeleteRequest,
  EventDeleteRequest,
} from '../contracts/event';

class EventApi {
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

  eventGet = async ({ eventId }: EventGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventGetResponse>(
        `/event/${eventId}`,
      );
      return res.data;
    });
  };

  eventDelete = async ({ eventId }: EventDeleteRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.delete(`/event/${eventId}`);
      return res.data;
    });
  };

  allEventCountGet = async ({ kind, sort, type }: AllEventCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AllEventCountGetResponse>(
        `/event/all/count`,
        { params: { sort, type, kind } },
      );
      return res.data.count;
    });
  };

  allEventGet = async ({
    start = 0,
    limit = 6,
    kind,
    sort,
    type,
  }: AllEventGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<AllEventGetResponse>(
        `/event/all`,
        { params: { start, limit, kind, sort, type } },
      );
      return res.data.items;
    });
  };

  eventPopupGet = async ({ eventId }: EventPopupGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventPopupGetResponse>(
        `/event/pop/${eventId}`,
      );
      return res.data;
    });
  };

  upcomingEventDdayGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<UpcomingEventDdayGetResponse>(
          '/event/dday',
        );
      return res.data.eventItems;
    });
  };

  myEventGet = async ({ year, sort }: MyEventGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<MyEventGetResponse>(
        `/event/my`,
        { params: { sort, year } },
      );
      return res.data.items;
    });
  };

  searchEventCountGet = async ({ title }: SearchEventCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<SearchEventCountGetResponse>(
        `/event/search/count`,
        { params: { title } },
      );
      return res.data.count;
    });
  };

  searchEventGet = async ({ title, limit, start }: SearchEventGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<SearchEventGetResponse>(
        `/event/search`,
        { params: { title, limit, start } },
      );
      return res.data.items;
    });
  };

  eventCalendarGet = async ({ month, year }: EventCalendarGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventCalendarGetResponse>(
        `/event/calendar`,
        { params: { year, month } },
      );
      return res.data.result;
    });
  };

  eventCalendarDetailGet = async ({
    day,
    month,
    year,
  }: EventCalendarDetailGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventCalendarDetailGetResponse>(
          `/event/calendar/detail`,
          { params: { year, month, day } },
        );
      return res.data.items;
    });
  };

  eventTypeCountGet = async ({ userId }: EventTypeCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventTypeCountGetResponse>(
        `/user/event-type/count/${userId}`,
      );
      return res.data;
    });
  };

  newEventPost = async (body: NewEventPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<NewEventPostResponse>(
        '/event',
        body,
      );
      return res.data;
    });
  };

  editEventPatch = async ({
    eventId,
    EditEventPatchRequestBody,
  }: EditEventPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch<EditEventPatchResponse>(
        `/event/${eventId}`,
        EditEventPatchRequestBody,
      );
      return res.data;
    });
  };

  closeEventPatch = async ({ eventId }: CloseEventPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch(`/event/close/${eventId}`);
      return res.data;
    });
  };

  eventLikeCountGet = async ({ eventId }: EventLikeCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventLikeCountGetResponse>(
        `/event/${eventId}/likes/count`,
      );
      return res.data;
    });
  };

  eventLikePost = async ({ eventId }: EventLikePoseRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<EventLikePostResponse>(
        `/event/${eventId}/likes`,
      );
      return res.data.likes;
    });
  };

  eventCommentCountGet = async ({ eventId }: EventCommentCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventCommentCountGetResponse>(
          `/event/${eventId}/comments/count`,
        );
      return res.data.count;
    });
  };

  eventCommentGet = async ({
    eventId,
    limit = 4,
    start = 0,
  }: EventCommentGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventCommentGetResponse>(
        `/event/${eventId}/comments`,
        { params: { limit, start } },
      );
      return res.data.comments;
    });
  };

  eventCommentLikeCountGet = async ({
    commentId,
  }: EventCommentLikeCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventCommentLikeCountGetResponse>(
          `/event/comment/${commentId}/likes/count`,
        );
      return res.data;
    });
  };

  eventCommentLikePost = async ({ commentId }: EventCommentLikePostRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.post<EventCommentLikePostResponse>(
          `/event/comment/${commentId}/likes`,
        );
      return res.data.likes;
    });
  };

  eventCommentPost = async ({
    eventId,
    EventCommentPostBody,
  }: EventCommentPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<EventCommentPostResponse>(
        `/event/${eventId}/comments`,
        EventCommentPostBody,
      );
      return res.data.commentId;
    });
  };

  eventCommentPatch = async ({
    eventId,
    commentId,
    EventCommentPatchBody,
  }: EventCommentPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch<EventCommentPatchResponse>(
        `/event/${eventId}/${commentId}`,
        EventCommentPatchBody,
      );
      return res.data.commentId;
    });
  };

  eventCommentDelete = async ({
    commentId,
    eventId,
  }: EventCommentDeleteRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.delete<EventCommentDeleteResponse>(
          `/event/${eventId}/${commentId}`,
        );
      return res.data.commentId;
    });
  };

  eventApplyGet = async ({ eventId, userId }: EventApplyGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventApplyGetResponse>(
        `/event/${eventId}/form/${userId}`,
      );
      return res.data;
    });
  };

  eventApplyPatch = async ({
    eventId,
    EventApplyPatchRequestBody,
  }: EventApplyPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch<EventApplyPatchResponse>(
        `/event/${eventId}/form`,
        EventApplyPatchRequestBody,
      );
      return res.data.requestId;
    });
  };

  eventApplyPost = async ({
    EventApplyPostRequestBody,
    eventId,
  }: EventApplyPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<EventApplyPostResponse>(
        `/event/${eventId}/form`,
        EventApplyPostRequestBody,
      );
      return res.data.requestId;
    });
  };

  eventApplyDelete = async ({ eventId }: EventApplyDeleteRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.delete(`/event/${eventId}/form`);
      return res.data;
    });
  };

  eventApplyCountGet = async ({ eventId }: EventApplyCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventApplyCountGetResponse>(
        `/event/${eventId}/forms/count`,
      );
      return res.data;
    });
  };

  eventApplyStatusGet = async ({ eventId }: EventApplyStatusGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventApplyStatusGetResponse>(
        `/event/${eventId}/forms`,
      );
      return res.data;
    });
  };

  eventAttendPost = async ({ eventId, userId }: EventAttendPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(
        `/event/${eventId}/attend/${userId}`,
      );
      return res.data;
    });
  };

  eventAttendStatusCountGet = async ({
    eventId,
  }: EventAttendStatusCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventAttendStatusCountGetResponse>(
          `/event/${eventId}/attend/count`,
        );
      return res.data;
    });
  };

  eventMatchingPost = async ({
    eventId,
    userId,
    viId,
  }: EventMatchingPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(
        `/event/${eventId}/match/${viId}/${userId}`,
      );
      return res.data;
    });
  };

  eventNotMatchingCountGet = async ({
    eventId,
  }: EventNotMatchingCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventNotMatchingCountGetResponse>(
          `/event/${eventId}/match/not/count`,
        );
      return res.data;
    });
  };

  eventNotMatchingGet = async ({ eventId }: EventNotMatchingGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventNotMatchingGetResponse>(
        `/event/${eventId}/match/list`,
      );
      return res.data;
    });
  };

  eventMatchedViCountGet = async ({
    eventId,
  }: EventMatchedViCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventMatchedViCountGetResponse>(
          `/event/${eventId}/match/vi/count`,
        );
      return res.data;
    });
  };

  eventMatchedViGet = async ({ eventId }: EventMatchedViGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventMatchedViGetResponse>(
        `/event/${eventId}/match/vi/list`,
      );
      return res.data;
    });
  };

  eventMatchedGuideCountGet = async ({
    eventId,
    viId,
  }: EventMatchedGuideCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventMatchedGuideCountGetResponse>(
          `/event/${eventId}/match/${viId}/count`,
        );
      return res.data;
    });
  };

  eventMatchedGuideGet = async ({
    eventId,
    viId,
  }: EventMatchedGuideGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventMatchedGuideGetResponse>(
          `/event/${eventId}/match/${viId}/list`,
        );
      return res.data;
    });
  };

  eventApplyAllGet = async ({ eventId }: EventApplyAllGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventApplyAllGetResponse>(
        `/event/${eventId}/forms/all`,
      );
      return res.data;
    });
  };

  eventMatchingDelete = async ({
    eventId,
    userId,
  }: EventMatchingDeleteRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.delete(
        `/event/${eventId}/match/${userId}`,
      );
      return res.data;
    });
  };

  eventAutoMatching = async (eventId: number) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(
        `event/${eventId}/match/auto`,
      );
      return res.data;
    });
  };
}

const eventApi = new EventApi();

export default eventApi;
