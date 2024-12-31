import { testConnection } from '../lib/supabaseClient';
import { checkDatabaseHealth } from '../lib/database';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('\nChecking Supabase configuration...');
  
  // Check environment variables
  const requiredVars = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'];
  let missingVars = false;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      console.error(`❌ Missing ${varName}`);
      missingVars = true;
    } else {
      console.log(`✓ ${varName} is configured`);
    }
  }

  if (missingVars) {
    console.error('\n⚠️ Please configure missing environment variables');
    process.exit(1);
  }

  try {
    // Test basic connection
    console.log('\nTesting Supabase connection...');
    const connectionResult = await testConnection();
    
    if (!connectionResult.success) {
      console.error('❌ Connection failed:', connectionResult.error);
      process.exit(1);
    }
    
    console.log('✓ Connection successful');

    // Check database health
    console.log('\nChecking database health...');
    const health = await checkDatabaseHealth();
    
    if (health.error) {
      console.error('❌ Health check failed:', health.error);
      process.exit(1);
    }

    console.log('Database tables:');
    Object.entries(health.tables).forEach(([table, status]) => {
      console.log(`${status ? '✓' : '❌'} ${table}`);
    });
    console.log(`${health.storage ? '✓' : '❌'} Storage buckets`);

    if (!health.database || !health.storage) {
      console.error('\n⚠️ Some health checks failed');
      process.exit(1);
    }

    console.log('\n✓ All checks passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();