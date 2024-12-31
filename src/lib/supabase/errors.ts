export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseConfigError';
  }
}

export class SupabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseConnectionError';
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error instanceof Error) {
    throw new SupabaseConnectionError(error.message);
  }
  throw new SupabaseConnectionError('An unknown error occurred');
}