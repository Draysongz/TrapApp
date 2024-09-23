import dotenv from 'dotenv';
import path from 'path';
import { up } from './migrations/001_create_users_table';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runMigration() {
  try {
    console.log('Environment variables:', process.env);
    await up();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();