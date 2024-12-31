// Utility functions for URL handling
export function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function createRedirectUrl(request: Request, path: string): string {
  return new URL(path, getBaseUrl(request)).toString();
}