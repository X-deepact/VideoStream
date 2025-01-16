import { TOAST_STYLES } from '@/components/ui/toast';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/type/api';
import axios from 'axios';

// Centralized error handler
export const handleApiError = (error: unknown): void => {
  let errorMessage = 'An unexpected error occurred';

  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError) errorMessage = apiError.message;
    else errorMessage = error.message;
  }

  toast({
    description: errorMessage,
    className: TOAST_STYLES.ERROR,
  });
};
