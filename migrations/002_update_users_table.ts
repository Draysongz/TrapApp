import { query } from '../utils/db';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE,
      ADD COLUMN IF NOT EXISTS username VARCHAR(255),
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS photo_url TEXT
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
      DROP COLUMN username,
      DROP COLUMN first_name,
      DROP COLUMN last_name,
      DROP COLUMN photo_url,
      DROP COLUMN referral_code,
      DROP COLUMN referred_by
    `);
    console.log('Users table reverted successfully');
  } catch (error) {
    console.error('Error reverting users table:', error);
    throw error;
  }
}