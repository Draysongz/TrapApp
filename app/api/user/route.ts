import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const result = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    return NextResponse.json({
      user: {
        ...user,
        main_balance: Number(user.main_balance) || 0,
        clicker_balance: Number(user.clicker_balance) || 0,
        energy: Number(user.energy) || 100
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { telegramId, username, firstName, lastName, photoUrl } = await request.json();

    if (!telegramId || !username) {
      return NextResponse.json({ error: 'Telegram ID and username are required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, main_balance, drug_money_balance, energy, clicker_inventory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (telegram_id) DO UPDATE SET username = $2, first_name = $3, last_name = $4, photo_url = $5 RETURNING *',
      [telegramId, username, firstName, lastName, photoUrl, 0, 0, 100, 0]
    );

    const user = result.rows[0];
    return NextResponse.json({
      user: {
        ...user,
        main_balance: Number(user.main_balance) || 0,
        drug_money_balance: Number(user.drug_money_balance) || 0,
        energy: Number(user.energy) || 100,
        clicker_inventory: Number(user.clicker_inventory) || 0
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}