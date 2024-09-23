import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function POST(request: Request) {
  try {
    const { telegramId } = await request.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }

    // Check if user exists
    let result = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);

    if (result.rows.length === 0) {
      // Create new user if not exists
      result = await query(
        'INSERT INTO users (telegram_id, main_balance, clicker_balance) VALUES ($1, 0, 0) RETURNING *',
        [telegramId]
      );
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}