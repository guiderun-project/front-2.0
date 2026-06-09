import type { FormEvent, ReactElement } from 'react';

import styled from '@emotion/styled';

import {
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
  Text,
  Textarea,
} from '@/components';

export const FormDesignPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <FormPageLayout
        topNavigation={{
          left: {
            icon: 'chevron-left-lined',
            ariaLabel: '이전 페이지로 이동',
          },
        }}
        title={'훈련 모임 정보를\n작성해주세요'}
        description={
          <>
            현재 <DescriptionStrong>6명</DescriptionStrong>이 매칭되지 않았어요
          </>
        }
      >
        <FormExample aria-label="훈련 모임 정보 예시 폼" onSubmit={preventSubmit}>
          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.primary" font="body-l-sb">
                기본 정보
              </Text>
            </SectionHeader>
            <FieldStack>
              <Input label="모임명" placeholder="예: 토요일 오전 러닝" />
              <Input label="모임 장소" placeholder="예: 여의도공원 1번 출구" />
              <Textarea
                label="모임 소개"
                maxLength={160}
                placeholder="훈련 방식, 준비물, 유의사항을 작성해주세요"
              />
            </FieldStack>
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.primary" font="body-l-sb">
                모집 정보
              </Text>
              <Text color="text.tertiary" font="body-s-r">
                참가자에게 보여줄 모집 조건을 입력합니다.
              </Text>
            </SectionHeader>
            <FieldStack>
              <TwoColumnFields>
                <Input label="러너 정원" inputMode="numeric" placeholder="6명" />
                <Input label="가이드 정원" inputMode="numeric" placeholder="2명" />
              </TwoColumnFields>
              <Input label="모집 마감일" placeholder="2026.06.30" />
              <Input label="참가비" inputMode="numeric" placeholder="무료" />
            </FieldStack>
          </FormSection>

          <Divider aria-hidden="true" />

          <FormSection>
            <SectionHeader>
              <Text as="h2" color="text.primary" font="body-l-sb">
                추가 정보
              </Text>
              <Text color="text.tertiary" font="body-s-r">
                참가 확정 후 안내할 추가 질문을 입력합니다.
              </Text>
            </SectionHeader>
            <FieldStack>
              <Textarea
                label="참가자에게 확인할 내용"
                maxLength={120}
                placeholder="예: 선호 페이스, 동반 러닝 경험"
              />
              <Input label="문의 연락처" placeholder="운영자 연락처" />
              <Input label="예비 안내 문구" placeholder="참가 확정 후 개별 안내 예정" />
            </FieldStack>
          </FormSection>
        </FormExample>
        <FooterButton>
          <FooterButton.Button fullWidth size="l">
            저장하기
          </FooterButton.Button>
        </FooterButton>
      </FormPageLayout>
    </PageLayout>
  );
};

const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

const FormExample = styled.form(({ theme }) => ({
  display: 'grid',
  paddingTop: theme.spacing['4xl'],
}));

const FormSection = styled.section(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing['2xl'],
  paddingInline: theme.spacing['2xl'],
}));

const SectionHeader = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.s,
}));

const FieldStack = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.xl,
}));

const TwoColumnFields = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: theme.spacing.md,
}));

const Divider = styled.div(({ theme }) => ({
  height: theme.spacing.lg,
  marginBlock: theme.spacing['4xl'],
  background: theme.color.bg.subtle,
}));

const DescriptionStrong = styled.strong(({ theme }) => ({
  color: theme.color.text.brand,
  fontWeight: theme.fontWeight.bold,
}));
