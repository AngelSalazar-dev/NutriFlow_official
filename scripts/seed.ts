/**
 * Database Seed Script
 * Run this once to populate the database with initial data
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { MongoClient } from 'mongodb';
import { seedArticles } from '../lib/article-scraper';

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'nutriflow_db';

async function seed() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Seed articles using the scraper service
    console.log('\n📰 Seeding articles...');
    await seedArticles();

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Articles: 8+');
    console.log('   - Categories: nutrition, exercise, wellness, supplements');
    console.log('   - All articles marked as verified');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seed();
