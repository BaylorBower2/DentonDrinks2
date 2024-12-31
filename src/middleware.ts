import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  // Add request timing
  const startTime = Date.now();
  
  // Process the request
  const response = await next();
  
  // Add debug headers in non-production
  if (import.meta.env.DEV) {
    response.headers.set('X-Debug-URL', request.url);
    response.headers.set('X-Debug-Mode', 'development');
  }
  
  // Add timing header
  const duration = Date.now() - startTime;
  response.headers.set('Server-Timing', `total;dur=${duration}`);
  
  return response;
});