import { query } from '../utils/db.js';

export async function up() {
  try {
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS clicker_inventory INTEGER DEFAULT 0
    `);
    console.log('Clicker inventory column added successfully to users table');
  } catch (error) {
    console.error('Error adding clicker inventory column to users table:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS clicker_inventory
    `);
    console.log('Clicker inventory column removed successfully from users table');
  } catch (error) {
    console.error('Error removing clicker inventory column from users table:', error);
    throw error;
  }
}