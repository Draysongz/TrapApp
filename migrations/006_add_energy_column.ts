import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100
    `);
    console.log('Energy column added successfully to users table');
  } catch (error) {
    console.error('Error adding energy column to users table:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS energy
    `);
    console.log('Energy column removed successfully from users table');
  } catch (error) {
    console.error('Error removing energy column from users table:', error);
    throw error;
  }
}