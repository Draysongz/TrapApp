import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const result = await query('SELECT COALESCE(main_balance, 0) as main_balance FROM users WHERE telegram_id = $1', [telegramId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ balance: 0 }, { status: 200 });
    }

    return NextResponse.json({ balance: result.rows[0].main_balance });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}