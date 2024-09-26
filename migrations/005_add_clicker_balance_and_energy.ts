import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS clicker_balance DECIMAL(10, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100
    `);
    console.log('Users table updated successfully with clicker_balance and energy columns');
  } catch (error) {
    console.error('Error updating users table with clicker_balance and energy columns:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS clicker_balance,
      DROP COLUMN IF EXISTS energy
    `);
    console.log('clicker_balance and energy columns removed successfully');
  } catch (error) {
    console.error('Error removing clicker_balance and energy columns:', error);
    throw error;
  }
}