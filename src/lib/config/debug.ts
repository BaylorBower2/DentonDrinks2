import { z } from 'zod';

export function debugEnvVariables() {
  const vars = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  };

  console.log('Environment Variables Debug:');
  Object.entries(vars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✓ Present' : '✗ Missing'}`);
    if (value) {
      console.log(`  Length: ${value.length}`);
      console.log(`  Starts with: ${value.substring(0, 4)}...`);
    }
  });
}