import { z } from 'zod';

import { RUNNER_TYPE } from '@/constants';

// "YYYY.MM.DD" (formatBirthDateInput 출력 형식)
const BIRTH_DATE_PATTERN = /^\d{4}\.\d{2}\.\d{2}$/;
// 하이픈 없는 휴대폰 번호(01X + 7~8자리)
const PHONE_PATTERN = /^01[0-9]\d{7,8}$/;

const isValidBirthDate = (value: string): boolean => {
  if (!BIRTH_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, date] = value.split('.').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, date));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === date
  );
};

const timeValueSchema = z.object({
  hours: z.string(),
  minutes: z.string(),
  seconds: z.string(),
});

// 폼 전체 스키마. 선택 입력(snsId/id1365/partneredViName/record/hopePrefs)은 빈 값을 허용하고,
// 단계 전환 시에는 SIGNUP_STEP_FIELDS 로 해당 단계 필드만 검증한다.
export const signupSchema = z
  .object({
    disabilityType: z.enum([RUNNER_TYPE.VI, RUNNER_TYPE.GUIDE]).nullable(),
    gender: z.enum(['MALE', 'FEMALE']).nullable(),
    name: z.string(),
    birthDate: z.string(),
    phoneNumber: z.string(),
    snsId: z.string(),
    id1365: z.string(),
    hasExperience: z.boolean().nullable(),
    partneredViName: z.string(),
    record: timeValueSchema,
    hopePrefs: z.string(),
    agreements: z.object({
      privacy: z.boolean(),
      portraitRights: z.boolean(),
    }),
  })
  .superRefine((values, ctx) => {
    if (!values.disabilityType) {
      ctx.addIssue({
        code: 'custom',
        message: '참여 유형을 선택해주세요.',
        path: ['disabilityType'],
      });
    }

    if (!values.gender) {
      ctx.addIssue({
        code: 'custom',
        message: '성별을 선택해주세요.',
        path: ['gender'],
      });
    }

    if (values.name.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '이름을 입력해주세요.',
        path: ['name'],
      });
    }

    if (!isValidBirthDate(values.birthDate)) {
      ctx.addIssue({
        code: 'custom',
        message: '생년월일을 정확히 입력해주세요.',
        path: ['birthDate'],
      });
    }

    if (!PHONE_PATTERN.test(values.phoneNumber)) {
      ctx.addIssue({
        code: 'custom',
        message: '전화번호를 정확히 입력해주세요.',
        path: ['phoneNumber'],
      });
    }

    if (values.hasExperience === null) {
      ctx.addIssue({
        code: 'custom',
        message: '러닝 경험 여부를 선택해주세요.',
        path: ['hasExperience'],
      });
    }

    // 러닝 경험이 있으면 10KM 기록은 필수. 경험이 없으면 기록 없이 E팀으로 배정한다.
    if (values.hasExperience === true) {
      const totalMinutes =
        (Number(values.record.hours) || 0) * 60 +
        (Number(values.record.minutes) || 0);

      if (totalMinutes <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: '10KM 러닝기록을 입력해주세요.',
          path: ['record'],
        });
      }
    }

    if (!values.agreements.privacy) {
      ctx.addIssue({
        code: 'custom',
        message: '개인정보 제공 및 활용에 동의해주세요.',
        path: ['agreements', 'privacy'],
      });
    }

    if (!values.agreements.portraitRights) {
      ctx.addIssue({
        code: 'custom',
        message: '초상권 활용에 동의해주세요.',
        path: ['agreements', 'portraitRights'],
      });
    }
  });
