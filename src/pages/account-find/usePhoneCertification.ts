import type { ChangeEvent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import type {
  SmsVerificationExtendResponse,
  SmsVerificationIssueResponse,
} from '@/api/types/auth';
import { formatRemainingTime } from '@/pages/account-find/utils';
import { normalizePhoneDigits } from '@/utils';

// SMS 인증 제한시간 기본값(초). 서버 응답이 없을 때의 폴백으로만 사용한다.
const DEFAULT_TIMER_SECONDS = 180;

type UsePhoneCertificationReturn = {
  phoneNum: string;
  certCode: string;
  isCodeSent: boolean;
  verificationId: string | null;
  remainingSeconds: number;
  isExpired: boolean;
  canExtend: boolean;
  timerText: string;
  certInputRef: RefObject<HTMLInputElement | null>;
  handlePhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCertCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sendCode: (response?: SmsVerificationIssueResponse) => void;
  extendTime: (response?: SmsVerificationExtendResponse) => void;
};

/**
 * 전화번호 입력 → 인증번호 발송 → 인증번호 입력으로 이어지는 SMS 인증 단계의
 * 상태와 카운트다운 타이머를 관리한다. 아이디 찾기/비밀번호 찾기에서 공통으로 사용한다.
 *
 * 인증 요청 API는 플로우마다 다르므로(아이디 찾기/비밀번호 찾기) 훅에서 직접 호출하지 않고,
 * 각 페이지가 응답을 받아 sendCode/extendTime으로 주입한다.
 */
export const usePhoneCertification = (): UsePhoneCertificationReturn => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [certCode, setCertCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [canExtend, setCanExtend] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  // 세션이 시작/연장될 때마다 증가시켜 카운트다운 effect를 재시작한다.
  const [sessionId, setSessionId] = useState(0);

  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      certInputRef.current?.focus();
    }
  }, [isCodeSent]);

  useEffect(() => {
    if (sessionId === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sessionId]);

  const startTimer = (seconds: number) => {
    setRemainingSeconds(seconds);
    setSessionId((prev) => prev + 1);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(normalizePhoneDigits(event.target.value));
  };

  const handleCertCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCertCode(event.target.value.replace(/\D/g, ''));
  };

  const sendCode = (response?: SmsVerificationIssueResponse) => {
    setIsCodeSent(true);
    // 재발송 시 이전 입력을 초기화한다.
    setCertCode('');
    setVerificationId(response?.verificationId ?? null);
    setCanExtend(response?.canExtend ?? false);
    startTimer(response?.expiresInSeconds ?? DEFAULT_TIMER_SECONDS);
    // 이미 노출된 경우 즉시 포커스하고, 최초 노출은 위 effect가 처리한다.
    certInputRef.current?.focus();
  };

  const extendTime = (response?: SmsVerificationExtendResponse) => {
    if (response) {
      setVerificationId(response.verificationId);
      setCanExtend(response.canExtend);
    }
    startTimer(response?.expiresInSeconds ?? DEFAULT_TIMER_SECONDS);
  };

  return {
    phoneNum,
    certCode,
    isCodeSent,
    verificationId,
    remainingSeconds,
    isExpired: isCodeSent && remainingSeconds <= 0,
    canExtend,
    timerText: formatRemainingTime(remainingSeconds),
    certInputRef,
    handlePhoneChange,
    handleCertCodeChange,
    sendCode,
    extendTime,
  };
};
