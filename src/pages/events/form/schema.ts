import { z } from 'zod';

import type { EventType } from '@/api/types';

import {
  ADDITIONAL_QUESTION_TITLE_MAX_LENGTH,
  ADDITIONAL_SELECT_OPTION_MAX_COUNT,
  ADDITIONAL_SELECT_OPTION_MIN_COUNT,
  EVENT_CONTENT_MAX_LENGTH,
  TRAINING_OPERATION_OPTIONS,
} from './constants';

const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_VALUE_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const RUNNING_DISTANCE_VALUE_PATTERN = /^\d{1,3}(?:\.\d)?$/;

type EventFormSchemaOptions = {
  minimumEventDateTime?: {
    date: string;
    time: string;
  };
  validateAdditionalQuestions?: boolean;
};

const isValidDateValue = (value: string): boolean => {
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

const isTimeAfter = (time: string, baseTime: string): boolean => {
  if (!TIME_VALUE_PATTERN.test(time) || !TIME_VALUE_PATTERN.test(baseTime)) {
    return false;
  }

  return time > baseTime;
};

const dateValueSchema = z
  .string()
  .min(1, '필수로 입력해주세요.')
  .refine(isValidDateValue, '올바른 날짜를 입력해주세요.');

const timeValueSchema = z
  .string()
  .min(1, '필수로 입력해주세요.')
  .regex(TIME_VALUE_PATTERN, '올바른 시간을 입력해주세요.');

const runningDistanceSchema = z
  .string()
  .refine(
    (value) => value === '' || RUNNING_DISTANCE_VALUE_PATTERN.test(value),
    '올바른 러닝 거리를 입력해주세요.',
  );

const requiredTextSchema = z.string().trim().min(1, '필수로 입력해주세요.');
const additionalQuestionTitleSchema = requiredTextSchema.max(
  ADDITIONAL_QUESTION_TITLE_MAX_LENGTH,
  `질문은 최대 ${ADDITIONAL_QUESTION_TITLE_MAX_LENGTH}자까지 입력할 수 있어요.`,
);

const additionalQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    formId: z.string().min(1),
    type: z.literal('TEXT'),
    title: additionalQuestionTitleSchema,
  }),
  z.object({
    formId: z.string().min(1),
    type: z.literal('SELECT'),
    title: additionalQuestionTitleSchema,
    options: z
      .array(requiredTextSchema)
      .min(
        ADDITIONAL_SELECT_OPTION_MIN_COUNT,
        '선택지는 최소 3개 이상 입력해주세요.',
      )
      .max(
        ADDITIONAL_SELECT_OPTION_MAX_COUNT,
        '선택지는 최대 5개까지 입력할 수 있어요.',
      ),
  }),
]);

const readOnlyAdditionalQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    formId: z.string().min(1),
    type: z.literal('TEXT'),
    title: z.string(),
  }),
  z.object({
    formId: z.string().min(1),
    type: z.literal('SELECT'),
    title: z.string(),
    options: z.array(z.string()),
  }),
]);

const trainingOperationValues = TRAINING_OPERATION_OPTIONS.map(
  (option) => option.value,
);

const isTrainingOperationType = (
  value: string | undefined,
): value is (typeof trainingOperationValues)[number] => {
  return trainingOperationValues.includes(
    value as (typeof trainingOperationValues)[number],
  );
};

export const createEventFormSchema = (
  eventType: EventType,
  options: EventFormSchemaOptions = {},
) => {
  const shouldValidateAdditionalQuestions =
    options.validateAdditionalQuestions ?? true;

  return z
    .object({
      recruitStartDate: dateValueSchema,
      recruitEndDate: dateValueSchema,
      name: requiredTextSchema,
      date: dateValueSchema,
      startTime: timeValueSchema,
      endTime: timeValueSchema,
      operationType: z.string().optional(),
      place: requiredTextSchema,
      content: z
        .string()
        .trim()
        .max(
          EVENT_CONTENT_MAX_LENGTH,
          `내용은 최대 ${EVENT_CONTENT_MAX_LENGTH}자까지 입력할 수 있어요.`,
        ),
      expectedRunningDistanceKm: runningDistanceSchema,
      isPrivate: z.boolean(),
      additionalQuestions: z.array(
        shouldValidateAdditionalQuestions
          ? additionalQuestionSchema
          : readOnlyAdditionalQuestionSchema,
      ),
    })
    .superRefine((value, context) => {
      const minimumEventDateTime = options.minimumEventDateTime;

      if (minimumEventDateTime && isValidDateValue(value.date)) {
        if (value.date < minimumEventDateTime.date) {
          context.addIssue({
            code: 'custom',
            message: '모임 일시는 오늘 이후로 입력해주세요.',
            path: ['date'],
          });
        }

        if (
          value.date === minimumEventDateTime.date &&
          TIME_VALUE_PATTERN.test(value.startTime) &&
          !isTimeAfter(value.startTime, minimumEventDateTime.time)
        ) {
          context.addIssue({
            code: 'custom',
            message: '모임 시작 시간은 현재 시간 이후로 입력해주세요.',
            path: ['startTime'],
          });
        }
      }

      if (
        isValidDateValue(value.recruitStartDate) &&
        isValidDateValue(value.recruitEndDate) &&
        value.recruitEndDate < value.recruitStartDate
      ) {
        context.addIssue({
          code: 'custom',
          message: '모집 마감일은 모집 시작일 이후여야 해요.',
          path: ['recruitEndDate'],
        });
      }

      if (
        TIME_VALUE_PATTERN.test(value.startTime) &&
        TIME_VALUE_PATTERN.test(value.endTime) &&
        !isTimeAfter(value.endTime, value.startTime)
      ) {
        context.addIssue({
          code: 'custom',
          message: '종료 시간은 시작 시간 이후여야 해요.',
          path: ['endTime'],
        });
      }

      if (eventType === 'TRAINING' && !isTrainingOperationType(value.operationType)) {
        context.addIssue({
          code: 'custom',
          message: '필수로 선택해주세요.',
          path: ['operationType'],
        });
      }
    });
};

export type EventFormValues = z.infer<ReturnType<typeof createEventFormSchema>>;
