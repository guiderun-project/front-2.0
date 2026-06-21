import type { ChangeEvent, ReactElement } from 'react';

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
      placeholder="HH:mm"
      value={value}
    />
  );
};
