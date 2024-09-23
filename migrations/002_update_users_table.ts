import { query } from '../utils/db';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN telegram_id BIGINT UNIQUE,
      ADD COLUMN main_balance INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN clicker_balance INTEGER NOT NULL DEFAULT 0
    `);
    console.log('Users table updated successfully');
  } catch (error) {
    console.error('Error updating users table:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN telegram_id,
      DROP COLUMN main_balance,
      DROP COLUMN clicker_balance
    `);
    console.log('Users table reverted successfully');
  } catch (error) {
    console.error('Error reverting users table:', error);
    throw error;
  }
}