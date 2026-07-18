import type { ChangeEvent, ReactElement } from 'react';

import { Input } from '@/components';

type DateInputProps = Omit<
  Parameters<typeof Input>[0],
  | 'autoComplete'
  | 'inputMode'
  | 'onChange'
  | 'pattern'
  | 'placeholder'
  | 'type'
  | 'value'
> & {
  value: string;
  onChange?: (value: string) => void;
};

/**
 * 날짜는 브라우저 기본 date picker를 사용한다.
 * 폼 값 형식(YYYY-MM-DD)이 input[type=date]의 value 형식과 같아 변환 없이 그대로 주고받는다.
 *
 * role="textbox"는 iOS Safari + VoiceOver에서 date picker가 열리지 않는 WebKit 이슈의
 * 임시 우회다. (참고: https://github.com/facebook/react/issues/33541)
 * WebKit에서 고쳐지면 제거한다.
 */
export const DateInput = ({
  value,
  onChange,
  ...props
}: DateInputProps): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <Input
      {...props}
      autoComplete="off"
      role="textbox"
      type="date"
      value={value}
      onChange={handleChange}
    />
  );
};
