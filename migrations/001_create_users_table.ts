import { query } from '../utils/db';

export async function up() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        balance INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
}

export async function down() {
  try {
    await query('DROP TABLE IF EXISTS users');
    console.log('Users table dropped successfully');
  } catch (error) {
    console.error('Error dropping users table:', error);
    throw error;
  }
}