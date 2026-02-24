/**
 * Seed default categories and wallets to production database
 * Run with: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/seed-default-data.js
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

async function seedDefaultData() {
  console.log('🌱 Seeding default categories and wallets...\n');

  try {
    // First, create a default user if not exists
    const defaultUserId = 'default_user';
    await client.execute({
      sql: `INSERT OR IGNORE INTO users (id, name, email, password, role) 
            VALUES (?, ?, ?, ?, ?)`,
      args: [defaultUserId, 'User', 'user@familyfin.com', '', 'member'],
    });
    console.log('✅ Default user ready');

    // Create default categories
    const incomeCategories = [
      { id: 'cat_salary', name: 'Gaji', type: 'income', color: '#22c55e' },
      { id: 'cat_bonus', name: 'Bonus', type: 'income', color: '#16a34a' },
      { id: 'cat_investment', name: 'Investasi', type: 'income', color: '#15803d' },
      { id: 'cat_freelance', name: 'Freelance', type: 'income', color: '#14532d' },
      { id: 'cat_other_income', name: 'Lainnya', type: 'income', color: '#052e16' },
    ];

    const expenseCategories = [
      { id: 'cat_household', name: 'Rumah Tangga', type: 'expense', color: '#f97316' },
      { id: 'cat_transport', name: 'Transport', type: 'expense', color: '#3b82f6' },
      { id: 'cat_food', name: 'Makan & Minum', type: 'expense', color: '#8b5cf6' },
      { id: 'cat_baby', name: 'Kebutuhan Bayi', type: 'expense', color: '#ec4899' },
      { id: 'cat_shopping', name: 'Belanja', type: 'expense', color: '#f43f5e' },
      { id: 'cat_health', name: 'Kesehatan', type: 'expense', color: '#14b8a6' },
      { id: 'cat_entertainment', name: 'Hiburan', type: 'expense', color: '#f59e0b' },
      { id: 'cat_education', name: 'Pendidikan', type: 'expense', color: '#6366f1' },
      { id: 'cat_debt', name: 'Bayar Hutang', type: 'expense', color: '#ef4444' },
      { id: 'cat_other_expense', name: 'Lainnya', type: 'expense', color: '#6b7280' },
    ];

    // Insert categories
    for (const cat of [...incomeCategories, ...expenseCategories]) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO categories (id, name, type, color, is_default, created_at) 
              VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
        args: [cat.id, cat.name, cat.type, cat.color],
      });
    }
    console.log(`✅ Created ${incomeCategories.length + expenseCategories.length} categories`);

    // Create default wallets for the default user
    const wallets = [
      { id: 'wallet_cash', name: 'Kas', type: 'cash', balance: 0, color: '#22c55e' },
      { id: 'wallet_bca', name: 'BCA', type: 'bank', balance: 0, color: '#3b82f6', institution: 'Bank Central Asia' },
      { id: 'wallet_mandiri', name: 'Mandiri', type: 'bank', balance: 0, color: '#fbbf24', institution: 'Bank Mandiri' },
    ];

    for (const wallet of wallets) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO wallets (id, user_id, name, type, balance, color, institution, is_default, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
        args: [wallet.id, defaultUserId, wallet.name, wallet.type, wallet.balance, wallet.color, wallet.institution || null],
      });
    }
    console.log(`✅ Created ${wallets.length} wallets`);

    console.log('\n✅ Default data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${incomeCategories.length + expenseCategories.length}`);
    console.log(`   - Wallets: ${wallets.length}`);
    console.log(`   - Default User: ${defaultUserId}`);
    console.log('\n🎉 You can now add transactions!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDefaultData();
