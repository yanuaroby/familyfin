/**
 * Setup production database schema and demo users for Turso
 * Run: node scripts/setup-production-db.js
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

async function setupDatabase() {
  console.log('🔧 Setting up production database...\n');

  try {
    // Create users table (BetterAuth compatible)
    console.log('📋 Creating users table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER DEFAULT 0,
        password TEXT,
        image TEXT,
        role TEXT DEFAULT 'member',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ users table created');

    // Create BetterAuth accounts table
    console.log('\n📋 Creating better_auth_accounts table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS better_auth_accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        access_token_expires_at TEXT,
        refresh_token_expires_at TEXT,
        scope TEXT,
        id_token TEXT,
        password TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ better_auth_accounts table created');

    // Create BetterAuth sessions table
    console.log('\n📋 Creating better_auth_sessions table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS better_auth_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ better_auth_sessions table created');

    // Create BetterAuth verifications table
    console.log('\n📋 Creating better_auth_verifications table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS better_auth_verifications (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ better_auth_verifications table created');

    // Create wallets table
    console.log('\n📋 Creating wallets table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0 NOT NULL,
        currency TEXT DEFAULT 'IDR',
        institution TEXT,
        last_four_digits TEXT,
        color TEXT DEFAULT '#888888',
        icon TEXT,
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ wallets table created');

    // Create categories table
    console.log('\n📋 Creating categories table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        parent_id TEXT REFERENCES categories(id),
        icon TEXT,
        color TEXT DEFAULT '#888888',
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ categories table created');

    // Create accounts table
    console.log('\n📋 Creating accounts table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0 NOT NULL,
        currency TEXT DEFAULT 'IDR',
        institution TEXT,
        last_four_digits TEXT,
        color TEXT DEFAULT '#888888',
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ accounts table created');

    // Create transactions table
    console.log('\n📋 Creating transactions table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category_id TEXT REFERENCES categories(id),
        account_id TEXT REFERENCES accounts(id),
        wallet_id TEXT REFERENCES wallets(id),
        description TEXT,
        date TEXT NOT NULL,
        is_recurring INTEGER DEFAULT 0,
        recurring_id TEXT,
        receipt_image TEXT,
        location TEXT,
        tags TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ transactions table created');

    // Create budgets table
    console.log('\n📋 Creating budgets table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        period TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        category_id TEXT REFERENCES categories(id),
        spent_amount REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ budgets table created');

    // Create goals table
    console.log('\n📋 Creating goals table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        deadline TEXT,
        icon TEXT,
        color TEXT DEFAULT '#888888',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ goals table created');

    // Create debts table
    console.log('\n📋 Creating debts table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS debts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        total_amount REAL NOT NULL,
        remaining_amount REAL NOT NULL,
        interest_rate REAL,
        monthly_payment REAL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        lender_name TEXT,
        status TEXT DEFAULT 'active',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ debts table created');

    // Create recurring transactions table
    console.log('\n📋 Creating recurring table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recurring (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        frequency TEXT NOT NULL,
        category_id TEXT REFERENCES categories(id),
        account_id TEXT REFERENCES accounts(id),
        wallet_id TEXT REFERENCES wallets(id),
        description TEXT,
        next_date TEXT NOT NULL,
        end_date TEXT,
        is_active INTEGER DEFAULT 1,
        last_executed TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ recurring table created');

    console.log('\n✅ Database schema setup complete!\n');

    // Create demo users
    console.log('👤 Creating demo users...');
    const bcrypt = require('bcryptjs');
    
    const husbandId = 'husband_' + Date.now();
    const wifeId = 'wife_' + Date.now();
    const hashedPassword = await bcrypt.hash('password', 10);

    // Check if users already exist
    const existingUsers = await client.execute('SELECT email FROM users');
    const husbandExists = existingUsers.rows.some(r => r.email === 'husband@familyfin.com');
    const wifeExists = existingUsers.rows.some(r => r.email === 'wife@familyfin.com');

    if (!husbandExists) {
      await client.execute({
        sql: 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        args: [husbandId, 'Husband', 'husband@familyfin.com', hashedPassword, 'member'],
      });
      console.log('✅ Created husband account: husband@familyfin.com');
    } else {
      console.log('⚠️  Husband account already exists');
    }

    if (!wifeExists) {
      await client.execute({
        sql: 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        args: [wifeId, 'Wife', 'wife@familyfin.com', hashedPassword, 'member'],
      });
      console.log('✅ Created wife account: wife@familyfin.com');
    } else {
      console.log('⚠️  Wife account already exists');
    }

    console.log('\n📝 Demo credentials:');
    console.log('   Email: husband@familyfin.com / Password: password');
    console.log('   Email: wife@familyfin.com / Password: password');
    console.log('\n✅ Database setup complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();
