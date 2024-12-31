import { supabase } from './supabase';

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error.message);
      return {
        connected: false,
        error: error.message
      };
    }

    return {
      connected: true,
      error: null
    };
  } catch (error) {
    console.error('Failed to check Supabase connection:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}