import type {
  AdditionalQuestion,
  EventCreateRequest,
  EventDetailResponse,
  EventType,
  EventUpdateRequest,
} from '@/api/types';

import {
  DEFAULT_EVENT_END_TIME,
  DEFAULT_EVENT_MIN_NUM_G,
  DEFAULT_EVENT_MIN_NUM_V,
  DEFAULT_EVENT_START_TIME,
  EVENT_CREATE_QUERY_VALUES,
  type EventCreateQueryValue,
  type TrainingOperationType,
} from './constants';
import type { EventFormValues } from './schema';

const DATE_INPUT_MAX_LENGTH = 8;
const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_INPUT_MAX_LENGTH = 4;
const TIME_VALUE_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const RUNNING_DISTANCE_INTEGER_MAX_LENGTH = 3;
const RUNNING_DISTANCE_DECIMAL_MAX_LENGTH = 1;
const RUNNING_DISTANCE_VALUE_PATTERN = /^\d{1,3}(?:\.\d)?$/;

type AdditionalQuestionDraftType = EventFormValues['additionalQuestions'][number]['type'];

type EventRequestParams = {
  eventType: EventType;
  values: EventFormValues;
};

export const getTodayDateValue = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
};

export const getCurrentTimeValue = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const formatDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, DATE_INPUT_MAX_LENGTH);
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const date = digits.slice(6, 8);

  return [year, month, date].filter(Boolean).join('-');
};

export const formatDateDisplay = (value: string): string => {
  return value.replaceAll('-', '.');
};

export const isValidDateValue = (value: string): boolean => {
  if (!DATE_VALUE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, date] = value.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, date));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === date
  );
};

export const formatTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, TIME_INPUT_MAX_LENGTH);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);

  return [hours, minutes].filter(Boolean).join(':');
};

export const isValidTimeValue = (value: string): boolean => {
  return TIME_VALUE_PATTERN.test(value);
};

export const isTimeAfter = (time: string, baseTime: string): boolean => {
  if (!isValidTimeValue(time) || !isValidTimeValue(baseTime)) {
    return false;
  }

  return time > baseTime;
};

export const addHoursToTime = (time: string, hoursToAdd: number): string => {
  if (!isValidTimeValue(time)) {
    return time;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = (hours * 60 + minutes + hoursToAdd * 60) % (24 * 60);
  const normalizedMinutes =
    totalMinutes < 0 ? totalMinutes + 24 * 60 : totalMinutes;
  const nextHours = Math.floor(normalizedMinutes / 60);
  const nextMinutes = normalizedMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
};

export const formatRunningDistanceInput = (value: string): string => {
  const sanitized = value.replace(/[^\d.]/g, '');
  const [integerPart = '', ...decimalParts] = sanitized.split('.');
  const integer = integerPart.slice(0, RUNNING_DISTANCE_INTEGER_MAX_LENGTH);

  if (decimalParts.length === 0) {
    return integer;
  }

  const decimal = decimalParts
    .join('')
    .slice(0, RUNNING_DISTANCE_DECIMAL_MAX_LENGTH);

  return `${integer}.` + decimal;
};

export const isValidRunningDistanceValue = (value: string): boolean => {
  return value === '' || RUNNING_DISTANCE_VALUE_PATTERN.test(value);
};

export const parseRunningDistanceValue = (value: string): number | null => {
  const trimmedValue = value.trim();

  if (!trimmedValue || !isValidRunningDistanceValue(trimmedValue)) {
    return null;
  }

  return Number(trimmedValue);
};

export const getEventTypeFromQueryValue = (
  value: string | null | undefined,
): EventType | null => {
  if (value === EVENT_CREATE_QUERY_VALUES.TRAINING) {
    return 'TRAINING';
  }

  if (value === EVENT_CREATE_QUERY_VALUES.COMPETITION) {
    return 'COMPETITION';
  }

  return null;
};

export const getQueryValueFromEventType = (
  eventType: EventType,
): EventCreateQueryValue => {
  return eventType === 'COMPETITION'
    ? EVENT_CREATE_QUERY_VALUES.COMPETITION
    : EVENT_CREATE_QUERY_VALUES.TRAINING;
};

export const createDefaultEventFormValues = (
  eventType: EventType,
): EventFormValues => {
  const today = getTodayDateValue();

  return {
    recruitStartDate: today,
    recruitEndDate: today,
    name: '',
    date: today,
    startTime: DEFAULT_EVENT_START_TIME,
    endTime: DEFAULT_EVENT_END_TIME,
    operationType: eventType === 'TRAINING' ? 'GENERAL' : undefined,
    place: '',
    content: '',
    expectedRunningDistanceKm: '',
    isPrivate: false,
    additionalQuestions: [],
  };
};

export const createAdditionalQuestionDraft = (
  type: AdditionalQuestionDraftType,
): EventFormValues['additionalQuestions'][number] => {
  const formId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (type === 'TEXT') {
    return {
      formId,
      type: 'TEXT',
      title: '',
    };
  }

  return {
    formId,
    type: 'SELECT',
    title: '',
    options: [''],
  };
};

export const isTrainingOperationType = (
  value: string | undefined,
): value is TrainingOperationType => {
  return value === 'GENERAL' || value === 'GROUP';
};

export const createEventFormValuesFromDetail = (
  event: EventDetailResponse,
): EventFormValues => {
  return {
    recruitStartDate: event.recruitStartDate,
    recruitEndDate: event.recruitEndDate,
    name: event.name,
    date: event.schedule.date,
    startTime: event.schedule.startTime,
    endTime: event.schedule.endTime,
    operationType:
      event.eventType === 'TRAINING'
        ? getTrainingOperationTypeFromEventCategory(event.eventCategory)
        : undefined,
    place: event.place,
    content: event.content,
    expectedRunningDistanceKm:
      event.expectedRunningDistanceKm != null
        ? formatRunningDistanceInput(String(event.expectedRunningDistanceKm))
        : '',
    isPrivate: event.isPrivate,
    additionalQuestions: event.additionalQuestions.map((question) => {
      if (question.type === 'TEXT') {
        return {
          formId: String(question.questionId),
          type: 'TEXT',
          title: question.question,
        };
      }

      return {
        formId: String(question.questionId),
        type: 'SELECT',
        title: question.question,
        options: question.options.map((option) => option.value),
      };
    }),
  };
};

export const createEventCreateRequest = ({
  eventType,
  values,
}: EventRequestParams): EventCreateRequest => {
  const request = createBaseEventRequest({ eventType, values });
  const expectedRunningDistanceKm = parseRunningDistanceValue(
    values.expectedRunningDistanceKm,
  );

  return {
    ...request,
    ...(expectedRunningDistanceKm != null ? { expectedRunningDistanceKm } : {}),
  };
};

export const createEventUpdateRequest = ({
  eventType,
  values,
}: EventRequestParams): EventUpdateRequest => {
  const additionalQuestions = createAdditionalQuestions(values);

  return {
    ...createBaseEventRequest({ eventType, values, additionalQuestions }),
    isPrivate: values.isPrivate,
    expectedRunningDistanceKm: parseRunningDistanceValue(
      values.expectedRunningDistanceKm,
    ),
    additionalQuestions,
  };
};

const createBaseEventRequest = ({
  eventType,
  values,
  additionalQuestions = createAdditionalQuestions(values),
}: EventRequestParams & {
  additionalQuestions?: AdditionalQuestion[];
}): Omit<
  EventCreateRequest,
  'expectedRunningDistanceKm'
> => {
  return {
    recruitStartDate: values.recruitStartDate,
    recruitEndDate: values.recruitEndDate,
    name: values.name.trim(),
    eventType,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    minNumV: DEFAULT_EVENT_MIN_NUM_V,
    minNumG: DEFAULT_EVENT_MIN_NUM_G,
    place: values.place.trim(),
    content: values.content.trim(),
    eventCategory: resolveEventCategory({ eventType, values }),
    isPrivate: values.isPrivate,
    ...(additionalQuestions.length > 0 ? { additionalQuestions } : {}),
  };
};

const resolveEventCategory = ({
  eventType,
  values,
}: EventRequestParams): TrainingOperationType => {
  if (eventType === 'COMPETITION') {
    return 'GENERAL';
  }

  if (isTrainingOperationType(values.operationType)) {
    return values.operationType;
  }

  throw new Error('Training operation type is required.');
};

const createAdditionalQuestions = (
  values: EventFormValues,
): AdditionalQuestion[] => {
  return values.additionalQuestions.reduce<AdditionalQuestion[]>(
    (questions, question) => {
      const title = question.title.trim();

      if (!title) {
        return questions;
      }

      if (question.type === 'TEXT') {
        questions.push({ type: 'TEXT', title });
        return questions;
      }

      const options = question.options
        .map((option) => option.trim())
        .filter(Boolean)
        .slice(0, 3);

      if (options.length > 0) {
        questions.push({ type: 'SELECT', title, options });
      }

      return questions;
    },
    [],
  );
};

const getTrainingOperationTypeFromEventCategory = (
  eventCategory: EventDetailResponse['eventCategory'],
): TrainingOperationType => {
  return isTrainingOperationType(eventCategory) ? eventCategory : 'GENERAL';
};
