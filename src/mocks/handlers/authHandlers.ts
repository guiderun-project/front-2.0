import { http, HttpResponse, type HttpHandler } from 'msw';

import type {
  AccountIdVerificationIssueRequest,
  CheckCertificationTokenPostRequest,
  LoginPostRequest,
  PasswordVerificationIssueRequest,
  SignupPostRequest,
  SmsVerificationExtendRequest,
} from '@/api/types/auth';
import { mockDb } from '@/mocks/fixtures';
import {
  activateMockRefreshSession,
  apiUrl,
  badRequest,
  deactivateMockRefreshSession,
  expiredRefreshTokenCookie,
  isMockRefreshSessionActive,
  noContent,
  notFound,
  refreshTokenCookie,
  unauthorized,
} from '@/mocks/http';

// 아이디 찾기 가입일 표기용 고정값. MockUser에는 createdAt 필드가 없다.
const ACCOUNT_CREATED_AT = '2025-01-10T09:00:00.000Z';

// 전화번호 비교를 위해 숫자 이외 문자를 제거한다.
const normalizePhone = (value: string): string => value.replace(/[^0-9]/g, '');

// 아이디 찾기에서 마지막으로 인증을 요청한 전화번호를 기억해 /accountId 조회에 사용한다.
let lastAccountIdLookupPhone: string | null = null;

const createVerificationResponse = (
  verificationId: string,
  purpose: 'ACCOUNT_ID' | 'PASSWORD',
) => {
  const serverTime = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 180_000).toISOString();

  return {
    verificationId,
    purpose,
    expiresInSeconds: 180,
    expiresAt,
    serverTime,
    canExtend: true,
  };
};

export const authHandlers: HttpHandler[] = [
  http.post(apiUrl('/oauth/login/kakao'), ({ request }) => {
    const code = new URL(request.url).searchParams.get('code');

    if (code === 'signup-required') {
      return HttpResponse.json({
        status: 'SIGNUP_REQUIRED',
        signupToken: 'mock-signup-token',
        provider: 'KAKAO',
      });
    }

    activateMockRefreshSession();

    return HttpResponse.json(
      {
        status: 'LOGIN_SUCCESS',
        accessToken: 'mock-access-token',
        user: {
          userId: 'user-vi-1',
          role: 'ROLE_USER',
          disabilityType: 'VI',
        },
      },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      },
    );
  }),

  http.post(apiUrl('/login'), async ({ request }) => {
    const body = (await request.json()) as LoginPostRequest;
    const user = mockDb.users.find(
      (item) => item.accountId === body.accountId && item.password === body.password,
    );

    if (!user) {
      return badRequest('Invalid accountId or password.');
    }

    activateMockRefreshSession();

    return HttpResponse.json(
      { accessToken: 'mock-access-token' },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      },
    );
  }),

  http.post(apiUrl('/oauth/login/reissue'), () => {
    if (!isMockRefreshSessionActive()) {
      return unauthorized('Mock refresh session is missing or expired.');
    }

    activateMockRefreshSession();

    return HttpResponse.json(
      { accessToken: 'mock-rotated-access-token' },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      },
    );
  }),

  http.post(apiUrl('/logout'), () => {
    deactivateMockRefreshSession();

    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Set-Cookie': expiredRefreshTokenCookie,
      },
    });
  }),

  http.post(apiUrl('/signup'), async ({ request }) => {
    const body = (await request.json()) as SignupPostRequest;

    if (!body.common.privacy || !body.common.portraitRights) {
      return badRequest('privacy and portraitRights must be true.');
    }

    const nextUserId = `user-${body.disabilityType.toLowerCase()}-${mockDb.users.length + 1}`;
    const runningInfo =
      body.disabilityType === 'VI' ? body.vi : body.guide;

    mockDb.users.push({
      userId: nextUserId,
      name: body.common.name,
      gender: 'FEMALE',
      phoneNumber: body.common.phoneNumber,
      birthDate: body.common.birthDate,
      recordDegree: runningInfo.runningGroup,
      snsId: body.common.snsId,
      id1365: body.disabilityType === 'GUIDE' ? body.guide.id1365 ?? null : null,
      role: 'ROLE_WAIT',
      type: body.disabilityType,
      accountId: null,
      password: 'password123!',
      detailRecord: runningInfo.detailRecord,
      hopePrefs: runningInfo.hopePrefs,
      firstParticipation: true,
    });

    activateMockRefreshSession();

    return HttpResponse.json(
      {
        userId: nextUserId,
        accessToken: 'mock-access-token',
        role: 'ROLE_WAIT',
        disabilityType: body.disabilityType,
      },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      },
    );
  }),

  http.post(apiUrl('/sms/accountId'), async ({ request }) => {
    const body = (await request.json()) as AccountIdVerificationIssueRequest;

    if (!body.phoneNum) {
      return badRequest('phoneNum is required.');
    }

    // 가입 여부와 무관하게 인증번호는 발송하고, 조회는 /accountId에서 판정한다.
    lastAccountIdLookupPhone = normalizePhone(body.phoneNum);

    return HttpResponse.json(
      createVerificationResponse('mock-account-id-verification', 'ACCOUNT_ID'),
    );
  }),

  http.post(apiUrl('/sms/password'), async ({ request }) => {
    const body = (await request.json()) as PasswordVerificationIssueRequest;
    const user = mockDb.users.find(
      (item) =>
        item.accountId === body.accountId &&
        normalizePhone(item.phoneNumber) === normalizePhone(body.phoneNum),
    );

    if (!user) {
      return badRequest('No account matches the request.');
    }

    return HttpResponse.json(
      createVerificationResponse('mock-password-verification', 'PASSWORD'),
    );
  }),

  http.post(apiUrl('/sms/token'), async ({ request }) => {
    const body = (await request.json()) as CheckCertificationTokenPostRequest;
    const purpose = body.verificationId.includes('password')
      ? 'PASSWORD'
      : 'ACCOUNT_ID';

    return HttpResponse.json({
      token: `mock-${purpose.toLowerCase()}-token`,
      purpose,
    });
  }),

  http.post(apiUrl('/sms/verification/extend'), async ({ request }) => {
    const body = (await request.json()) as SmsVerificationExtendRequest;

    if (!body.verificationId) {
      return badRequest('verificationId is required.');
    }

    return HttpResponse.json({
      verificationId: body.verificationId,
      expiresInSeconds: 180,
      expiresAt: new Date(Date.now() + 180_000).toISOString(),
      serverTime: new Date().toISOString(),
      canExtend: false,
    });
  }),

  http.post(apiUrl('/accountId'), () => {
    const user = lastAccountIdLookupPhone
      ? mockDb.users.find(
          (item) =>
            item.accountId !== null &&
            normalizePhone(item.phoneNumber) === lastAccountIdLookupPhone,
        )
      : undefined;

    if (!user || user.accountId === null) {
      return notFound('No account matches the request.');
    }

    return HttpResponse.json({
      accountId: user.accountId,
      createdAt: ACCOUNT_CREATED_AT,
    });
  }),

  http.patch(apiUrl('/new-password'), async ({ request }) => {
    const body = (await request.json()) as { token: string; newPassword: string };

    if (!body.token || !body.newPassword) {
      return badRequest('token and newPassword are required.');
    }

    return noContent();
  }),
];
