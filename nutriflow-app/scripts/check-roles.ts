import { query } from '../lib/mysql';

async function main() {
  console.log('--- Checking User Roles ---');
  try {
    const users: any = await query("SELECT id, email, role, subscription_plan FROM users WHERE email IN ('bot5659@example.com', 'founder@nutriflow.com', 'angeluqui2017@gmail.com')");
    console.table(users);
  } catch (e) {
    console.error(e);
  }
}

main().then(() => process.exit(0));
