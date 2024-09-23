import dotenv from 'dotenv';
import path from 'path';
import { query } from './utils/db';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function insertTestData() {
  try {
    // Insert test users
    await query(`
      INSERT INTO users (username, balance) VALUES
      ('TestUser1', 1000),
      ('TestUser2', 2000),
      ('TestUser3', 3000)
      ON CONFLICT (username) DO NOTHING
    `);

    console.log('Test data inserted successfully');
  } catch (error) {
    console.error('Error inserting test data:', error);
  }
}

insertTestData();