import { isAxiosError } from 'axios';

import type { ErrorType } from '@/api/types/error';

export const handleApiRequest = async <T>(request: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    if (isAxiosError<ErrorType>(error)) {
      throw error;
    }

    throw new Error('예상치 못한 에러 발생');
  }
};
