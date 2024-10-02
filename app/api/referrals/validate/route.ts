import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const { referralCode } = await request.json();

    // Input validation: check if referralCode is provided
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Query the database
    const result = await query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);

    // Check if the referral code is valid
    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
