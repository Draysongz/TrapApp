import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const result = await query('SELECT main_balance, drug_money_balance, energy, clicker_inventory FROM users WHERE telegram_id = $1', [telegramId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ mainBalance: 0, drugMoneyBalance: 0, energy: 100, clickerInventory: 0 }, { status: 200 });
    }

    const { main_balance, drug_money_balance, energy, clicker_inventory } = result.rows[0];
    return NextResponse.json({ 
      mainBalance: Number(main_balance) || 0, 
      drugMoneyBalance: Number(drug_money_balance) || 0, 
      energy: Number(energy) || 100,
      clickerInventory: Number(clicker_inventory) || 0
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}