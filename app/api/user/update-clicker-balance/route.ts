import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function POST(request: Request) {
  const { telegramId, amount } = await request.json();

  if (!telegramId || amount === undefined) {
    return NextResponse.json({ error: 'Telegram ID and amount are required' }, { status: 400 });
  }

  try {
    const result = await query(
      'UPDATE users SET clicker_balance = clicker_balance + $1 WHERE telegram_id = $2 RETURNING clicker_balance',
      [amount, telegramId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ newBalance: result.rows[0].clicker_balance });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}