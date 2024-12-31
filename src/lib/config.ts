// Configuration constants
export const SUPABASE_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 30000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

export const ERROR_MESSAGES = {
  MISSING_CREDENTIALS: 'Missing Supabase credentials. Please check your environment variables.',
  CONNECTION_FAILED: 'Failed to connect to database',
  FETCH_FAILED: 'Failed to fetch data',
};