import { z } from 'zod';

import {
  EVENT_APPLY_DETAIL_MAX_LENGTH,
  EVENT_APPLY_GROUP_VALUES,
} from './constants';

export const eventApplyFormSchema = z
  .object({
    group: z.enum(EVENT_APPLY_GROUP_VALUES).optional(),
    partner: z.string(),
    detail: z
      .string()
      .max(EVENT_APPLY_DETAIL_MAX_LENGTH, `최대 ${EVENT_APPLY_DETAIL_MAX_LENGTH}자까지 입력할 수 있어요.`),
    additionalAnswers: z.record(z.string(), z.string().optional()),
  })
  .superRefine((value, context) => {
    if (!value.group) {
      context.addIssue({
        code: 'custom',
        message: '필수로 선택해주세요.',
        path: ['group'],
      });
    }
  });

export type EventApplyFormValues = z.infer<typeof eventApplyFormSchema>;

export const EMPTY_EVENT_APPLY_FORM_VALUES: EventApplyFormValues = {
  group: undefined,
  partner: '',
  detail: '',
  additionalAnswers: {},
};
