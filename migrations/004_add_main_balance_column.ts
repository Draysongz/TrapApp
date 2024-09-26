import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS main_balance DECIMAL(10, 2) DEFAULT 0
    `);
    console.log('Users table updated successfully with main_balance column');
  } catch (error) {
    console.error('Error updating users table with main_balance column:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS main_balance
    `);
    console.log('main_balance column removed successfully');
  } catch (error) {
    console.error('Error removing main_balance column:', error);
    throw error;
  }
}