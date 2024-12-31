import { supabase, retryOperation } from './supabaseClient';
import { ERROR_MESSAGES } from './config';

type HealthCheckResult = {
  database: boolean;
  storage: boolean;
  tables: Record<string, boolean>;
  error: string | null;
};

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const results: HealthCheckResult = {
    database: false,
    storage: false,
    tables: {},
    error: null
  };

  try {
    await checkTables(results);
    await checkStorage(results);
    results.database = Object.values(results.tables).every(v => v);
  } catch (error) {
    results.error = error instanceof Error ? error.message : ERROR_MESSAGES.CONNECTION_FAILED;
  }

  return results;
}

async function checkTables(results: HealthCheckResult) {
  const tables = ['venues', 'reviews'];
  await Promise.all(tables.map(async (table) => {
    try {
      const { error } = await retryOperation(() => 
        supabase.from(table).select('id').limit(1)
      );
      results.tables[table] = !error;
    } catch {
      results.tables[table] = false;
    }
  }));
}

async function checkStorage(results: HealthCheckResult) {
  try {
    const { error } = await retryOperation(() =>
      supabase.storage.getBucket('review-images')
    );
    results.storage = !error;
  } catch {
    results.storage = false;
  }
}