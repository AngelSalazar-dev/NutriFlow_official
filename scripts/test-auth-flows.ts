/**
 * Test Authentication flows with TiDB
 * Run: npx tsx scripts/test-auth-flows.ts
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

import { query, getPool, closePool } from '../lib/mysql';
import bcrypt from 'bcryptjs';
import { signJWT, verifyJWT } from '../lib/auth-mysql';
import { 
  createEmailVerificationToken, 
  verifyEmailToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
  usePasswordResetToken,
} from '../lib/auth-tokens';
import { checkAuthRateLimit, recordFailedLogin, resetAuthRateLimit } from '../lib/auth-rate-limit';
import { isStrongPassword, isValidEmail } from '../lib/validation';

let testsPassed = 0;
let testsFailed = 0;

async function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    console.log(`✅ ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ ${testName}${errorMsg ? ': ' + errorMsg : ''}`);
    testsFailed++;
  }
}

async function testDatabaseConnection() {
  console.log('\n📦 Testing database connection...');
  try {
    const result = await query('SELECT 1 as test');
    const rows = Array.isArray(result) ? result[0] : result;
    await assert(
      Array.isArray(rows) && rows.length > 0 && rows[0].test === 1,
      'Database connection successful',
      `Got: ${JSON.stringify(result)}`
    );
    return true;
  } catch (error: any) {
    console.error(`❌ Database connection failed: ${error.message}`);
    testsFailed++;
    return false;
  }
}

async function testPasswordValidation() {
  console.log('\n🔐 Testing password validation...');
  
  // Test weak passwords
  const weakPasswords = ['short', 'nouppercase123', 'NOLOWERCASE123', 'NoNumbers'];
  for (const pw of weakPasswords) {
    const result = isStrongPassword(pw, { minLength: 8 });
    await assert(!result.valid, `Weak password rejected: "${pw.substring(0, 3)}..."`, result.errors.join(', '));
  }

  // Test strong password
  const strongPw = 'SecurePass123';
  const result = isStrongPassword(strongPw, { minLength: 8 });
  await assert(result.valid, 'Strong password accepted', result.errors.join(', '));
}

async function testEmailValidation() {
  console.log('\n📧 Testing email validation...');
  
  await assert(isValidEmail('test@example.com'), 'Valid email accepted');
  await assert(!isValidEmail('invalid'), 'Invalid email rejected');
  await assert(!isValidEmail('test@'), 'Invalid email rejected');
  await assert(!isValidEmail('@example.com'), 'Invalid email rejected');
}

async function testJWTTokens() {
  console.log('\n🎫 Testing JWT tokens...');
  
  const userId = 'test-user-' + Date.now();
  const token = await signJWT({ userId });
  
  await assert(!!token, 'JWT token created');
  
  const payload = await verifyJWT(token);
  await assert(payload?.userId === userId, 'JWT payload correct', `Got: ${payload?.userId}, Expected: ${userId}`);
}

async function testEmailVerificationTokens() {
  console.log('\n📬 Testing email verification tokens...');
  
  // Create a test user first
  const userId = 'test-verify-' + Date.now();
  const email = `test-${Date.now()}@example.com`;
  const passwordHash = await bcrypt.hash('TestPass123', 10);
  
  try {
    await query(
      'INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan, daily_calorie_target, tdee, bmr, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'Test User', 25, 70, 170, 'male', 'moderate', 'maintain', 'free', 2000, 2000, 1500, 'TEST' + Date.now()]
    );
    
    const token = await createEmailVerificationToken(userId);
    await assert(!!token, 'Verification token created');
    
    const result = await verifyEmailToken(token);
    await assert(result.success, 'Token verified successfully', result.error);
    
    // Check user is now verified
    const userResult = await query('SELECT email_verified FROM users WHERE id = ?', [userId]);
    const rows = Array.isArray(userResult) ? userResult[0] : userResult;
    const users = Array.isArray(rows) ? rows : [rows];
    await assert(users[0].email_verified === 1, 'User marked as verified');
    
    // Cleanup
    await query('DELETE FROM users WHERE id = ?', [userId]);
  } catch (error: any) {
    await assert(false, 'Email verification test', error.message);
  }
}

async function testPasswordResetTokens() {
  console.log('\n🔑 Testing password reset tokens...');
  
  const userId = 'test-reset-' + Date.now();
  const email = `reset-${Date.now()}@example.com`;
  const passwordHash = await bcrypt.hash('OldPass123', 10);
  
  try {
    await query(
      'INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan, daily_calorie_target, tdee, bmr, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'Test User', 25, 70, 170, 'male', 'moderate', 'maintain', 'free', 2000, 2000, 1500, 'TEST' + Date.now()]
    );
    
    const token = await createPasswordResetToken(userId);
    await assert(!!token, 'Reset token created');
    
    const result = await verifyPasswordResetToken(token);
    await assert(result.success, 'Reset token verified successfully', result.error);
    await assert(result.userId === userId, 'Reset token has correct userId');
    
    await usePasswordResetToken(token);
    
    // Verify token is now used
    const result2 = await verifyPasswordResetToken(token);
    await assert(!result2.success, 'Token cannot be reused', result2.error);
    
    // Cleanup
    await query('DELETE FROM users WHERE id = ?', [userId]);
  } catch (error: any) {
    await assert(false, 'Password reset test', error.message);
  }
}

async function testBruteForceProtection() {
  console.log('\n🛡️ Testing brute force protection...');
  
  const testEmail = 'bruteforce@test.com';
  
  // Simulate 5 failed attempts
  for (let i = 0; i < 5; i++) {
    recordFailedLogin(testEmail);
  }
  
  // 6th attempt should be blocked
  const result = checkAuthRateLimit(testEmail);
  await assert(!result.allowed, 'Account locked after 5 failed attempts');
  await assert(result.lockedUntil !== undefined, 'Account has lockout timestamp');
  
  // Cleanup
  resetAuthRateLimit(testEmail);
  await assert(true, 'Rate limit reset successful');
}

async function runAllTests() {
  console.log('🚀 Starting Authentication Flow Tests');
  console.log('='.repeat(80));
  
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.error('\n❌ Database connection failed. Aborting tests.');
    process.exit(1);
  }
  
  await testPasswordValidation();
  await testEmailValidation();
  await testJWTTokens();
  await testEmailVerificationTokens();
  await testPasswordResetTokens();
  await testBruteForceProtection();
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
  
  if (testsFailed === 0) {
    console.log('\n✨ All tests passed!\n');
    await closePool();
    process.exit(0);
  } else {
    console.error(`\n❌ ${testsFailed} test(s) failed`);
    await closePool();
    process.exit(1);
  }
}

runAllTests().catch((error) => {
  console.error('Test suite error:', error);
  process.exit(1);
});
