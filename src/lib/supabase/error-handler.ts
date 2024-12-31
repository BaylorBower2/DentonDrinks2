export class SupabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SupabaseError';
    
    // Log detailed error information for debugging
    console.error('Supabase Error:', {
      message,
      cause,
      stack: this.stack
    });
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error instanceof Error) {
    throw new SupabaseError(error.message, error);
  }
  throw new SupabaseError('An unknown error occurred', error);
}