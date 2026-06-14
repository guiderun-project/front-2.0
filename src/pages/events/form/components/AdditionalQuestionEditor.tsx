import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';

import { Text } from '@/components';

import { ADDITIONAL_TEXT_QUESTION_MAX_COUNT } from '../constants';
import type { EventFormValues } from '../schema';
import { createAdditionalQuestionDraft } from '../utils';
import { AdditionalQuestionAddActions } from './AdditionalQuestionAddActions';
import { AdditionalQuestionCard } from './AdditionalQuestionCard';

type AdditionalQuestionEditorProps = {
  form: UseFormReturn<EventFormValues>;
};

export const AdditionalQuestionEditor = ({
  form,
}: AdditionalQuestionEditorProps): ReactElement => {
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'additionalQuestions',
  });
  const additionalQuestions =
    useWatch({
      control: form.control,
      name: 'additionalQuestions',
    }) ?? [];

  const textQuestionCount = additionalQuestions.filter(
    (question) => question.type === 'TEXT',
  ).length;
  const selectQuestionCount = additionalQuestions.filter(
    (question) => question.type === 'SELECT',
  ).length;
  const isTextAddDisabled =
    textQuestionCount >= ADDITIONAL_TEXT_QUESTION_MAX_COUNT;
  const isSelectAddDisabled = selectQuestionCount >= 1;

  const handleAddQuestion = (
    type: EventFormValues['additionalQuestions'][number]['type'],
  ) => {
    append(createAdditionalQuestionDraft(type));
  };

  return (
    <EditorRoot>
      <EditorHeader>
        <Text as="p" color="text.secondary" font="body-m-m">
          {'확인하고 싶은 질문이나 설문을 추가해보세요.\n각 항목당 하나씩 추가할 수 있어요.'}
        </Text>
        <AdditionalQuestionAddActions
          isSelectAddDisabled={isSelectAddDisabled}
          isTextAddDisabled={isTextAddDisabled}
          onAddQuestion={handleAddQuestion}
        />
      </EditorHeader>

      {fields.length > 0 ? (
        <QuestionList>
          {fields.map((field, index) => {
            const question = additionalQuestions[index] ?? field;

            return (
              <AdditionalQuestionCard
                key={field.id}
                fieldId={field.id}
                form={form}
                questionIndex={index}
                questionType={question.type}
                onRemove={() => remove(index)}
              />
            );
          })}
        </QuestionList>
      ) : null}
    </EditorRoot>
  );
};

const EditorRoot = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
}));

const EditorHeader = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,

  '& p': {
    whiteSpace: 'pre-line',
  },
}));

const QuestionList = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
}));
