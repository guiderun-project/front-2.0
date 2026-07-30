import type { ChangeEvent, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Controller, type Control } from 'react-hook-form';

import type { AdditionalQuestionDetail } from '@/api/types';
import { HiddenText, Text } from '@/components';

import type { EventApplyFormValues } from '../schema';

const ADDITIONAL_TEXT_ANSWER_MAX_LENGTH = 30;

type AdditionalTextQuestionProps = {
  control: Control<EventApplyFormValues>;
  question: Extract<AdditionalQuestionDetail, { type: 'TEXT' }>;
};

export const AdditionalTextQuestion = ({
  control,
  question,
}: AdditionalTextQuestionProps): ReactElement => {
  const inputId = `additional-answer-${question.questionId}`;
  const titleId = `${inputId}-title`;

  return (
    <Controller
      control={control}
      name={`additionalAnswers.${question.questionId}`}
      render={({ field }) => {
        const value = field.value ?? '';
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          field.onChange(
            event.target.value.slice(0, ADDITIONAL_TEXT_ANSWER_MAX_LENGTH),
          );
        };

        return (
          <QuestionField>
            <QuestionCard>
              <QuestionHeader>
                <Text
                  as="h3"
                  color="text.primary"
                  font="body-m-sb"
                  id={titleId}
                >
                  {question.question}
                </Text>
              </QuestionHeader>
              <QuestionBody>
                <AnswerInput
                  ref={field.ref}
                  aria-describedby={`${inputId}-counter`}
                  aria-labelledby={titleId}
                  id={inputId}
                  maxLength={ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}
                  name={field.name}
                  placeholder="답변을 입력해주세요"
                  value={value}
                  onBlur={field.onBlur}
                  onChange={handleChange}
                />
              </QuestionBody>
            </QuestionCard>
            <InformRow>
              {/* 카운터는 aria-describedby 로만 노출한다. aria-live 를 걸면 매
                  타이핑마다 낭독되어 문자 에코를 방해한다(공용 InputFieldShell
                  카운터와 동일한 정책). */}
              <Counter id={`${inputId}-counter`} role="text">
                <Text as="span" color="text.brand" font="body-s-m">
                  <HiddenText>현재</HiddenText>
                  {value.length}
                </Text>
                <Text as="span" color="text.tertiary" font="body-s-r">
                  /<HiddenText>최대 글자 수</HiddenText>
                  {ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}자
                </Text>
              </Counter>
            </InformRow>
            {/* 최대 글자 수에 도달해 이후 입력이 무시되기 시작하는 시점을 알린다.
                도달/해제 시에만 내용이 바뀌므로 타이핑마다 반복 낭독되지 않는다. */}
            <HiddenText role="status">
              {value.length === ADDITIONAL_TEXT_ANSWER_MAX_LENGTH
                ? `최대 ${ADDITIONAL_TEXT_ANSWER_MAX_LENGTH}자에 도달했어요`
                : ''}
            </HiddenText>
          </QuestionField>
        );
      }}
    />
  );
};

const QuestionField = styled.div(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gap: theme.spacing.md,
}));

const QuestionCard = styled.div(({ theme }) => ({
  display: 'grid',
  width: '100%',
  overflow: 'hidden',
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.md,
  background: theme.color.bg.default,

  '&:focus-within': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const QuestionHeader = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
  background: theme.color.bg.subtle,
}));

const QuestionBody = styled.div(({ theme }) => ({
  padding: theme.spacing.xl,
}));

const AnswerInput = styled.input(({ theme }) => ({
  ...theme.typography['body-m-m'],
  width: '100%',
  minWidth: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: theme.color.text.primary,
  caretColor: theme.color.text.brand,
  outline: 0,

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },
}));

const InformRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
});

const Counter = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
}));
