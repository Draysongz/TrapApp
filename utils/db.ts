import { sql } from '@vercel/postgres';

export async function query(text: string, params: (string | number | boolean)[] = []) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}