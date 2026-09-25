/**
 * Run auth enhancements migration
 * Usage: npx tsx scripts/run-auth-migration.ts
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

import { query } from '../lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  console.log('🚀 Running auth enhancements migration...\n');

  const migrationFile = path.join(__dirname, '../database/migrations/005_auth_enhancements.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error('❌ Migration file not found:', migrationFile);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFile, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      await query(statement);
      console.log(`✅ [${i + 1}/${statements.length}] Executed successfully`);
    } catch (error: any) {
      // Ignore "already exists" and "already has column" errors
      if (
        error.message?.includes('Duplicate column') ||
        error.message?.includes('Table already exists')
      ) {
        console.log(`⚠️  [${i + 1}/${statements.length}] Already exists, skipping`);
      } else {
        console.error(`❌ [${i + 1}/${statements.length}] Error:`, error.message);
        throw error;
      }
    }
  }

  console.log('\n✨ Migration completed successfully!');
  console.log('\n📊 New tables created:');
  console.log('  - email_verification_tokens');
  console.log('  - password_reset_tokens');
  console.log('\n📊 New columns added to users table:');
  console.log('  - email_verified');
  console.log('  - email_verified_at');
  console.log('  - last_login');
  console.log('  - failed_login_attempts');
  console.log('  - locked_until\n');
}

runMigration()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
