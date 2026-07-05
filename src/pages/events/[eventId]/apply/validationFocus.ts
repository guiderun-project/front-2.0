import type { FieldErrors, FieldPath, UseFormSetFocus } from 'react-hook-form';

import type { AdditionalQuestionDetail } from '@/api/types';

import type { EventApplyFormValues } from './schema';

export type EventApplyInvalidFocusFieldName = FieldPath<EventApplyFormValues>;

export const EVENT_APPLY_STATIC_INVALID_FOCUS_FIELD_ORDER = [
  'group',
  'partner',
  'detail',
] as const satisfies readonly EventApplyInvalidFocusFieldName[];

type FocusFirstInvalidFieldParams = {
  additionalQuestions: AdditionalQuestionDetail[];
  errors: FieldErrors<EventApplyFormValues>;
  setFocus: UseFormSetFocus<EventApplyFormValues>;
};

export const getFirstInvalidEventApplyFieldName = ({
  additionalQuestions,
  errors,
}: Pick<
  FocusFirstInvalidFieldParams,
  'additionalQuestions' | 'errors'
>): EventApplyInvalidFocusFieldName | undefined => {
  const staticField = EVENT_APPLY_STATIC_INVALID_FOCUS_FIELD_ORDER.find(
    (fieldName) => Boolean(errors[fieldName]),
  );

  if (staticField) {
    return staticField;
  }

  const additionalAnswerErrors = errors.additionalAnswers;

  if (!additionalAnswerErrors) {
    return undefined;
  }

  const invalidAdditionalQuestion = additionalQuestions.find((question) =>
    Object.prototype.hasOwnProperty.call(
      additionalAnswerErrors,
      String(question.questionId),
    ),
  );

  if (!invalidAdditionalQuestion) {
    return undefined;
  }

  return `additionalAnswers.${invalidAdditionalQuestion.questionId}`;
};

export const focusFirstInvalidEventApplyFieldAfterRender = ({
  additionalQuestions,
  errors,
  setFocus,
}: FocusFirstInvalidFieldParams): EventApplyInvalidFocusFieldName | undefined => {
  const fieldName = getFirstInvalidEventApplyFieldName({
    additionalQuestions,
    errors,
  });

  if (!fieldName) {
    return undefined;
  }

  window.requestAnimationFrame(() => {
    setFocus(fieldName);
  });

  return fieldName;
};
