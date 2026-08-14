import { type ChangeEvent, type ReactElement } from 'react';

import { Input } from '@/components';

import { formatTimeInput } from '../utils';

type MaskedTimeInputProps = Omit<
  Parameters<typeof Input>[0],
  'autoComplete' | 'inputMode' | 'onChange' | 'pattern' | 'placeholder' | 'value'
> & {
  value: string;
  onChange?: (value: string) => void;
};

export const MaskedTimeInput = ({
  value,
  onChange,
  ...props
}: MaskedTimeInputProps): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(formatTimeInput(event.target.value));
  };

  return (
    <Input
      {...props}
      autoComplete="off"
      inputMode="numeric"
      onChange={handleChange}
      pattern="[0-2][0-9]:[0-5][0-9]"
      // 12를 넘는 시각을 예로 들어 24시간제임을 형식만으로 알린다.
      // 문장 형태의 형식 안내는 두 시간 필드가 공유하는 힌트가 담당하고,
      // 그 힌트를 호출부에서 describedById 로 연결한다.
      placeholder="14:00"
      value={value}
    />
  );
};
