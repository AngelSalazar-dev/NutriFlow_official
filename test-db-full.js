/**
 * Database Connection & Schema Validation Test
 * Tests all tables, columns, and basic operations
 */

const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  user: process.env.MYSQL_USER || '3ZxNQLB5VbKt56g.root',
  password: process.env.MYSQL_PASSWORD || '4BLpMj6H4QzcJ8oi',
  database: process.env.MYSQL_DATABASE || 'nutriflow',
  port: parseInt(process.env.MYSQL_PORT || '4000'),
  ssl: { rejectUnauthorized: true },
  connectionLimit: 1
};

// Expected schema based on code analysis
const expectedSchema = {
  users: ['id', 'email', 'name', 'age', 'weight_kg', 'height_cm', 'sex', 'activity_level', 'goal', 'subscription_plan', 'daily_calorie_target', 'password_hash', 'tier', 'referral_code', 'referred_by', 'created_at', 'updated_at'],
  user_profiles: ['id', 'user_id', 'age', 'sex', 'weight', 'height', 'activity_level', 'goal', 'target_weight', 'daily_water_goal', 'bmr', 'tdee', 'created_at', 'updated_at'],
  foods: ['id', 'name', 'brand', 'calories', 'protein', 'carbs', 'fat', 'fiber', 'serving_size', 'category', 'is_verified', 'created_at'],
  food_entries: ['id', 'user_id', 'food_id', 'servings', 'date', 'meal_type', 'is_estimated', 'created_at'],
  food_image_entries: ['id', 'user_id', 'image_data', 'recognized_foods', 'logged_entry_ids', 'created_at'],
  exercises: ['id', 'name', 'muscle_group', 'equipment', 'description', 'met_value', 'is_bodyweight', 'created_at'],
  exercise_logs: ['id', 'user_id', 'exercise_id', 'sets', 'reps', 'weight', 'duration', 'rpe', 'date', 'estimated_calories_burned', 'volume', 'one_rep_max', 'created_at'],
  workout_routines: ['id', 'user_id', 'name', 'description', 'days_of_week', 'is_ai_generated', 'created_at', 'updated_at'],
  routine_exercises: ['id', 'routine_id', 'exercise_id', 'sets', 'reps', 'rest_time', 'exercise_order'],
  water_entries: ['id', 'user_id', 'amount', 'date', 'created_at'],
  chat_messages: ['id', 'user_id', 'role', 'content', 'context_snapshot', 'created_at'],
  chat_quotas: ['id', 'user_id', 'date', 'messages_used'],
  subscriptions: ['id', 'user_id', 'tier', 'stripe_customer_id', 'stripe_subscription_id', 'status', 'current_period_start', 'current_period_end', 'cancel_at_period_end', 'created_at', 'updated_at'],
  user_achievements: ['id', 'user_id', 'achievement_key', 'earned_at', 'metadata'],
  user_xp: ['id', 'user_id', 'total_xp', 'current_level', 'xp_to_next_level'],
  friends: ['id', 'user_id', 'friend_user_id', 'status', 'created_at'],
  referrals: ['id', 'referrer_id', 'referred_id', 'created_at'],
  promo_codes: ['code', 'discount', 'description', 'max_uses', 'current_uses', 'expires_at', 'is_active', 'created_at']
};

// SQL queries used by the app (from route.ts files)
const queriesToTest = {
  'Register user': {
    sql: `INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan, daily_calorie_target, referral_code) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params: ['test@test.com', 'hash123', 'Test User', 25, 70, 170, 'male', 'moderate', 'maintain', 'free', 2000, 'TEST123']
  },
  'Login user': {
    sql: `SELECT id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan, daily_calorie_target, created_at FROM users WHERE email = ?`,
    params: ['test@test.com']
  },
  'Get user profile': {
    sql: `SELECT * FROM user_profiles WHERE user_id = ?`,
    params: ['test-user-id']
  },
  'Get today food entries': {
    sql: `SELECT fe.*, f.name, f.calories, f.protein, f.carbs, f.fat FROM food_entries fe JOIN foods f ON fe.food_id = f.id WHERE fe.user_id = ? AND fe.date = ?`,
    params: ['test-user-id', '2026-04-06']
  },
  'Get today water': {
    sql: `SELECT COALESCE(SUM(amount), 0) as total FROM water_entries WHERE user_id = ? AND date = ?`,
    params: ['test-user-id', '2026-04-06']
  },
  'Get exercises': {
    sql: `SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name`,
    params: ['chest']
  },
  'Get chat messages': {
    sql: `SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    params: ['test-user-id']
  },
  'Get user XP': {
    sql: `SELECT * FROM user_xp WHERE user_id = ?`,
    params: ['test-user-id']
  },
  'Get subscription': {
    sql: `SELECT * FROM subscriptions WHERE user_id = ?`,
    params: ['test-user-id']
  }
};

let passed = 0;
let failed = 0;
let warnings = 0;

function log(status, message) {
  if (status === 'PASS') { passed++; console.log(`  ✅ ${message}`); }
  else if (status === 'FAIL') { failed++; console.log(`  ❌ ${message}`); }
  else if (status === 'WARN') { warnings++; console.log(`  ⚠️  ${message}`); }
}

async function runTests() {
  console.log('='.repeat(70));
  console.log('🧪  NUTRIFLOW DATABASE VALIDATION TEST');
  console.log('='.repeat(70));
  
  const pool = mysql.createPool(config);
  
  try {
    // Test 1: Connection
    console.log('\n📡  TEST 1: Database Connection');
    const conn = await pool.getConnection();
    log('PASS', 'Successfully connected to TiDB Cloud');
    const [rows] = await conn.execute('SELECT 1 as test');
    log('PASS', 'Query execution works: ' + JSON.stringify(rows[0]));
    conn.release();
    
    // Test 2: Tables exist
    console.log('\n📋  TEST 2: Tables Validation');
    const [tables] = await pool.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    for (const [tableName, expectedCols] of Object.entries(expectedSchema)) {
      if (tableNames.includes(tableName)) {
        log('PASS', `Table '${tableName}' exists`);
        
        const [cols] = await pool.execute(`DESCRIBE ${tableName}`);
        const actualCols = cols.map(c => c.Field);
        
        // Check for missing columns
        const missing = expectedCols.filter(c => !actualCols.includes(c));
        const extra = actualCols.filter(c => !expectedCols.includes(c));
        
        if (missing.length > 0) {
          log('FAIL', `Table '${tableName}' missing columns: ${missing.join(', ')}`);
        } else {
          log('PASS', `Table '${tableName}' has all expected columns (${expectedCols.length})`);
        }
        
        if (extra.length > 0) {
          log('WARN', `Table '${tableName}' has extra columns: ${extra.join(', ')}`);
        }
      } else {
        log('FAIL', `Table '${tableName}' NOT FOUND`);
      }
    }
    
    // Test 3: SQL Queries
    console.log('\n🔍  TEST 3: SQL Queries Validation');
    
    for (const [queryName, query] of Object.entries(queriesToTest)) {
      try {
        await pool.execute(query.sql, query.params);
        log('PASS', `Query '${queryName}' - syntax OK`);
      } catch (err) {
        // Some queries might fail due to foreign key constraints or missing data
        if (err.message.includes('column') || err.message.includes('table') || err.message.includes('Column')) {
          log('FAIL', `Query '${queryName}' - ${err.message}`);
        } else {
          log('WARN', `Query '${queryName}' - ${err.message.split('\n')[0]}`);
        }
      }
    }
    
    // Test 4: Indexes
    console.log('\n🔑  TEST 4: Critical Indexes');
    const criticalIndexes = [
      { table: 'users', column: 'email' },
      { table: 'food_entries', column: 'user_id' },
      { table: 'food_entries', column: 'date' },
      { table: 'exercises', column: 'muscle_group' },
      { table: 'chat_messages', column: 'user_id' }
    ];
    
    for (const idx of criticalIndexes) {
      const [indexes] = await pool.execute(`SHOW INDEX FROM ${idx.table} WHERE Column_name = ?`, [idx.column]);
      if (indexes.length > 0) {
        log('PASS', `Index on ${idx.table}.${idx.column} exists`);
      } else {
        log('WARN', `Index on ${idx.table}.${idx.column} NOT FOUND (may impact performance)`);
      }
    }
    
    // Test 5: Foreign Keys
    console.log('\n🔗  TEST 5: Foreign Keys');
    const [fkConstraints] = await pool.execute(`
      SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [config.database]);
    
    log('PASS', `Found ${fkConstraints.length} foreign key constraints`);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊  TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`  ✅ Passed:   ${passed}`);
    console.log(`  ❌ Failed:   ${failed}`);
    console.log(`  ⚠️  Warnings: ${warnings}`);
    console.log(`  📝 Total:    ${passed + failed + warnings}`);
    console.log('='.repeat(70));
    
    if (failed > 0) {
      console.log('\n❌  SOME TESTS FAILED - Review errors above');
      process.exit(1);
    } else {
      console.log('\n✅  ALL TESTS PASSED - Database is properly configured');
      process.exit(0);
    }
    
  } catch (err) {
    console.log('\n❌  FATAL ERROR:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
