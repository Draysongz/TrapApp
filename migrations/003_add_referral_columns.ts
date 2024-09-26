import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS referral_code VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255)
    `);
    console.log('Users table updated successfully with referral columns');
  } catch (error) {
    console.error('Error updating users table with referral columns:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS referral_code,
      DROP COLUMN IF EXISTS referred_by
    `);
    console.log('Referral columns removed successfully');
  } catch (error) {
    console.error('Error removing referral columns:', error);
    throw error;
  }
}