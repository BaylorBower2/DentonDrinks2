import { SUPABASE_CONFIG } from '../config';

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 5000
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxAttempts) break;
      
      // Exponential backoff with jitter
      delay = Math.min(delay * 1.5 * (1 + Math.random() * 0.2), maxDelay);
      
      console.warn(
        `Operation failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delay}ms...`,
        error
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}