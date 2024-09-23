import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET() {
  try {
    const result = await query('SELECT NOW()');
    return NextResponse.json({ time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}