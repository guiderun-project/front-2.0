import { normalizeApiError } from '@/api/core/apiError';
import { captureApiError } from '@/api/core/errorLogging';

export const handleApiRequest = async <T>(request: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    const apiError = normalizeApiError(error);

    captureApiError(apiError);
    throw apiError;
  }
};
