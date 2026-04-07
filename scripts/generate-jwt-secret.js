#!/usr/bin/env node
/**
 * Generate a cryptographically secure JWT secret
 * Run: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generate a 64-byte random string and encode as base64
const secret = crypto.randomBytes(64).toString('base64');

console.log('\n🔐 Generated JWT Secret:');
console.log('='.repeat(80));
console.log(secret);
console.log('='.repeat(80));
console.log('\n📝 Add this to your .env.local file:');
console.log(`JWT_SECRET=${secret}`);
console.log('\n⚠️  IMPORTANT: Keep this secret safe and never commit it to version control!\n');
