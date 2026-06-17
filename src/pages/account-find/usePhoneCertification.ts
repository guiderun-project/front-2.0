import type { ChangeEvent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { onlyDigits } from '@/pages/account-find/utils';

// TODO: 실제 SMS 인증 타이머로 대체. 현재는 퍼블리싱용 정적 표기.
const PLACEHOLDER_TIMER = '03:00';

type UsePhoneCertificationReturn = {
  phoneNum: string;
  certCode: string;
  isCodeSent: boolean;
  timerText: string;
  certInputRef: RefObject<HTMLInputElement | null>;
  handlePhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCertCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sendCode: () => void;
  extendTime: () => void;
};

/**
 * 전화번호 입력 → 인증번호 발송 → 인증번호 입력으로 이어지는 SMS 인증 단계의
 * 상태와 핸들러를 관리한다. 아이디 찾기/비밀번호 찾기에서 공통으로 사용한다.
 */
export const usePhoneCertification = (): UsePhoneCertificationReturn => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [certCode, setCertCode] = useState('');

  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      certInputRef.current?.focus();
    }
  }, [isCodeSent]);

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(onlyDigits(event.target.value));
  };

  const handleCertCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCertCode(onlyDigits(event.target.value));
  };

  const sendCode = () => {
    setIsCodeSent(true);
    // 재발송 시 이전 입력 초기화
    setCertCode('');
    // 이미 노출된 경우 즉시 포커스, 최초 노출은 위 effect가 처리
    certInputRef.current?.focus();
  };

  // TODO: smsVerificationExtendPost 호출 + 타이머 3:00 재시작
  const extendTime = () => {};

  return {
    phoneNum,
    certCode,
    isCodeSent,
    timerText: PLACEHOLDER_TIMER,
    certInputRef,
    handlePhoneChange,
    handleCertCodeChange,
    sendCode,
    extendTime,
  };
};
