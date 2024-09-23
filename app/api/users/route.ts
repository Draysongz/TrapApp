import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM users');
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}