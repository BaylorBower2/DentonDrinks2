import { supabase } from './config';
import { withRetry } from './retry';
import { SupabaseError } from './error-handler';

export async function testConnection() {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('count')
        .limit(1);

      if (error) throw new SupabaseError('Connection test failed', error);
      return { success: true, data };
    });
  } catch (error) {
    console.error('Connection test failed after retries:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}