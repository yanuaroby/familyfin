import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const tables = [
  'better_auth_sessions',
  'better_auth_accounts',
  'better_auth_verifications',
  'users',
  'categories',
  'accounts',
  'debts',
  'debt_payments',
  'transactions',
  'budgets',
  'goals',
  'recurring_transactions',
  'streaks',
  'activity_logs',
  'wallets',
];

console.log('🗑️  Dropping all tables...');

for (const table of tables) {
  try {
    await client.execute(`DROP TABLE IF EXISTS ${table}`);
    console.log(`  ✅ Dropped: ${table}`);
  } catch (e) {
    console.log(`  ⚠️  Skipped: ${table} (doesn't exist)`);
  }
}

console.log('\n✅ Database reset successfully!');
process.exit(0);
