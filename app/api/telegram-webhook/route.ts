import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: false });

export async function POST(request: Request) { // Add 'request' parameter
  const body = await request.json();
  console.log('Received webhook:', body);

  if (body.message && body.message.text === '/start') {
    const { chat: { id } } = body.message;
    const webAppUrl = 'https://trap-test.vercel.app'; // Your Vercel domain
    await bot.sendMessage(id, 'Welcome to TrapLine! Click the button below to open the app:', {
      reply_markup: {
        keyboard: [[
          {
            text: 'Open TrapLine',
            web_app: { url: webAppUrl }
          }
        ]],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook is active' });
}