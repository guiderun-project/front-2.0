import type { ReactElement } from 'react';
import { useMemo } from 'react';

import styled from '@emotion/styled';
import { Controller, type UseFormReturn } from 'react-hook-form';

import type { EventDetailResponse, UserInfoGetResponse } from '@/api/types';
import {
  Badge,
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
  Select,
  Text,
  Textarea,
  type SelectOptions,
} from '@/components';

import { AdditionalSelectQuestion } from './components/AdditionalSelectQuestion';
import { AdditionalTextQuestion } from './components/AdditionalTextQuestion';
import {
  COMPETITION_COURSE_OPTIONS,
  createGeneralTrainingOptions,
  EVENT_TYPE_LABELS,
  getPrimarySelectLabel,
  GROUP_TRAINING_OPTIONS,
  type EventApplyGroupValue,
} from './constants';
import type { EventApplyFormValues } from './schema';

type EventApplyFormProps = {
  event: EventDetailResponse;
  form: UseFormReturn<EventApplyFormValues>;
  isEditMode: boolean;
  isSubmitting: boolean;
  user: UserInfoGetResponse;
  onBack: () => void;
  onSubmit: (values: EventApplyFormValues) => void;
};

export const EventApplyForm = ({
  event,
  form,
  isEditMode,
  isSubmitting,
  user,
  onBack,
  onSubmit,
}: EventApplyFormProps): ReactElement => {
  const primarySelectLabel = getPrimarySelectLabel(
    event.eventType,
    event.eventCategory,
  );
  const primarySelectOptions = useMemo(
    () => createPrimarySelectOptions(event, user),
    [event, user],
  );

  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        description={
          <DescriptionRow>
            <Badge
              size="m"
              tone={event.eventType === 'COMPETITION' ? 'cyan' : 'gray'}
              variant="solid"
            >
              {EVENT_TYPE_LABELS[event.eventType]}
            </Badge>
            <EventName>{event.name}</EventName>
          </DescriptionRow>
        }
        title={'신청 정보를\n입력해주세요'}
        topNavigation={{
          right: [
            {
              ariaLabel: '이벤트 상세로 이동',
              icon: 'delete-lined',
              onClick: onBack,
            },
          ],
        }}
      >
        <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                기본 정보
              </Text>
            </SectionHeader>
            <Controller
              control={form.control}
              name="group"
              render={({ field, fieldState }) => (
                <FieldStack>
                  <Select<EventApplyGroupValue>
                    ariaLabel={primarySelectLabel}
                    label={primarySelectLabel}
                    options={primarySelectOptions}
                    placeholder={primarySelectLabel}
                    sheetTitle={primarySelectLabel}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error ? (
                    <FieldError color="text.danger" font="detail-m-m" role="alert">
                      {fieldState.error.message}
                    </FieldError>
                  ) : null}
                </FieldStack>
              )}
            />
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.secondary" font="body-m-sb">
                추가 입력정보
              </Text>
            </SectionHeader>
            <FieldStack>
              <Controller
                control={form.control}
                name="partner"
                render={({ field }) => (
                  <Input
                    label="희망 파트너"
                    placeholder="이름"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <Textarea
                    label="추가 코멘트"
                    placeholder="추가로 전달하고 싶은 내용을 입력해주세요"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              {/* TODO: 대회 Figma 추가 질문 위치 이동 확정 필요 */}
              {event.additionalQuestions.map((question) =>
                question.type === 'TEXT' ? (
                  <AdditionalTextQuestion
                    key={question.questionId}
                    control={form.control}
                    question={question}
                  />
                ) : (
                  <AdditionalSelectQuestion
                    key={question.questionId}
                    control={form.control}
                    question={question}
                  />
                ),
              )}
            </FieldStack>
          </FormSection>

          <FooterButton>
            <FooterButton.Button
              disabled={isSubmitting}
              fullWidth
              size="l"
              type="submit"
            >
              {isEditMode ? '신청서 수정하기' : '참여 신청하기'}
            </FooterButton.Button>
          </FooterButton>
        </Form>
      </FormPageLayout>
    </PageLayout>
  );
};

const createPrimarySelectOptions = (
  event: EventDetailResponse,
  user: UserInfoGetResponse,
): SelectOptions<EventApplyGroupValue> => {
  if (event.eventType === 'COMPETITION') {
    return COMPETITION_COURSE_OPTIONS;
  }

  if (event.eventCategory === 'GROUP') {
    return GROUP_TRAINING_OPTIONS;
  }

  return createGeneralTrainingOptions(user.type);
};

const DescriptionRow = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  gap: theme.spacing.md,
  verticalAlign: 'middle',
}));

const EventName = styled.span({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Form = styled.form(({ theme }) => ({
  display: 'grid',
  paddingTop: theme.spacing['4xl'],
}));

const FormSection = styled.section(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
  paddingInline: theme.spacing['2xl'],
}));

const SectionHeader = styled.div({
  display: 'grid',
});

const FieldStack = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.lg,
  width: '100%',
}));

const FieldError = styled(Text)(({ theme }) => ({
  paddingInline: theme.spacing.xs,
}));

const Divider = styled.div(({ theme }) => ({
  height: theme.spacing.lg,
  marginBlock: theme.spacing['2xl'],
  background: theme.color.border.subtle,
}));
