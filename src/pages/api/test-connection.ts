import type { APIRoute } from 'astro';
import { testConnection } from '../../lib/supabaseClient';

export const GET: APIRoute = async () => {
  const result = await testConnection();
  
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' }
  });
};