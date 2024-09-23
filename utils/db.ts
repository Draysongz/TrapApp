import { sql } from '@vercel/postgres';

export async function query(text: string, params: (string | number | boolean)[] = []) {
  try {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL is not defined in the environment variables');
    }
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}