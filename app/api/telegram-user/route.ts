import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: false });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const chatMember = await bot.getChatMember(parseInt(userId), parseInt(userId));
    
    if (!chatMember) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfilePhotos = await bot.getUserProfilePhotos(parseInt(userId), { limit: 1 });
    let photoUrl: string | null = null;

    if (userProfilePhotos.photos.length > 0) {
      const fileId = userProfilePhotos.photos[0][0].file_id;
      const file = await bot.getFile(fileId);
      if (file.file_path) {
        photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      }
    }

    const userData = {
      id: chatMember.user.id,
      username: chatMember.user.username,
      firstName: chatMember.user.first_name,
      lastName: chatMember.user.last_name,
      photoUrl
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Telegram API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}