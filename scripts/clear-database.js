/**
 * Clear ALL data from production database
 * Run with: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/clear-database.js
 */

const { createClient } = require('@libsql/client');

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Missing environment variables:');
  console.error('   TURSO_DATABASE_URL=libsql://your-db.turso.io');
  console.error('   TURSO_AUTH_TOKEN=your-token');
  process.exit(1);
}

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function clearDatabase() {
  console.log('🗑️  Clearing all data from database...\n');

  try {
    // Delete in order to avoid foreign key constraints
    console.log('📋 Deleting transactions...');
    await client.execute('DELETE FROM transactions');
    console.log('✅ transactions deleted');

    console.log('\n📋 Deleting recurring...');
    await client.execute('DELETE FROM recurring');
    console.log('✅ recurring deleted');

    console.log('\n📋 Deleting budgets...');
    await client.execute('DELETE FROM budgets');
    console.log('✅ budgets deleted');

    console.log('\n📋 Deleting goals...');
    await client.execute('DELETE FROM goals');
    console.log('✅ goals deleted');

    console.log('\n📋 Deleting debts...');
    await client.execute('DELETE FROM debts');
    console.log('✅ debts deleted');

    console.log('\n📋 Deleting wallets...');
    await client.execute('DELETE FROM wallets');
    console.log('✅ wallets deleted');

    console.log('\n📋 Deleting accounts...');
    await client.execute('DELETE FROM accounts');
    console.log('✅ accounts deleted');

    console.log('\n📋 Deleting categories...');
    await client.execute('DELETE FROM categories');
    console.log('✅ categories deleted');

    console.log('\n📋 Deleting better_auth_verifications...');
    await client.execute('DELETE FROM better_auth_verifications');
    console.log('✅ better_auth_verifications deleted');

    console.log('\n📋 Deleting better_auth_sessions...');
    await client.execute('DELETE FROM better_auth_sessions');
    console.log('✅ better_auth_sessions deleted');

    console.log('\n📋 Deleting better_auth_accounts...');
    await client.execute('DELETE FROM better_auth_accounts');
    console.log('✅ better_auth_accounts deleted');

    console.log('\n📋 Deleting users...');
    await client.execute('DELETE FROM users');
    console.log('✅ users deleted');

    console.log('\n✅ Database cleared successfully!\n');
    console.log('📊 Summary:');
    console.log('   - All transactions deleted');
    console.log('   - All accounts deleted');
    console.log('   - All categories deleted');
    console.log('   - All debts deleted');
    console.log('   - All wallets deleted');
    console.log('   - All users deleted');
    console.log('\n🎉 Database is now empty and ready for fresh start!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

clearDatabase();
