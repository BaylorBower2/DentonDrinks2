import type { APIRoute } from 'astro';
import { debugEnvVariables } from '../../lib/config/debug';

export const GET: APIRoute = async () => {
  try {
    debugEnvVariables();
    
    return new Response(
      JSON.stringify({ message: 'Check server logs for environment variables debug info' }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to debug environment variables' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};