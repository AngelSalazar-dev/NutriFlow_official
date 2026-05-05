import { query } from '../lib/mysql';

async function main() {
  const emails = ['founder@nutriflow.com', 'angeluqui2017@gmail.com', 'bot5659@example.com'];
  
  console.log('--- Promoting Users to Admin ---');
  
  for (const email of emails) {
    try {
      await query("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
      console.log(`✅ User ${email} is now an ADMIN.`);
    } catch (e) {
      console.error(`❌ Failed to promote ${email}:`, e);
    }
  }
}

main().then(() => process.exit(0));
