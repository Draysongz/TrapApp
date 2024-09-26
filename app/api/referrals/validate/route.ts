import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function POST(request: Request) {
  const { referralCode } = await request.json();

  try {
    const result = await query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);

    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}