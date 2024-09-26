import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS drug_money_balance DECIMAL(10, 2) DEFAULT 0
    `);
    console.log('Drug money balance column added successfully to users table');
  } catch (error) {
    console.error('Error adding drug money balance column to users table:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS drug_money_balance
    `);
    console.log('Drug money balance column removed successfully from users table');
  } catch (error) {
    console.error('Error removing drug money balance column from users table:', error);
    throw error;
  }
}