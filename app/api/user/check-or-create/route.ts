import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { generateReferralCode } from '@/utils/referral';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: false });

export async function POST(request: Request) {
  try {
    const { telegramId, username, firstName, lastName, photoUrl } = await request.json();
    console.log('Received user data:', { telegramId, username, firstName, lastName, photoUrl });

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    
    if (existingUser.rows.length > 0) {
      console.log('Existing user found:', existingUser.rows[0]);
      return NextResponse.json({ user: existingUser.rows[0] });
    }

    // Generate a unique referral code for the new user
    const referralCode = generateReferralCode();

    // Use provided photoUrl if available, otherwise fallback to fetching it from Telegram API
    let finalPhotoUrl = photoUrl && photoUrl !== '' ? photoUrl : null;

    // If the photoUrl is not provided, use Telegram Bot API to fetch the profile photo
    if (!finalPhotoUrl) {
      console.log('photoUrl not provided in initDataUnsafe, fetching from Bot API...');
      finalPhotoUrl = await getTelegramUserPhoto(telegramId);
    }

    // Insert the new user into the database
    const result = await query(
      'INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [telegramId, username, firstName, lastName, finalPhotoUrl, referralCode]
    );

    console.log('New user created:', result.rows[0]);
    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error in check-or-create:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}

async function getTelegramUserPhoto(userId: number): Promise<string | null> {
  try {
    const response = await bot.getUserProfilePhotos(userId, { limit: 1 });

    if (response.photos.length > 0) {
      const fileId = response.photos[0][0].file_id;
      const fileResponse = await bot.getFile(fileId);
      const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileResponse.file_path}`;

      console.log('Fetched photo URL from Telegram API:', photoUrl);
      return photoUrl;
    } else {
      console.log('No profile photo found for user');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile photo from Telegram API:', error);
    return null;
  }
}