import { normalizeApiError } from '@/api/core/apiError';

export const handleApiRequest = async <T>(request: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    const apiError = normalizeApiError(error);

    throw apiError;
  }
};
