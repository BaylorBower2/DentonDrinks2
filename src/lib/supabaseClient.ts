import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { SUPABASE_CONFIG, ERROR_MESSAGES } from './config';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(ERROR_MESSAGES.MISSING_CREDENTIALS);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    fetch: createFetchWithTimeout(SUPABASE_CONFIG.REQUEST_TIMEOUT)
  }
});

function createFetchWithTimeout(timeout: number): typeof fetch {
  return (url: RequestInfo | URL, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).finally(() => clearTimeout(timeoutId));
  };
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = SUPABASE_CONFIG.MAX_RETRIES,
  delay = SUPABASE_CONFIG.INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Operation failed, retrying... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

export async function testConnection() {
  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('venues')
        .select('count')
        .limit(1)
        .single()
    );

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : ERROR_MESSAGES.CONNECTION_FAILED 
    };
  }
}