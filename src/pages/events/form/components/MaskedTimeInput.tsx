import { useId, type ChangeEvent, type ReactElement } from 'react';

import { HiddenText, Input } from '@/components';

import { formatTimeInput } from '../utils';

type MaskedTimeInputProps = Omit<
  Parameters<typeof Input>[0],
  'autoComplete' | 'inputMode' | 'onChange' | 'pattern' | 'placeholder' | 'value'
> & {
  value: string;
  onChange?: (value: string) => void;
};

// placeholder "HH:mm" 은 스크린리더가 철자로 읽어 입력 규칙을 전달하지 못하므로,
// SR 전용 힌트를 aria-describedby 로 연결해 포커스 시 형식이 낭독되게 한다.
const TIME_FORMAT_HINT =
  '24시간제 숫자 4자리로 입력해요. 예를 들어 오전 8시 30분은 0830이에요.';

export const MaskedTimeInput = ({
  value,
  describedById,
  onChange,
  ...props
}: MaskedTimeInputProps): ReactElement => {
  const hintId = useId();
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(formatTimeInput(event.target.value));
  };

  return (
    <>
      <Input
        {...props}
        autoComplete="off"
        describedById={[describedById, hintId].filter(Boolean).join(' ')}
        inputMode="numeric"
        onChange={handleChange}
        pattern="[0-2][0-9]:[0-5][0-9]"
        placeholder="HH:mm"
        value={value}
      />
      <HiddenText id={hintId}>{TIME_FORMAT_HINT}</HiddenText>
    </>
  );
};
