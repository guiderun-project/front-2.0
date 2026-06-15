import type { ChangeEvent, ReactElement } from 'react';

import { Input } from '@/components';

import { formatDateDisplay, formatDateInput } from '../utils';

type MaskedDateInputProps = Omit<
  Parameters<typeof Input>[0],
  'autoComplete' | 'inputMode' | 'onChange' | 'pattern' | 'placeholder' | 'value'
> & {
  value: string;
  onChange?: (value: string) => void;
};

export const MaskedDateInput = ({
  value,
  onChange,
  ...props
}: MaskedDateInputProps): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(formatDateInput(event.target.value));
  };

  return (
    <Input
      {...props}
      autoComplete="off"
      inputMode="numeric"
      onChange={handleChange}
      pattern="[0-9]{4}[.][0-9]{2}[.][0-9]{2}"
      placeholder="YYYY.MM.DD"
      value={formatDateDisplay(value)}
    />
  );
};
