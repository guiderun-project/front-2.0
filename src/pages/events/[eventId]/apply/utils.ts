import type {
  AdditionalAnswer,
  CompetitionApplicationInfo,
  EventApplyPostRequestBody,
  EventDetailResponse,
  MyEventApplyGetResponse,
  RunningGroup,
  UserInfoGetResponse,
} from '@/api/types';

import {
  COMPETITION_COURSE_OPTIONS,
  EVENT_APPLY_GROUP_VALUES,
  GROUP_TRAINING_OPTIONS,
  type EventApplyGroupValue,
} from './constants';
import type { EventApplyFormValues } from './schema';

type CreateInitialValuesParams = {
  event: EventDetailResponse;
  form: MyEventApplyGetResponse | null;
  user: UserInfoGetResponse;
};

type CreateRequestBodyParams = {
  event: EventDetailResponse;
  values: EventApplyFormValues;
  user: UserInfoGetResponse;
};

const isEventApplyGroupValue = (
  value: RunningGroup | undefined,
): value is EventApplyGroupValue => {
  return EVENT_APPLY_GROUP_VALUES.includes(value as EventApplyGroupValue);
};

const isSelectableGroupForEvent = (
  event: EventDetailResponse,
  value: RunningGroup | undefined,
): value is EventApplyGroupValue => {
  if (!isEventApplyGroupValue(value)) {
    return false;
  }

  if (event.eventType === 'TRAINING' && event.eventCategory === 'GROUP') {
    return GROUP_TRAINING_OPTIONS.some((option) => option.value === value);
  }

  if (event.eventType === 'COMPETITION') {
    return COMPETITION_COURSE_OPTIONS.some((option) => option.value === value);
  }

  return true;
};

export const createEventApplyInitialValues = ({
  event,
  form,
  user,
}: CreateInitialValuesParams): EventApplyFormValues => {
  const group =
    form?.applicationInfo.group ??
    (event.eventType === 'TRAINING' && event.eventCategory !== 'GROUP'
      ? user.recordDegree
      : undefined);
  const additionalAnswers =
    form?.additionalAnswers.reduce<Record<string, string>>((answers, answer) => {
      if (answer.type === 'TEXT') {
        answers[String(answer.questionId)] = answer.answerText ?? '';
        return answers;
      }

      answers[String(answer.questionId)] =
        answer.selectedOptionId != null ? String(answer.selectedOptionId) : '';

      return answers;
    }, {}) ?? {};

  return {
    group: isSelectableGroupForEvent(event, group) ? group : undefined,
    partner: form?.applicationInfo.partner ?? '',
    detail: form?.applicationInfo.detail ?? '',
    additionalAnswers,
  };
};

export const createEventApplyRequestBody = ({
  event,
  values,
  user,
}: CreateRequestBodyParams): EventApplyPostRequestBody => {
  if (!values.group) {
    throw new Error('Event application group is required.');
  }

  let competitionInfo: CompetitionApplicationInfo | undefined;

  if (event.eventType === 'COMPETITION') {
    const { birthDate, phoneNumber } = user;

    if (!birthDate || !phoneNumber) {
      throw new Error('Competition application profile info is required.');
    }

    // TODO: 대회 신청에서 생년월일/전화번호 입력 노출 여부 확인 필요
    competitionInfo = { birthDate, phoneNumber };
  }

  const additionalAnswers = createAdditionalAnswers(event, values);

  return {
    group: values.group,
    partner: toOptionalText(values.partner),
    detail: toOptionalText(values.detail),
    competitionInfo,
    additionalAnswers:
      additionalAnswers.length > 0 ? additionalAnswers : undefined,
  };
};

const createAdditionalAnswers = (
  event: EventDetailResponse,
  values: EventApplyFormValues,
): AdditionalAnswer[] => {
  return event.additionalQuestions.reduce<AdditionalAnswer[]>((answers, question) => {
    const answer = values.additionalAnswers[String(question.questionId)] ?? '';

    if (question.type === 'TEXT') {
      const answerText = answer.trim();

      if (answerText) {
        answers.push({ questionId: question.questionId, type: 'TEXT', answerText });
      }

      return answers;
    }

    const selectedOptionId = Number(answer);
    const hasSelectedOption = question.options.some(
      (option) => option.optionId === selectedOptionId,
    );

    if (Number.isInteger(selectedOptionId) && hasSelectedOption) {
      answers.push({
        questionId: question.questionId,
        type: 'SELECT',
        selectedOptionId,
      });
    }

    return answers;
  }, []);
};

const toOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
};
